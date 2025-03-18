"use client";

import type React from "react";
import { type FC, useState } from "react";
import { gql, useMutation, useQuery } from "urql";

import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  IconButton,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import ConfirmDialog from "@components/ConfirmDialog";

import type { AddressType } from "../types";

const AddressesQuery = gql`
  query {
    addresses {
      id
      address
      country
      zip
    }
  }
`;

const DeleteAddressMutation = gql`
  mutation ($id: Int!) {
    deleteAddress(id: $id) {
      id
    }
  }
`;

interface AddressListProps {
  onSelect?: (address: AddressType | null) => void;
}

const AddressList: FC<AddressListProps> = ({ onSelect }) => {
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressType | null>(
    null
  );

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: AddressesQuery,
  });

  const [, deleteAddress] = useMutation(DeleteAddressMutation);

  // Handle address selection from the sidebar.
  const handleSelect = (address: AddressType) => {
    setSelectedAddress(address);
    onSelect?.(address);
  };

  // Open delete confirmation dialog.
  const handleDeleteClick = (address: AddressType, event: React.MouseEvent) => {
    event.stopPropagation();
    setAddressToDelete(address);
    setOpenDialog(true);
  };

  // Cancel deletion.
  const cancelDelete = () => {
    setOpenDialog(false);
    setAddressToDelete(null);
  };

  // Confirm deletion.
  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress({ id1: addressToDelete.id })
        .then(reexecuteQuery)
        .catch(() => {
          // .catch((error) => {
          // console.error("Error deleting address:", error);
          console.error("Error deleting address");
        });

      if (selectedAddress?.id === addressToDelete.id) {
        setSelectedAddress(null);
        onSelect?.(null);
      }
    }
    setOpenDialog(false);
    setAddressToDelete(null);
  };

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
            top: "64px", // Push the drawer below the AppBar (default AppBar height)
          },
        }}
      >
        {fetching && (
          <List>
            {Array.from(new Array(7)).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <ListItem key={index}>
                <Skeleton variant="text" width="100%" height={70} />
              </ListItem>
            ))}
          </List>
        )}
        {error && (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Error loading addresses</Typography>
          </Box>
        )}
        {data && (
          <List>
            {data.addresses.map((address: AddressType) => (
              <ListItemButton
                key={address.id}
                onClick={() => handleSelect(address)}
                selected={selectedAddress?.id === address.id}
              >
                <ListItemText
                  primary={address.address}
                  secondary={address.country}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => handleDeleteClick(address, e)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        )}
      </Drawer>
      {/* Confirmation Modal for Deletion */}
      <ConfirmDialog
        isOpen={openDialog}
        title="Confirm Delete"
        text="Are you sure you want to delete this address?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AddressList;
