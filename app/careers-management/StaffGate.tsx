"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const STAFF_DOMAIN = "willowed.org";

// Mirrors public.is_willow_staff() in Supabase, which is what actually protects
// the data: applications and resumes are only readable by these users.
function isWillowStaff(session: Session | null) {
  const user = session?.user;
  if (!user?.email) return false;
  const providers = (user.app_metadata?.providers as string[] | undefined) ?? [];
  return user.email.toLowerCase().endsWith(`@${STAFF_DOMAIN}`) && providers.includes("google");
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 p-8 text-center">
        {children}
      </div>
    </div>
  );
}

export function StaffGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = () => {
    supabase?.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
        queryParams: { hd: STAFF_DOMAIN, prompt: "select_account" },
      },
    });
  };

  const signOut = () => {
    supabase?.auth.signOut();
  };

  if (isLoading) {
    return (
      <CenteredCard>
        <p className="text-secondary text-sm">Loading...</p>
      </CenteredCard>
    );
  }

  if (!supabase) {
    return (
      <CenteredCard>
        <p className="text-secondary text-sm">Database connection not available.</p>
      </CenteredCard>
    );
  }

  if (!session) {
    return (
      <CenteredCard>
        <h1 className="font-heading text-2xl font-medium text-heading mb-2">Careers management</h1>
        <p className="text-secondary text-sm mb-6">
          Sign in with your @{STAFF_DOMAIN} Google account to continue.
        </p>
        <button
          onClick={signIn}
          className="w-full h-12 px-4 bg-[#062F29] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:rounded-[14px]"
        >
          Sign in with Google
        </button>
      </CenteredCard>
    );
  }

  if (!isWillowStaff(session)) {
    return (
      <CenteredCard>
        <h1 className="font-heading text-2xl font-medium text-heading mb-2">No access</h1>
        <p className="text-secondary text-sm mb-6">
          You&apos;re signed in as {session.user.email}. This page is only available to
          @{STAFF_DOMAIN} Google accounts.
        </p>
        <button
          onClick={signOut}
          className="w-full h-12 px-4 border border-gray-300 text-heading rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Sign out and try another account
        </button>
      </CenteredCard>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/careers-management" className="font-heading text-base font-medium text-heading">
            Careers management
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-secondary">{session.user.email}</span>
            <button onClick={signOut} className="text-secondary hover:text-heading transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
