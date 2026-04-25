import { Providers } from '../components/Providers';
import './globals.css';

export const metadata = {
  title: 'Horizon — Your Financial Life, Simplified',
  description: 'Horizon helps you plan, simulate, and optimize your financial journey. Track milestones, model life events, and build a plan that actually works.',
  keywords: 'financial planning, wealth management, SIP calculator, retirement planner, financial simulation, Horizon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
