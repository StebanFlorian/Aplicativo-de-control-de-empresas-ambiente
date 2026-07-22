import type { NextAuthConfig } from "next-auth";

// Config edge-safe: sin proveedores que dependan de Prisma/Node APIs.
// Usado por el middleware (Edge Runtime) y extendido en auth.ts (Node runtime).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as "ADMIN" | "USUARIO";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
