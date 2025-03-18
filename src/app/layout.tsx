import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Ember - ERP - Test Assignment",
  description:
    "A simple ERP system for managing people, addresses, materials, and invoices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Box sx={{ display: "flex" }}>
          {/* Top Navigation */}
          <AppBar position="fixed">
            <Toolbar>
              <Link href="/">
                <Image src="/logo.avif" alt="Ember" width={100} height={27} />
              </Link>
              <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 3 }}>
                Ember - ERP - Test Assignment
              </Typography>
              <Button color="inherit" component={Link} href="/people">
                People
              </Button>
              <Button color="inherit" component={Link} href="/addresses">
                Addresses
              </Button>
              <Button color="inherit" component={Link} href="/materials">
                Materials
              </Button>
              <Button color="inherit" component={Link} href="/invoices">
                Invoices
              </Button>
            </Toolbar>
          </AppBar>
          {children}
        </Box>
      </body>
    </html>
  );
}
