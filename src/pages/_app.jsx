import 'focus-visible'
import '@/styles/tailwind.css'
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {
  return <ClerkProvider {...pageProps}>
    <Component {...pageProps} />
    </ClerkProvider>
}
