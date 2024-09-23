import localFont from "next/font/local";
import "./globals.css";

import Header from "./ui/Header";
import Footer from "./ui/Footer";
import Disclaimer from "./ui/Disclaimer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const helmet_hellvetica = localFont({
  src: "./fonts/Helmet-Regular.woff",
  variable: "--font-helmet",
  weight: "100 900",
});


export const metadata = {
  title: "Intenships Canada",
  description: "The Open Source Canadian Internship Page, Canada\'s biggest FREE Co-op page. Created by students, for students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
        {/* <Disclaimer/> */}
      </body>
    </html>
  );
}
