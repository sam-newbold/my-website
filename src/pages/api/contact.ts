import type { APIRoute } from "astro";

export const prerender = false; // keep endpoint server-only

export const POST: APIRoute = async ({ request }) => {
  const data       = await request.formData();
  const firstName  = data.get("first_name")?.toString();
  const lastName   = data.get("last_name")?.toString();
  const email      = data.get("email")?.toString();
  const phone      = data.get("phone")?.toString() ?? "";   // optional
  const message    = data.get("message")?.toString();

  // Validate required fields
  if (!firstName || !lastName || !email || !message) {
    return new Response(
      JSON.stringify({ message: "First name, last name, email and message are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Build payload expected by Relay playbook
  const payload = JSON.stringify({
    first_name: firstName,
    last_name : lastName,
    email,
    phone,
    message,
  });

  // Forward to Relay webhook
  const relayRes = await fetch(
    "https://hook.relay.app/api/v1/playbook/cmc1jtjsg041b0om4308b4e8l/trigger/6fzH0j31RPGqkzojYv5dog",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }
  );

  if (!relayRes.ok) {
    return new Response(
      JSON.stringify({ message: "Upstream error. Please try again later." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ message: "Success! Your message has been sent." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};