import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleProfile = profile as GoogleProfile;
        token.id = googleProfile.id;
        token.name = googleProfile.name;
        token.email = googleProfile.email;
        token.picture = googleProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // session!.user!.id = token.id;
      session!.user!.name = token.name;
      session!.user!.email = token.email;
      session!.user!.image = token.picture;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);
