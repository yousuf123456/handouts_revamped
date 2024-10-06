import "./globals.css";

import { Footer } from "./(landing)/_components/footer/Footer";
import { Header } from "./(landing)/_components/newHeader/Header";

import { Nunito, Inter } from "next/font/google";
import { Providers } from "./_components/Providers";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({ weight: "variable", subsets: ["latin"] });

const nunito = Nunito({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-nunito",
});

export const metadata = {
  title: "Handouts",
  description: "A multivendor ecommerce website",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${inter.className}`}>
        <NextTopLoader color="#000000" showSpinner={false} shadow={false} />

        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
