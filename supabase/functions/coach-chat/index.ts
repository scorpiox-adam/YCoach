import { callOpenAI, getAuthenticatedUser, getUserOpenAiKey } from "../_shared/auth.ts";
import { corsHeaders, json } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getAuthenticatedUser(request);
    const apiKey = await getUserOpenAiKey(user.id);
    if (!apiKey) {
      return json({ error: "missing_openai_key" }, 400);
    }

    const body = await request.json();
    const message = body.message as string | undefined;
    const context = body.context ?? {};

    if (!message) {
      return json({ error: "missing_message" }, 400);
    }

    const response = await callOpenAI(apiKey, {
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content:
            "Tu es le Coach IA YCoach. Ton ton est bienveillant direct. Tu n'adoptes jamais une posture médicale, ne promets jamais de résultat, expliques toujours ton raisonnement et ne décides jamais à la place de l'utilisateur."
        },
        {
          role: "user",
          content: `Contexte structuré: ${JSON.stringify(context)}\n\nMessage utilisateur: ${message}`
        }
      ],
      max_output_tokens: 500
    });

    return json({ ok: true, response });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});

