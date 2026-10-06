import './globals.css';
import { SITE } from '@/lib/site';

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: `Find verified residential and commercial properties across Pune with ${SITE.name}.`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
