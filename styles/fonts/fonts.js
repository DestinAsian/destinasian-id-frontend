// import {Rubik, Rubik_Mono_One,  Open_Sans } from 'next/font/google'
import { Rubik, Rubik_Mono_One,  Open_Sans } from 'next/font/google'

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
  fallback: ['system-ui', 'sans-serif'],
})


export const open_sans = Open_Sans({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font--open--sans',
});
