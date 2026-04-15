import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const encryptionKey =
  Deno.env.get("YCOACH_ENCRYPTION_KEY") ??
  Deno.env.get("SUPABASE_ENCRYPTION_KEY") ??
  "";

export function createServiceClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const supabase = createServiceClient();
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Invalid session");
  }

  return data.user;
}

function decodeBase64(base64: string) {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

export async function decryptSecret(payload: string | null) {
  if (!payload) {
    return null;
  }

  if (!encryptionKey) {
    throw new Error("Missing YCOACH_ENCRYPTION_KEY");
  }

  const [ivBase64, cipherBase64] = payload.split(":");
  if (!ivBase64 || !cipherBase64) {
    return payload;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    decodeBase64(encryptionKey),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decodeBase64(ivBase64) },
    key,
    decodeBase64(cipherBase64)
  );

  return new TextDecoder().decode(decrypted);
}

export async function getUserOpenAiKey(userId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("openai_api_key_encrypted")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return decryptSecret(data?.openai_api_key_encrypted ?? null);
}

export async function callOpenAI(apiKey: string, body: Record<string, unknown>) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${text}`);
  }

  return response.json();
}
