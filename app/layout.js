import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import Shell from "@/components/Shell";

export const metadata = {
  title: "REAL-AI Educator Studio · DentEdTech",
  description: "AI capacity building for dental educators, built on the REAL-AI framework.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <LangProvider>
          <Shell>{children}</Shell>
        </LangProvider>
      </body>
    </html>
  );
}
