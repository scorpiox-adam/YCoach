import { getPublicAppConfig } from "@/lib/config/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const localAuthStorageKey = "ycoach.local-auth";
const onboardingStorageKey = "ycoach.onboarding-complete";
const anonymousOnboardingKey = "__anonymous__";

type LocalAuthState = {
  email: string;
  signedInAt: string;
};

type OnboardingStateMap = Record<string, boolean>;

export type ClientAuthState = {
  isAuthenticated: boolean;
  email: string | null;
  userId: string | null;
  provider: "supabase" | "local";
};

function normalizeIdentityKey(identity?: string | null) {
  const value = identity?.trim().toLowerCase();
  return value && value.length > 0 ? value : anonymousOnboardingKey;
}

function readOnboardingStateMap(): OnboardingStateMap {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(onboardingStorageKey);
  if (!raw) {
    return {};
  }

  if (raw === "true" || raw === "false") {
    return {
      [anonymousOnboardingKey]: raw === "true"
    };
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean")
    ) as OnboardingStateMap;
  } catch {
    return {};
  }
}

function writeOnboardingStateMap(value: OnboardingStateMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(onboardingStorageKey, JSON.stringify(value));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Une erreur inconnue est survenue.";
}

export function getAuthIdentityKey(identity?: Pick<ClientAuthState, "userId" | "email"> | string | null) {
  if (!identity) {
    return null;
  }

  if (typeof identity === "string") {
    return normalizeIdentityKey(identity);
  }

  return identity.userId ?? (identity.email ? normalizeIdentityKey(identity.email) : null);
}

export function buildBrowserRedirectUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

export function sanitizeInternalPath(path: string | null | undefined, fallback = "/agenda") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}

export function getFriendlyAuthErrorMessage(error: unknown) {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirme ton adresse email avant de te connecter.";
  }

  if (normalized.includes("user already registered")) {
    return "Un compte existe deja pour cet email.";
  }

  if (normalized.includes("password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caracteres.";
  }

  if (normalized.includes("signup is disabled")) {
    return "La creation de compte est momentanement indisponible.";
  }

  if (normalized.includes("rate limit")) {
    return "Trop de tentatives. Reessaie dans quelques minutes.";
  }

  if (normalized.includes("expired") || normalized.includes("otp_expired")) {
    return "Le lien a expire. Demande-en un nouveau pour continuer.";
  }

  return message;
}

export function getPostAuthRedirectPath(identity?: Pick<ClientAuthState, "userId" | "email"> | string | null) {
  return readOnboardingComplete(getAuthIdentityKey(identity)) ? "/agenda" : "/onboarding";
}

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
}

export function readOnboardingComplete(identity?: string | null) {
  if (typeof window === "undefined") {
    return false;
  }

  const onboardingState = readOnboardingStateMap();
  const key = normalizeIdentityKey(identity);

  if (key in onboardingState) {
    return onboardingState[key];
  }

  return identity ? Boolean(onboardingState[anonymousOnboardingKey]) : false;
}

export function setOnboardingComplete(value: boolean, identity?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  const onboardingState = readOnboardingStateMap();
  const key = normalizeIdentityKey(identity);

  onboardingState[key] = value;

  if (identity) {
    delete onboardingState[anonymousOnboardingKey];
  }

  writeOnboardingStateMap(onboardingState);
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

export async function getClientAuthState(): Promise<ClientAuthState> {
  const config = getPublicAppConfig();
  const supabase = createSupabaseBrowserClient();

  if (supabase) {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session?.user) {
      return {
        isAuthenticated: true,
        userId: session.user.id,
        email: session.user.email ?? null,
        provider: "supabase" as const
      };
    }
  }

  if (!config.localDemoAuthEnabled) {
    return {
      isAuthenticated: false,
      userId: null,
      email: null,
      provider: "supabase" as const
    };
  }

  const local = readLocalAuthState();

  return {
    isAuthenticated: Boolean(local),
    userId: null,
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
