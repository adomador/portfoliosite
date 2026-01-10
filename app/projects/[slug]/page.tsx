interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  
  return (
    <div>
      <h1>Project: {slug}</h1>
      <section>
        {/* Project details will be displayed here */}
      </section>
    </div>
  )
}