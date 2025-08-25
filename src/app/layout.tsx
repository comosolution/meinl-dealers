import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEINL Dealers",
  description: "",
};

const theme = createTheme({
  primaryColor: "red",
  colors: {
    red: [
      "#ffe8ea",
      "#ffcfd1",
      "#ff9ca0",
      "#fe656c",
      "#fd3940",
      "#fe1e25",
      "#fe0e16",
      "#e3000b",
      "#ca0008",
      "#b10003",
    ],
    yellow: [
      "#fff4e4",
      "#f8e7d4",
      "#eccfad",
      "#e1b483",
      "#d69d5e",
      "#d08f47",
      "#ce883a",
      "#b6752b",
      "#a36723",
      "#8e5717",
    ],
  },
  defaultRadius: "0",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
