import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

const adminEmails = process.env.ADMIN_EMAIL

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: ({ session, token, user }) => {
            if (adminEmails.includes(session?.user?.email)) {
                return session
            } else {
                return false
            }
        }
    }
}

export default NextAuth(authOptions)

export const isAdminReq = async (req, res) => {
    const session = await getServerSession(req, res, authOptions)
    if (!adminEmails.includes(session?.user?.email)) {
        res.status(401).end()
    }
}
