// Sends a checked waiting-list sign-up to the Motion Dynamics squash server, which stores the list (this site is
// static). The server allows this site's address to post here. Resolves with the thanks message once it is stored;
// rejects on any other answer (error.status holds it) so the form offers a retry.

export const WAITLIST_URL = 'https://web-production-fcb85.up.railway.app/api/waitlist';

export async function submitAccessRequest(request, send = globalThis.fetch) {
  const response = await send(WAITLIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: request.name, email: request.email }),
    credentials: 'omit',
  });
  if (!response.ok)
    throw Object.assign(new Error(`Waiting list answered ${response.status}`), { status: response.status });
  return {
    status: 'sent',
    message: "Thanks, you're on the waiting list. We'll email you when Motion Dynamics squash opens.",
  };
}
