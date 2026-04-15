export type AppEnv = "development" | "preview" | "production";
export type PublicAppMode = "configured" | "demo" | "misconfigured";

type PublicAppConfig = {
  appEnv: AppEnv;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseConfigured: boolean;
  localDemoAuthEnabled: boolean;
  missingPublicEnvVars: string[];
};

function parseBoolean(value: string | undefined) {
  return value === "true" || value === "1";
}

function normalizeAppEnv(value: string | undefined): AppEnv {
  if (value === "production" || value === "preview") {
    return value;
  }

  return "development";
}

function buildPublicAppConfig(): PublicAppConfig {
  const appEnv = normalizeAppEnv(process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const requestedLocalDemoAuth = parseBoolean(process.env.NEXT_PUBLIC_ENABLE_LOCAL_DEMO_AUTH);
  const missingPublicEnvVars = [
    !supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !supabaseAnonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null
  ].filter(Boolean) as string[];

  return {
    appEnv,
    supabaseUrl,
    supabaseAnonKey,
    supabaseConfigured: missingPublicEnvVars.length === 0,
    localDemoAuthEnabled: requestedLocalDemoAuth && appEnv !== "production",
    missingPublicEnvVars
  };
}

const publicAppConfig = buildPublicAppConfig();

export function getPublicAppConfig() {
  return publicAppConfig;
}

export function getPublicAppMode(): PublicAppMode {
  if (publicAppConfig.localDemoAuthEnabled) {
    return "demo";
  }

  if (publicAppConfig.supabaseConfigured) {
    return "configured";
  }

  return "misconfigured";
}

export function getSupabaseBrowserEnv() {
  if (!publicAppConfig.supabaseConfigured) {
    return null;
  }

  return {
    url: publicAppConfig.supabaseUrl,
    anonKey: publicAppConfig.supabaseAnonKey
  };
}

export function getSupabaseConfigErrorMessage() {
  return `Supabase n'est pas configuré. Renseigne ${publicAppConfig.missingPublicEnvVars.join(" et ")} dans .env.local.`;
}
