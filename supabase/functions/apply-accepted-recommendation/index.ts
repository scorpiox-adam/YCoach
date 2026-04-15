import { getAuthenticatedUser, createServiceClient } from "../_shared/auth.ts";
import { corsHeaders, json } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getAuthenticatedUser(request);
    const body = await request.json();
    const recommendationId = body.recommendationId as string | undefined;

    if (!recommendationId) {
      return json({ error: "missing_recommendation_id" }, 400);
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("ai_recommendations")
      .update({ status: "accepted" })
      .eq("id", recommendationId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return json({
      ok: true,
      recommendationId,
      applied: false,
      message:
        "La recommandation est marquée comme acceptée. Toute modification structurelle du plan doit encore passer par une étape métier explicite."
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});

