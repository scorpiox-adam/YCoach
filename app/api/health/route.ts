import { NextResponse } from "next/server";

import { getPublicAppConfig, getPublicAppMode } from "@/lib/config/env";

export function GET() {
  const config = getPublicAppConfig();

  return NextResponse.json({
    ok: true,
    product: "YCoach",
    appEnv: config.appEnv,
    mode: getPublicAppMode(),
    supabaseConfigured: config.supabaseConfigured,
    localDemoAuthEnabled: config.localDemoAuthEnabled,
    missingPublicEnvVars: config.missingPublicEnvVars
  });
}
