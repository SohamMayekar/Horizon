import './globals.css';

export const metadata = {
  title: 'Horizon — Your Financial Life, Simplified',
  description: 'Horizon helps you plan, simulate, and optimize your financial journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
