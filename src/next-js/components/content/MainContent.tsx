
type MainContentProps = {
  children: React.ReactNode
}

export default async function MainContent({children}: MainContentProps) {
  return (
    <section className="border-x-1 border-lighthover grow-1 max-w-[600px]">
      {children}
    </section>
  )
}
