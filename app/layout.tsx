import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Newsreader,
} from "next/font/google";
import { siteProfile } from "./data/site";
import {
  SYSTEM_THEME_QUERY,
  THEME_COLORS,
  THEME_STORAGE_KEY,
} from "./data/theme";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = `${siteProfile.name} - ${siteProfile.researchTitle.lead} ${siteProfile.researchTitle.tail}`;
const { description } = siteProfile;

export const metadata: Metadata = {
  metadataBase: new URL(siteProfile.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: siteProfile.siteUrl,
    images: [
      {
        url: "/og-jiale.png",
        width: 1200,
        height: 630,
        alt: `${siteProfile.name}, Ph.D. student at ${siteProfile.institution.name}`,
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
        var savedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
        var theme = savedTheme === "light" || savedTheme === "dark"
          ? savedTheme
          : (window.matchMedia(${JSON.stringify(SYSTEM_THEME_QUERY)}).matches ? "dark" : "light");
        var themeColors = ${JSON.stringify(THEME_COLORS)};
        document.documentElement.dataset.theme = theme;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute("content", themeColors[theme]);
      } catch (error) {
        var fallbackTheme = window.matchMedia(${JSON.stringify(SYSTEM_THEME_QUERY)}).matches
          ? "dark"
          : "light";
        document.documentElement.dataset.theme = fallbackTheme;
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute("content", ${JSON.stringify(THEME_COLORS)}[fallbackTheme]);
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={THEME_COLORS.light} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
