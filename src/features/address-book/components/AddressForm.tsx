"use client";

import { type FC, useEffect, useState } from "react";
import { gql, useMutation } from "urql";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import type { AddressType } from "../types";

const CreateAddressMutation = gql`
  mutation CreateAddress($address: String!, $country: String, $zip: String) {
    createAddress(address: $address, country: $country, zip: $zip) {
      id
      address
      country
      zip
    }
  }
`;

const UpdateAddressMutation = gql`
  mutation UpdateAddress(
    $id: Int!
    $address: String
    $country: String
    $zip: String
  ) {
    updateAddress(id: $id, address: $address, country: $country, zip: $zip) {
      id
      address
      country
      zip
    }
  }
`;

interface AddressFormProps {
  /** When provided the form operates in edit mode; otherwise in create mode. */
  address?: AddressType | null;
  onSuccess: (address: AddressType) => void;
  onCancel: () => void;
}

const AddressForm: FC<AddressFormProps> = ({ address, onSuccess, onCancel }) => {
  const isEditing = Boolean(address);

  const [streetValue, setStreetValue] = useState(address?.address ?? "");
  const [countryValue, setCountryValue] = useState(address?.country ?? "");
  const [zipValue, setZipValue] = useState(address?.zip ?? "");
  const [streetError, setStreetError] = useState("");

  const [createResult, createAddress] = useMutation(CreateAddressMutation);
  const [updateResult, updateAddress] = useMutation(UpdateAddressMutation);

  const fetching = createResult.fetching || updateResult.fetching;
  const mutationError = createResult.error || updateResult.error;

  // Reset form when switching between create and edit
  useEffect(() => {
    setStreetValue(address?.address ?? "");
    setCountryValue(address?.country ?? "");
    setZipValue(address?.zip ?? "");
    setStreetError("");
  }, [address]);

  const validate = (): boolean => {
    if (!streetValue.trim()) {
      setStreetError("Address is required.");
      return false;
    }
    if (streetValue.trim().length > 255) {
      setStreetError("Address must be 255 characters or fewer.");
      return false;
    }
    setStreetError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && address) {
      const result = await updateAddress({
        id: address.id,
        address: streetValue.trim(),
        country: countryValue.trim() || null,
        zip: zipValue.trim() || null,
      });
      if (result.data?.updateAddress) {
        onSuccess(result.data.updateAddress);
      }
    } else {
      const result = await createAddress({
        address: streetValue.trim(),
        country: countryValue.trim() || null,
        zip: zipValue.trim() || null,
      });
      if (result.data?.createAddress) {
        onSuccess(result.data.createAddress);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" gutterBottom>
        {isEditing ? "Edit Address" : "New Address"}
      </Typography>

      <TextField
        label="Street Address"
        value={streetValue}
        onChange={(e) => setStreetValue(e.target.value)}
        error={Boolean(streetError)}
        helperText={streetError}
        required
        fullWidth
        margin="normal"
        disabled={fetching}
        inputProps={{ maxLength: 255 }}
      />

      <TextField
        label="Country"
        value={countryValue}
        onChange={(e) => setCountryValue(e.target.value)}
        fullWidth
        margin="normal"
        disabled={fetching}
        inputProps={{ maxLength: 100 }}
      />

      <TextField
        label="ZIP / Postal Code"
        value={zipValue}
        onChange={(e) => setZipValue(e.target.value)}
        fullWidth
        margin="normal"
        disabled={fetching}
        inputProps={{ maxLength: 20 }}
      />

      {mutationError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {mutationError.message}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={fetching}
          startIcon={fetching ? <CircularProgress size={16} /> : null}
        >
          {isEditing ? "Save Changes" : "Create Address"}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={fetching}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;
