import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Head>
        <title>Raja - your very own junior developer</title>
        <meta
          name="description"
          content="Raja is your open-source, AI-powered junior developer who understands your engineering tickets, crafts code, and submits pull requests in mere minutes."
        />
      </Head>
{/*       <Header /> */}
      <main>
      DASHBOARD
{/*         <Hero /> */}
{/*         <PrimaryFeatures /> */}
{/*         <SecondaryFeatures /> */}
{/*         <CallToAction /> */}
{/*         <Testimonials /> */}
{/*         <Pricing /> */}
{/*         <Faqs /> */}
      </main>
{/*       <Footer /> */}
    </>
  )
}
