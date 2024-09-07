import "./globals.css";


export const metadata = {
  title: "My TODO App",
  description: "A simple TODO app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
