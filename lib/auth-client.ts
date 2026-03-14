// better-auth React client — useSession and other hooks come from "better-auth/react"
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export const { useSession, signIn, signOut } = authClient;
export { authClient };
