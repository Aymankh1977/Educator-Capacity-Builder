import "./globals.css";
import { cookies } from "next/headers";
import { LangProvider } from "@/components/LangProvider";
import Shell from "@/components/Shell";

export const metadata = {
  title: "REAL-AI Educator Studio · DentEdTech",
  description: "AI capacity building for dental educators, built on the REAL-AI framework.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("realai_lang")?.value === "ar" ? "ar" : "en";

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <LangProvider initialLang={lang}>
          <Shell>{children}</Shell>
        </LangProvider>
      </body>
    </html>
  );
}
