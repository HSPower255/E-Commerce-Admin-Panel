import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from "react"
import Head from 'next/head'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [isHydrating, setIsHydrating] = useState(true)

  useEffect(() => {
    setIsHydrating(false)
  }, [])

  return (
    <>
      <Head>
        <title>SaludArmonia - AdminPanel</title>
      </Head>
      {isHydrating ? null : (
        <SessionProvider session={session}>
          <Component {...pageProps} />
          <Toaster />
        </SessionProvider>
      )}
    </>
  )
}