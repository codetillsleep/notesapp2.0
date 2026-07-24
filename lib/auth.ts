import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        throw new Error("Email is required");
      }

      await connectDB();

      let user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

      // Auto-provision guest user if guest login is triggered
      if (!user && credentials.email.toLowerCase().trim() === "guest@10gpa.in") {
        const hashedPassword = await bcrypt.hash("10gpa.in", 10);
        user = await User.create({
          name: "Guest Student",
          email: "guest@10gpa.in",
          password: hashedPassword,
          provider: "credentials",
        });
      }

      if (!user) throw new Error("No user found with this email");

      // Check if user has a password (not OAuth user)
      if (!user.password) {
        throw new Error("Please sign in with Google or GitHub");
      }

      const isValid = await bcrypt.compare(
        credentials.password || "",
        user.password
      );

      if (!isValid) throw new Error("Invalid password");

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    },
  }),
];

// Only add Google provider if credentials are fully configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Only add GitHub provider if credentials are fully configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email?.toLowerCase() });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email?.toLowerCase(),
            image: user.image,
            provider: account.provider,
          });
        } else {
          if (!existingUser.provider) {
            existingUser.provider = account.provider;
            existingUser.image = user.image;
            await existingUser.save();
          }
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "default_secret_key_10gpa_change_in_production",
};
