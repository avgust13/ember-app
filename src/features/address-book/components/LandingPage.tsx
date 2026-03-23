"use client";

import type React from "react";
import { type FC, useCallback, useState } from "react";
import { Client, fetchExchange, Provider } from "urql";

import { Alert, Box, Snackbar, Typography } from "@mui/material";

import type { AddressType } from "../types";
import AddressDetails from "./AddressDetails";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";

const client = new Client({
  url: process.env.NEXT_PUBLIC_API_URL || "",
  exchanges: [fetchExchange],
});

type Mode = "view" | "create" | "edit";

interface Notification {
  message: string;
  severity: "success" | "error";
}

const LandingPage: FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [notification, setNotification] = useState<Notification | null>(null);

  const handleSelect = useCallback((address: AddressType | null) => {
    setSelectedAddress(address);
    setMode("view");
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedAddress(null);
    setMode("create");
  }, []);

  const handleEdit = useCallback((address: AddressType) => {
    setSelectedAddress(address);
    setMode("edit");
  }, []);

  const handleFormSuccess = useCallback((saved: AddressType) => {
    setSelectedAddress(saved);
    setMode("view");
    setNotification({
      message: mode === "edit" ? "Address updated." : "Address created.",
      severity: "success",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleFormCancel = useCallback(() => {
    setMode("view");
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setNotification({ message: "Address deleted.", severity: "success" });
  }, []);

  const handleDeleteError = useCallback((message: string) => {
    setNotification({ message: `Delete failed: ${message}`, severity: "error" });
  }, []);

  const handleCloseNotification = useCallback(
    (_event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setNotification(null);
    },
    []
  );

  const showForm = mode === "create" || mode === "edit";

  return (
    <Provider value={client}>
      <Box sx={{ display: "flex" }}>
        <AddressList
          onSelect={handleSelect}
          onAdd={handleAdd}
          onDeleteSuccess={handleDeleteSuccess}
          onDeleteError={handleDeleteError}
          selectedAddressId={selectedAddress?.id ?? null}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px",
            ml: "100px",
          }}
        >
          {showForm ? (
            <AddressForm
              address={mode === "edit" ? selectedAddress : null}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : selectedAddress ? (
            <AddressDetails address={selectedAddress} onEdit={handleEdit} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Select an address from the sidebar or click + to create one.
            </Typography>
          )}
        </Box>
      </Box>

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Provider>
  );
};

export default LandingPage;
