import type { FC } from "react";

import { Typography, Box } from "@mui/material";

import type { AddressType } from "../types";

const AddressDetails: FC<{ address: AddressType }> = ({ address }) => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Address Details
    </Typography>
    <Typography variant="body1">
      <strong>Address:</strong> {address.address}
    </Typography>
    {address.country && (
      <Typography variant="body1">
        <strong>Country:</strong> {address.country}
      </Typography>
    )}
    {address.zip && (
      <Typography variant="body1">
        <strong>ZIP:</strong> {address.zip}
      </Typography>
    )}
  </Box>
);

export default AddressDetails;