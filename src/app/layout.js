import "./globals.css";
import Script from "next/script";
import { SiteProvider } from "@/components/site-provider";

export const metadata = {
  title: "KindConnect — Connect People, Create Impact",
  description: "Discover volunteer opportunities and make a meaningful impact."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
