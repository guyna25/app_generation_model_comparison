import "./globals.css";

export const metadata = {
  title: "Todo App",
  description: "A simple todo application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
