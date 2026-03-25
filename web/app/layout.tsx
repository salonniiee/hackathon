import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SatyaChain - Made in India Verification",
  description: "Automated verification of Made in India claims using Bill of Materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="brutalist-border-bottom border-b-[3px] border-black">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">SATYACHAIN</h1>
            <nav className="flex gap-4">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/supplier" className="nav-link">Supplier</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="brutalist-border-top border-t-[3px] border-black mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm font-bold">
            BLOCKCHAIN-POWERED MADE IN INDIA VERIFICATION
          </div>
        </footer>
      </body>
    </html>
  );
}