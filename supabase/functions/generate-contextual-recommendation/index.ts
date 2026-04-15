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
    const trigger = body.trigger ?? "unknown";
    const context = body.context ?? {};

    const response = await callOpenAI(apiKey, {
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content:
            "Génère une recommandation contextuelle courte pour YCoach. Retourne du JSON strict: context, suggestion, justification, expectedImpact. La suggestion doit être concrète, contrôlable par l'utilisateur et non médicale."
        },
        {
          role: "user",
          content: `Trigger: ${trigger}\nContext: ${JSON.stringify(context)}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "recommendation_payload",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              context: { type: "string" },
              suggestion: { type: "string" },
              justification: { type: "string" },
              expectedImpact: { type: "string" }
            },
            required: ["context", "suggestion", "justification", "expectedImpact"]
          }
        }
      }
    });

    return json({ ok: true, response });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});

