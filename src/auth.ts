import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.githubId = account.providerAccountId;
        token.name = user.name;
        token.email = user.email;
        token.avatarUrl = user.image;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubId: account.providerAccountId,
            name: user.name,
            email: user.email,
            avatarUrl: user.image,
          }),
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = `${token.githubId}`;
        session.user.email = token.email?.split("@")[0] || "";
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
});