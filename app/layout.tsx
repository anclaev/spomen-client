import { Roboto } from 'next/font/google'
import { Metadata } from 'next'

import Header from '@containers/Header'

import '@styles/globals.sass'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Spomen',
  description: 'Wep client',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ru'>
      <body className={`${roboto.variable} wrapper font-sans`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
