import 'focus-visible'
import '../styles/tailwind.css'
import { ClerkProvider, SignedOut } from '@clerk/nextjs'
import { TaskProvider } from '../contexts/TaskContext'
import PageWrapper from '../components/PageWrapper'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
        <TaskProvider>
            <PageWrapper>
            <Component {...pageProps} />
            </PageWrapper>
        </TaskProvider>
    </ClerkProvider>
    )
}
