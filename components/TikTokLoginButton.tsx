"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";

export function TikTokLoginButton() {
  const { data: session, isPending } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSigningIn(true);
      await signIn.social({
        provider: "tiktok",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("TikTok sign in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div
        className="h-9 w-24 animate-pulse rounded-md bg-muted"
        aria-busy="true"
        aria-label="Loading session"
      />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <User className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span className="max-w-[120px] truncate" title={session.user.name ?? ""}>
            {session.user.name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-muted-foreground hover:text-foreground px-2"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isSigningIn}
      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
      aria-label="Sign in with TikTok"
    >
      {isSigningIn ? "Connecting..." : "Sign in with TikTok"}
    </Button>
  );
}
