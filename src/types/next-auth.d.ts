import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rol: "ADMIN" | "USUARIO";
  }

  interface Session {
    user: {
      id: string;
      rol: "ADMIN" | "USUARIO";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rol: "ADMIN" | "USUARIO";
  }
}
