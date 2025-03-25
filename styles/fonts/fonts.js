import { EB_Garamond, Rubik, Rubik_Mono_One } from 'next/font/google'

export const eb_garamond = EB_Garamond({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font--eb--garamond',
})

export const rubik_mono_one = Rubik_Mono_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font--rubik--mono--one',
})

export const rubik = Rubik({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font--rubik',
})
