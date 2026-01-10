import Link from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  imageUrl?: string
  slug: string
}

export default function ProjectCard({ title, description, imageUrl, slug }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <div>
        {imageUrl && <img src={imageUrl} alt={title} />}
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  )
}