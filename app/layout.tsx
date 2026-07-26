import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Jiale Zhang - Ph.D. Candidate at Fudan University";
const description =
  "Personal research homepage of a computer science Ph.D. candidate at Fudan University, working on multi-agent systems, AI for Science, RAG, and generative retrieval.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jarlor.github.io"),
  title,
  description,
  icons: {
    icon: "/jiale-zhang.jpg",
    apple: "/jiale-zhang.jpg",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://jarlor.github.io",
    images: [
      {
        url: "/og-jiale.png",
        width: 1200,
        height: 630,
        alt: "Research profile for Jiale Zhang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-jiale.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function () {
      try {
        var savedTheme = localStorage.getItem("jarlor-theme");
        var theme = savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dataset.theme = theme;
      } catch (error) {
        document.documentElement.dataset.theme =
          window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geist.variable} ${sourceSerif.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
