import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from '@/src/projects/github'

/** Update these — shown on the Contact section. */
export const CONTACT = {
  email: 'sathwik.garikapati@gmail.com',
  location: 'Available worldwide',
  availability: 'Open for collaborations & freelance',
  github: {
    label: `@${GITHUB_USERNAME}`,
    href: GITHUB_PROFILE_URL,
  },
  linkedin: {
    label: 'Sathwik Garikapati',
    href: 'https://www.linkedin.com/in/sathwik-garikapati-9937b1337',
  },
} as const

export const CONTACT_CHANNELS = [
  {
    id: '01',
    title: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    hint: 'Write me',
  },
  {
    id: '02',
    title: 'GitHub',
    value: CONTACT.github.label,
    href: CONTACT.github.href,
    hint: 'Code & commits',
  },
  {
    id: '03',
    title: 'LinkedIn',
    value: CONTACT.linkedin.label,
    href: CONTACT.linkedin.href,
    hint: 'Connect',
  },
] as const
