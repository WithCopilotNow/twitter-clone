import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { dbUserSchema, User } from "./models/user";
import { connectToDatabase } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account || !account.providerAccountId) throw new Error("account is null, undefined, or providerAccountId is missing.")
        await connectToDatabase();
        const dbUser = await User.findOne({ githubId: account.providerAccountId });
        if (!dbUser) {
          await User.create({
            githubId: account.providerAccountId,
            name: user.name,
            email: user.email,
            avatarUrl: user.image,
          });
        }
        dbUserSchema.parse(dbUser);
        return true;
      } catch (err) {
        console.error("Error while creating new user: ", err);
        return false;
      }
    },
    async session({ session }) {
      try {
        if(!session.user.email) throw new Error("Invalid Email");
        await connectToDatabase();
        const dbUser = await User.findOne({ email: session.user.email });
        const parsedUser = dbUserSchema.parse(dbUser);
        session.user.id = parsedUser._id;
        session.user.email = parsedUser.userId;
      } catch (err) {
        console.error(err);
      } finally {
        return session;
      }
    },
  },
});
