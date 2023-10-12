import { SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/nextjs';
import Menu from './Menu';
import TopBar from './TopBar';
import React from 'react';
import Head from 'next/head'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { PrimaryFeatures } from '../components/PrimaryFeatures'

const PageWrapper: React.FC = (props: any) => {
  const { isSignedIn } = useUser();

  function getContent() {
    return (
     <main className="min-h-screen w-screen grid overflow-visible" style={{ gridTemplateRows: '80px 1fr', gridTemplateColumns: '220px 1fr' }}>
     <div className="fixed top-0 left-0 h-full bg-[#fafafa] flex flex-row" style={{ width: "220px" }}>
       <Menu />
     </div>
   
     <div className="fixed top-0 right-0 z-10 border bg-white border-b-1 border-l-0" style={{ left: '220px', height: "80px" }}>
       <TopBar />
     </div>
   
     <div className="flex items-center flex-col overflow-visible z-0 flex-grow col-start-2 row-start-2">
       {props.children}
     </div>
   </main>
    )
   }

  function getLandingPage() {
    return (
      <>
        <Head>
          <title>Raja - your very own junior developer</title>
          <meta
            name="description"
            content="Raja is your open-source, AI-powered junior developer who understands your engineering tickets, crafts code, and submits pull requests in mere minutes."
          />
          <link rel="icon" href="/raja-logo.ico" sizes="any" />
        </Head>
        <Header />
        <main>
          <Hero />
          <PrimaryFeatures />
        </main>
        <Footer />
      </>
    )
  }

  return ( 
    <>
      { !isSignedIn ? 
          getContent()
        :
          getLandingPage()
      }
    </>
  );
}

export default PageWrapper;
