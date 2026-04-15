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

    const response = await callOpenAI(apiKey, {
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content:
            "Retourne un JSON strict pour le bilan hebdomadaire YCoach. Format: factualSummary[3-5], suggestions[1-3] avec title et reason. Aucune promesse de résultat, aucun ton culpabilisant."
        },
        {
          role: "user",
          content: JSON.stringify(body.weekData ?? {})
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "weekly_summary",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              factualSummary: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: { type: "string" }
              },
              suggestions: {
                type: "array",
                minItems: 1,
                maxItems: 3,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    reason: { type: "string" }
                  },
                  required: ["title", "reason"]
                }
              }
            },
            required: ["factualSummary", "suggestions"]
          }
        }
      }
    });

    return json({ ok: true, response });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});

