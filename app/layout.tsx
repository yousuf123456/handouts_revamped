import "./globals.css";

import { Footer } from "./(landing)/_components/footer/Footer";
import { Header } from "./(landing)/_components/newHeader/Header";

import { Nunito, Inter, Montserrat } from "next/font/google";
import { Providers } from "./_components/Providers";

const inter = Inter({ weight: "variable", subsets: ["latin"] });

// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-roboto",
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-poppins",
// });

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
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
