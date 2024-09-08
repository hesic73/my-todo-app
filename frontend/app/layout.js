import "./globals.css";

import Navbar from "@/components/Navbar";

export const metadata = {
  title: "My TODO App",
  description: "A simple TODO app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
