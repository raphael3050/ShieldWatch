import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Space_Grotesk } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});
