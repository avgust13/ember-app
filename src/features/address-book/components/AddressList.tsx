"use client";

import type React from "react";
import { type FC, useCallback, useState } from "react";
import { gql, useMutation, useQuery } from "urql";

import {
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import ConfirmDialog from "@components/ConfirmDialog";

import type { AddressType } from "../types";
import AddressListItem from "./AddressListItem";

const AddressesQuery = gql`
  query Addresses($search: String) {
    addresses(search: $search) {
      id
      address
      country
      zip
    }
  }
`;

const DeleteAddressMutation = gql`
  mutation DeleteAddress($id: Int!) {
    deleteAddress(id: $id) {
      id
    }
  }
`;

interface AddressListProps {
  onSelect?: (address: AddressType | null) => void;
  onAdd?: () => void;
  onDeleteError?: (message: string) => void;
  onDeleteSuccess?: () => void;
  selectedAddressId?: number | null;
}

const AddressList: FC<AddressListProps> = ({
  onSelect,
  onAdd,
  onDeleteError,
  onDeleteSuccess,
  selectedAddressId,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressType | null>(null);
  const [search, setSearch] = useState("");

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: AddressesQuery,
    variables: { search: search || undefined },
  });

  const [, deleteAddress] = useMutation(DeleteAddressMutation);

  const handleSelect = useCallback(
    (address: AddressType) => {
      onSelect?.(address);
    },
    [onSelect]
  );

  const handleDeleteClick = useCallback(
    (address: AddressType, event: React.MouseEvent) => {
      event.stopPropagation();
      setAddressToDelete(address);
      setOpenDialog(true);
    },
    []
  );

  const cancelDelete = useCallback(() => {
    setOpenDialog(false);
    setAddressToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!addressToDelete) return;

    const deletingId = addressToDelete.id;
    setOpenDialog(false);
    setAddressToDelete(null);

    deleteAddress({ id: deletingId })
      .then((result) => {
        if (result.error) {
          onDeleteError?.(result.error.message);
        } else {
          if (selectedAddressId === deletingId) {
            onSelect?.(null);
          }
          onDeleteSuccess?.();
          reexecuteQuery({ requestPolicy: "network-only" });
        }
      })
      .catch(() => {
        onDeleteError?.("An unexpected error occurred while deleting.");
      });
  }, [
    addressToDelete,
    deleteAddress,
    reexecuteQuery,
    onSelect,
    onDeleteError,
    onDeleteSuccess,
    selectedAddressId,
  ]);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 400,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 400,
            boxSizing: "border-box",
            top: "64px",
          },
        }}
      >
        {/* Search + Add toolbar */}
        <Box sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search addresses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <Tooltip title="Add address">
            <IconButton color="primary" onClick={onAdd} aria-label="add address">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {fetching && (
          <List>
            {Array.from({ length: 7 }, (_, i) => i).map((i) => (
              <ListItem key={i}>
                <Skeleton variant="text" width="100%" height={70} />
              </ListItem>
            ))}
          </List>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Error loading addresses.</Typography>
          </Box>
        )}

        {data && data.addresses.length === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">
              {search ? "No addresses match your search." : "No addresses yet."}
            </Typography>
          </Box>
        )}

        {data && data.addresses.length > 0 && (
          <List>
            {data.addresses.map((addr: AddressType) => (
              <AddressListItem
                key={addr.id}
                address={addr}
                isSelected={selectedAddressId === addr.id}
                onSelect={handleSelect}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </List>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={openDialog}
        title="Delete Address"
        text={`Are you sure you want to delete "${addressToDelete?.address}"?`}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AddressList;
