export interface Project {
  id: string
  title: string
  description: string
  slug: string
  imageUrl?: string
  content?: string
  tags?: string[]
  date?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}