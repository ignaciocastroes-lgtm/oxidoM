import { About } from '@/components/about'
import { FeaturedRelease } from '@/components/featured-release'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Intro } from '@/components/intro'
import { Navbar } from '@/components/navbar'
import { RosterGrid } from '@/components/roster-grid'
import { Ticker } from '@/components/ticker'
import { getArtists, getContact, getFeaturedRelease } from '@/lib/data'

export default async function Home() {
  const [artists, featuredRelease, contact] = await Promise.all([
    getArtists(),
    getFeaturedRelease(),
    getContact(),
  ])

  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Hero />
        <Ticker items={artists.map((artist) => artist.name)} />
        <RosterGrid artists={artists} />
        <FeaturedRelease release={featuredRelease} />
        <About />
      </main>
      <Footer email={contact.email} socials={contact.socials} />
    </>
  )
}
