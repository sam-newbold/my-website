import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data  = await request.formData();
  const name  = data.get("name")?.toString();
  const email = data.get("email")?.toString();

  if (!email) {
    return new Response(
      JSON.stringify({ message: "Email is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Forward to Relay webhook
  const payload = JSON.stringify({ name, email });

  const relayRes = await fetch(
    "https://hook.relay.app/api/v1/playbook/cmc1j5vc201u50om45xl71yro/trigger/Y75CYavp-tnaLuH7qhUmEw",
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
    JSON.stringify({ message: "Success! Check your inbox shortly." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};