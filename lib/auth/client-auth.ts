import { getPublicAppConfig } from "@/lib/config/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const localAuthStorageKey = "ycoach.local-auth";
const onboardingStorageKey = "ycoach.onboarding-complete";

type LocalAuthState = {
  email: string;
  signedInAt: string;
};

export function persistLocalAuth(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (!getPublicAppConfig().localDemoAuthEnabled) {
    return;
  }

  const payload: LocalAuthState = {
    email,
    signedInAt: new Date().toISOString()
  };

  window.localStorage.setItem(localAuthStorageKey, JSON.stringify(payload));
}

export function clearLocalAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(localAuthStorageKey);
  window.localStorage.removeItem(onboardingStorageKey);
}

export function readOnboardingComplete() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(onboardingStorageKey) === "true";
}

export function setOnboardingComplete(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(onboardingStorageKey, String(value));
}

export function readLocalAuthState() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!getPublicAppConfig().localDemoAuthEnabled) {
    return null;
  }

  const raw = window.localStorage.getItem(localAuthStorageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LocalAuthState;
  } catch {
    return null;
  }
}

export async function getClientAuthState() {
  const config = getPublicAppConfig();
  const supabase = createSupabaseBrowserClient();

  if (supabase) {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user) {
      return {
        isAuthenticated: true,
        email: session.user.email ?? null,
        provider: "supabase" as const
      };
    }
  }

  if (!config.localDemoAuthEnabled) {
    return {
      isAuthenticated: false,
      email: null,
      provider: "supabase" as const
    };
  }

  const local = readLocalAuthState();

  return {
    isAuthenticated: Boolean(local),
    email: local?.email ?? null,
    provider: "local" as const
  };
}

export async function signOutClient() {
  const supabase = createSupabaseBrowserClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  clearLocalAuth();
}
