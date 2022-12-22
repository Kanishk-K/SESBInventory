import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages:{
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.isActive = user.isActive
      session.user.isAdmin = user.isAdmin
      return session
    }
  }
}

export default NextAuth(authOptions)