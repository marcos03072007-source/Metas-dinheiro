import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Metas de Dinheiro',
  description: 'App para guardar dinheiro e atingir suas metas financeiras',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Metas de Dinheiro',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#0a7ea4" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
