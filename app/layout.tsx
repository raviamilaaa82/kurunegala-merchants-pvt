
import '@/app/ui/global.css'; //should be this order. this is existing old file. 
import './globals.css';//this is new one for shadcn
// import "./components/ui/styles.css";//this is new one for shadcn
import { inter } from '@/app/ui/fonts';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '%s | KML HOLDINGS (PVT)LTD',
  description: '',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
