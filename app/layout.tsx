import { Roboto } from 'next/font/google'
import { Metadata } from 'next'

import Header from '@containers/Header'

import '@styles/globals.sass'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
  title: 'Spomen',
  description: 'Wep client',
  manifest: 'site.webmanifest',
  appleWebApp: true,
  applicationName: 'Spomen',
  icons: {
    apple: '/fav/apple-touch-icon.png',
  },
  other: {
    'theme-color': '#1d2533',
    'msapplication-TileColor': '#1d2533',
    'msapplication-config': '/browserconfig.xml',
  },
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
