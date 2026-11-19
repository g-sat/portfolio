import type { Metadata } from 'next'
import { Experience } from '@/src/components/Experience'

export const metadata: Metadata = {
  title: 'Sathwik G — Experience',
  description: 'Immersive WebGL portfolio stage by Sathwik G',
}

export default function ExperiencePage() {
  return <Experience />
}
