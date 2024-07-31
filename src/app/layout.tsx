"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metadata = {
    title: "สหกรณ์ออมทรัพย์กรมทางหลวง จำกัด",
  description: "Generated by Chaimongkon",
  };
  return (
    <html lang="en">
      <title>{metadata.title}</title>
      <body>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
