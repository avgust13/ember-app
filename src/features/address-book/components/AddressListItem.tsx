import React from "react";
import type { FC } from "react";

import { ListItemButton, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import type { AddressType } from "../types";

interface AddressListItemProps {
  address: AddressType;
  isSelected: boolean;
  onSelect: (address: AddressType) => void;
  onDeleteClick: (address: AddressType, event: React.MouseEvent) => void;
}

// eslint-disable-next-line react/display-name
const AddressListItem: FC<AddressListItemProps> = React.memo(
  ({ address, isSelected, onSelect, onDeleteClick }) => (
    <ListItemButton onClick={() => onSelect(address)} selected={isSelected}>
      <ListItemText primary={address.address} secondary={address.country} />
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={(e) => onDeleteClick(address, e)}
      >
        <DeleteIcon />
      </IconButton>
    </ListItemButton>
  )
);

export default AddressListItem;
