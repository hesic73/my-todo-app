import "./globals.css";

import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/hooks/AuthContext";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export const metadata = {
  title: "My To-Do App",
  description: "A simple to-do app built with Next.js and fastapi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Navbar />
          <main className='bg-base-100 flex items-start'>
            <MaxWidthWrapper>
              {children}
            </MaxWidthWrapper>
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
