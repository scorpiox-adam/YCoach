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
    const imageBase64 = body.imageBase64 as string | undefined;
    const nutritionTargets = body.nutritionTargets as Record<string, number> | undefined;

    if (!imageBase64) {
      return json({ error: "missing_image" }, 400);
    }

    const response = await callOpenAI(apiKey, {
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Tu analyses une photo de repas. Retourne un JSON strict avec items[], confidence et summary. L'estimation doit rester modifiable par l'utilisateur. Intègre le contexte de macros du jour si présent."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Objectifs du jour: ${JSON.stringify(nutritionTargets ?? {})}`
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${imageBase64}`
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "meal_estimate",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              confidence: { type: "number" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    label: { type: "string" },
                    portion: { type: "string" },
                    calories: { type: "number" },
                    protein: { type: "number" },
                    carbs: { type: "number" },
                    fats: { type: "number" }
                  },
                  required: ["label", "portion", "calories", "protein", "carbs", "fats"]
                }
              }
            },
            required: ["summary", "confidence", "items"]
          }
        }
      }
    });

    return json({ ok: true, response });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});

