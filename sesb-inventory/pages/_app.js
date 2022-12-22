import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import '../styles/globals.css'
import { mode } from '@chakra-ui/theme-tools'
import { Poppins, Lato } from "@next/font/google";

const section = Lato({
  weight: '300',
  subsets: ['latin']
})

const poppin = Poppins({
  weight: '200',
  subsets: ['latin'],
})

const poppin_title = Poppins({
  weight: '600',
  subsets: ['latin']
})

const overrides = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  fonts: {
    navbar : {
      200 : `${poppin.style.fontFamily}, sans-serif`,
      600: `${poppin_title.style.fontFamily}, sans-serif`,
    },
    section : `${section.style.fontFamily}, sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('cyan.50', 'gray.800')(props)
      },
    }),
  },
})

export default function App({ Component, pageProps, session }) {
  return( 
    <SessionProvider session={session}>
      <ChakraProvider theme={overrides}>
        <Component {...pageProps} /> 
      </ChakraProvider>
    </SessionProvider>
  )
}
