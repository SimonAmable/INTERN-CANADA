import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

import Header from "./ui/Header";
import Footer from "./ui/Footer";
import Disclaimer from "./ui/Disclaimer";
import SmallContact from "./ui/SmallContact";

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
      <head>
         
              {/* <!-- Google Analytics tag (gtag.js) --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-77N4QHVV4B"
          strategy="afterInteractive"
        />    
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "G-77N4QHVV4B");
          
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <Header/>
        <div className="min-h-80vh w-full flex flex-col items-center justify-center">
        {children}
        </div>
        <Footer/>
        {/* <Disclaimer/> 
        <SmallContact/>*/}
      </body>
    </html>
  );
}
