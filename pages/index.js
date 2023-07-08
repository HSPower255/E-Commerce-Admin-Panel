import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"

const Home = () => {
  const { data: session } = useSession()

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          <b>Bienvenido de nuevo, administrador.</b>
        </h2>
        <div className="flex bg-gray-200 text-black gap-1 rounded-lg overflow-hidden">
          <img referrerPolicy='no-referrer' src={session?.user?.image} className="w-6 h-6 sm: w-0" alt="" />
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  )
}

export default Home