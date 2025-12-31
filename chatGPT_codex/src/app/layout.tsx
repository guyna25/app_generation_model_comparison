import "../styles/globals.css";

export const metadata = {
  title: "Todo List",
  description: "Manage your tasks"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
