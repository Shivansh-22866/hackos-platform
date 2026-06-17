## Q1 — Real-Time Leaderboard

> Design a leaderboard that updates in real time as judges submit scores. Visible to up to 5,000 concurrent viewers during the final judging hour.

The leaderboard is a *unidirectional* data flow: the server pushes rank updates; the client never sends leaderboard data back. WebSocket's bidirectionality buys nothing here and introduces real costs:

| Property | SSE (HTTP/2) | WebSocket | Long-polling |
|---|---|---|---|
| Direction | Server → client | Bidirectional | Server → client (simulated) |
| Protocol overhead | Minimal (HTTP) | Handshake + framing | Full HTTP request/response each cycle |
| HTTP/2 multiplexing | Many streams per connection | Separate TCP connection | Separate TCP per request |
| Auto-reconnect | Built into `EventSource` spec | Must implement manually | N/A |
| Load balancer compatibility | Standard HTTP | Requires WS-aware LB | Standard HTTP |
| Firewall/proxy friendliness | Port 443, standard TLS | Sometimes blocked | Viable |

With HTTP/2, a single physical connection multiplexes many SSE streams. At 5,000 concurrent viewers on a modern server (e.g. Node.js cluster + nginx), this is well within range — each SSE stream is a long-lived HTTP response with `Content-Type: text/event-stream`. Compare to WebSocket which would require 5,000 distinct TCP sockets.

**Polling is ruled out immediately.** At 5,000 clients polling every 2 seconds, you generate 150,000 HTTP requests per minute just for leaderboard data. SSE generates zero client-initiated requests after connection.


Judges submit scores from different clients at different times. Network jitter, server load differences, or a retry can cause a lower-`sequence` update to arrive after a higher one.

Every SSE event carries:
- `sequence` — a monotonically increasing integer per event (from a Redis `INCR` counter, globally ordered per event)
- `scored_at` — wall-clock timestamp (for display only, not ordering)

If a gap persists for more than 3 seconds (e.g. `sequence 1041` never arrives but `1042` did), the client emits a `GET /api/leaderboard/event-1?after=1040` to re-sync from the backend and reset `appliedSequence`. This prevents a single lost SSE event from freezing the leaderboard indefinitely.

For avoiding re-rendering on the Frontend, Data layer separation via Zustand can be helpful as components use only the part of the data they need. If the leaderboard exceeds ~100 rows, use `react-window` (`FixedSizeList`) so only the visible rows are in the DOM. At 5,000 teams, rendering 5,000 DOM nodes would kill paint performance regardless of how efficient React's diffing is.

In case of graceful degradation, we can use Polling Fallback when a user re-tries connecting, until they exceed max retries. Additionally, on reconnect the client sends `?after={lastAppliedSequence}` in the SSE URL. The server can replay any missed events in the initial response batch, so no gap appears in the timeline.

## Q2 — 50,000 Registrations in One Day

> The platform is announced on a popular developer newsletter. 50,000 people attempt to register within 24 hours. How does the frontend handle this without degrading the experience?


For absorbing the hammering of the API, we can use Idempotency keys.

When the registration form mounts, it generates a UUID stored in `sessionStorage`, if the user double-clicks Submit, or the browser retries due to a network timeout, the backend de-duplicates based on this key. The second identical request gets a `200` with the already-created registration, not a duplicate write.

We can also ensure that the Submit button is immediately disabled and enters a loading state on click. It stays disabled until the response resolves. This eliminates accidental double-submissions at the UI layer without any debounce timer complexity.

When the backend is overwhelmed, the worst UX is a spinner with no context. Users retry compulsively, multiplying load.

**Virtual queue implementation**

If the `/api/registrations` endpoint returns `202 Accepted` with a queue position, the frontend enters a "waiting room" state

**CDN and Asset Strategy**

The landing page must stay fast regardless of API health. The two concerns are independent: *static asset delivery* and *API availability*.

Assets are served from CDN with content-hashed filenames at 1-year max-age; GET /api/events is edge-cached for 30s; the registration flow is lazy-loaded. On 503, the client retries with exponential backoff, preserves form state in localStorage with a 1h TTL, and shows honest countdown messaging.

## Q3 — Duplicate Registration Prevention

> A participant tries to register twice — same email, different browser session. How do you prevent this from the frontend, and what is the contract between frontend and backend?


Prevention happens in layers, from cheapest to most reliable:

**Layer 1: localStorage check (< 1ms, no network)**

On registration form mount, check if a successful registration was recorded locally. So we can check if the registration is happening on the same browser of the same device.

**Layer 2: Debounced email check endpoint (one cheap GET, ~50ms)**

As the user types their email in Step 1, The `/api/registrations/check` endpoint is a read-only indexed lookup on `(email, event_id)` which is fast, cheap and safe to call frequently.

**Layer 3: Idempotency key (same browser, accidental double-submit)**

A UUID generated at form mount prevents duplicate POSTs from the same session even if the user clicks Submit twice before the first response returns.

**Edge Case: Two Tabs Simultaneously Submitting**

This is the hardest case. Tab A and Tab B have the same email, same event, both on Step 4, both click Submit within milliseconds of each other.

**Prevention strategy: BroadcastChannel + database atomic constraint**

Suppose two tabs with same email are to send the registration

```
Tab A sends:  { type: 'SUBMITTING', email: 'alice@mit.edu', tabId: 'tab-a' }
Tab B receives SUBMITTING from tab-a → stands down, starts polling
Tab A receives its own message (ignored, tabId matches)
Tab A's POST succeeds → sends { type: 'REGISTERED', registrationId: 'reg-001' }
Tab B receives REGISTERED → navigates to dashboard
```

**Backend**

The database has a unique constraint on `(email, event_id)` or `(user_id, event_id)`. Even if both POST requests arrive simultaneously, only one will succeed; the other will get a constraint violation that maps to `409 DUPLICATE_REGISTRATION`.

## Q4 — Notification System for Announcements

> Organizers broadcast real-time announcements to all active participants. Design the notification system from the frontend's perspective.

Announcements are server-initiated, broadcast to all participants, and require no client-to-server message. SSE is the correct primitive. A single Redis Pub/Sub channel (`announcements:event-1`) fans messages out to all connected SSE streams. All three UI layers are used: sticky dismissable banner for critical, auto-dismissing toast for all priorities, and a permanent notification center with unread badge. IndexedDB persists notifications across refresh; Page Visibility API queues a summary toast on tab focus; Web Notifications API delivers OS-level alerts for critical messages when the tab is backgrounded and BroadcastChannel syncs read state across tabs.

## Q5 — Offline Resilience and Progressive Enhancement

> The hackathon runs for 48 hours. Participants work in venues with intermittent Wi-Fi. Design the frontend to be resilient to connectivity loss — especially during project submission.

Project submission form auto-saves to IndexedDB every 30s. Offline submission goes into an IndexedDB outbox queue and drains on reconnect, with idempotency keys preventing double-submission. The Background Sync API is registered as a service worker sync event for true close-tab persistence. Deadline enforcement is explicitly server-side (received_at), and the client warns the user if they queued close to the deadline and connectivity hasn't restored.