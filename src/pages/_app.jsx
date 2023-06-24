import 'focus-visible'
import '@/styles/tailwind.css'
import { ClerkProvider } from '@clerk/nextjs'
import { TaskProvider } from '@/contexts/TaskContext'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
        <TaskProvider>
            <Component {...pageProps} />
        </TaskProvider>
    </ClerkProvider>
    )
}
