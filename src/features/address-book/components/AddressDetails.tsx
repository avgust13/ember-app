import type { FC } from "react";

import { Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import type { AddressType } from "../types";

interface AddressDetailsProps {
  address: AddressType;
  onEdit?: (address: AddressType) => void;
}

const AddressDetails: FC<AddressDetailsProps> = ({ address, onEdit }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <Typography variant="h4">Address Details</Typography>
      {onEdit && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(address)}
        >
          Edit
        </Button>
      )}
    </Box>
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