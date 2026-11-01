import "./globals.css";
import { SiteProvider } from "@/components/site-provider";

export const metadata = {
  title: "KindConnect — Connect People, Create Impact",
  description: "Discover volunteer opportunities and make a meaningful impact."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
