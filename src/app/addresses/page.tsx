"use client";

import type React from "react";
import { Client, fetchExchange, Provider } from "urql";

import LandingPage from "@features/address-book/components/LandingPage";

const client = new Client({
  url: process.env.NEXT_PUBLIC_API_URL || "",
  exchanges: [fetchExchange],
});

export default function AddressesPage() {
  return (
    <Provider value={client}>
      <LandingPage />
    </Provider>
  );
}
