import MainContent from "@/next-js/components/content/MainContent"
import Footer from "@/next-js/components/sidebar/Footer"
import Recomendations from "@/next-js/components/sidebar/Recomendations"
import Search from "@/next-js/components/sidebar/Search"
import Sidebar from "@/next-js/components/sidebar/Sidebar"
import Subscribe from "@/next-js/components/sidebar/Subscribe"
import Trending from "@/next-js/components/sidebar/Trending"

type RootTemplateProps = {
    children: React.ReactNode
}
export default async function RootTemplate({children}: RootTemplateProps) {
  return (
    <section className="size-full flex gap-x-8">
      <MainContent>
        {children}
      </MainContent>
      <Sidebar>
        <Search />
        <Subscribe />
        <Trending />
        <Recomendations />
        <Footer />
      </Sidebar>
    </section>
  )
}
