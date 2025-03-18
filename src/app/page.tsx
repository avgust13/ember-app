import React from "react";
import Image from "next/image";

import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Image src="/logo.avif" alt="Ember" width={352} height={97} />
    </Box>
  );
}
