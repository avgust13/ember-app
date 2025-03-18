"use client";

import type React from "react";
import { type FC, useState } from "react";

import { Typography, Box } from "@mui/material";

import type { AddressType } from "../types";

import AddressList from "./AddressList";
import AddressDetails from "./AddressDetails";


const LandingPage: FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar with addresses */}
      <AddressList onSelect={setSelectedAddress} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // margin top to account for the AppBar
          ml: "400px", // margin left to account for the Drawer
        }}
      >
        {selectedAddress ? (
          <AddressDetails address={selectedAddress} />
        ) : (
          <Typography variant="h6">
            Select an address from the sidebar to view details.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
