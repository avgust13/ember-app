"use client";

import type React from "react";
import { type FC, useCallback, useState } from "react";
import { gql, useMutation, useQuery } from "urql";

import {
  Typography,
  Drawer,
  List,
  ListItem,
  Box,
  Skeleton,
} from "@mui/material";

import ConfirmDialog from "@components/ConfirmDialog";

import type { AddressType } from "../types";
import AddressListItem from "./AddressListItem";

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

  const handleSelect = useCallback(
    (address: AddressType) => {
      setSelectedAddress(address);
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
    if (addressToDelete) {
      deleteAddress({ id: addressToDelete.id })
        .then(reexecuteQuery)
        .catch(() => {
          console.error("Error deleting address");
        });

      if (selectedAddress?.id === addressToDelete.id) {
        setSelectedAddress(null);
        onSelect?.(null);
      }
    }
    setOpenDialog(false);
    setAddressToDelete(null);
  }, [
    addressToDelete,
    deleteAddress,
    reexecuteQuery,
    onSelect,
    selectedAddress,
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
              <AddressListItem
                key={address.id}
                address={address}
                isSelected={selectedAddress?.id === address.id}
                onSelect={handleSelect}
                onDeleteClick={handleDeleteClick}
              />
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
