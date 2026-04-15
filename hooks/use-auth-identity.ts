"use client";

import { useEffect, useState } from "react";

import {
  getAuthIdentityKey,
  getClientAuthState,
  type ClientAuthState
} from "@/lib/auth/client-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useAuthIdentity() {
  const [authState, setAuthState] = useState<ClientAuthState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refreshAuthState() {
      const nextState = await getClientAuthState();

      if (!cancelled) {
        setAuthState(nextState);
      }
    }

    void refreshAuthState();

    const supabaseClient = createSupabaseBrowserClient();
    if (!supabaseClient) {
      return () => {
        cancelled = true;
      };
    }

    const { data: listener } = supabaseClient.auth.onAuthStateChange(() => {
      void refreshAuthState();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    authState,
    identityKey: getAuthIdentityKey(authState),
    isLoading: authState === null
  };
}
