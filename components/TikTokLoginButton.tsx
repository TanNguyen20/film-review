"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export function TikTokLoginButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    try {
      setIsPending(true);
      await authClient.signIn.social({
        provider: "tiktok",
        callbackURL: "/", // Target redirect route upon successful login
      });
    } catch (error) {
      console.error("TikTok authentication failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isPending}
      className="w-2 sm:flex w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
      aria-label="Sign in with TikTok"
    >
      {isPending ? "Connecting..." : "Sign in with TikTok"}
    </Button>
  );
}