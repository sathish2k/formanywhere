/**
 * Grid Context Menu
 * Right-click menu for grid operations (Add Row, Add Column, etc.)
 */

import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Plus, Columns, Trash2, Settings } from 'lucide-react';

interface GridContextMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAddRow?: () => void;
  onAddColumn?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
}

export const GridContextMenu: React.FC<GridContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onAddRow,
  onAddColumn,
  onDelete,
  onSettings,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            minWidth: 200,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          },
        },
      }}
    >
      {onAddRow && (
        <MenuItem
          onClick={() => {
            onAddRow();
            onClose();
          }}
        >
          <ListItemIcon>
            <Plus size={18} />
          </ListItemIcon>
          <ListItemText primary="Add Row" />
        </MenuItem>
      )}
      
      {onAddColumn && (
        <MenuItem
          onClick={() => {
            onAddColumn();
            onClose();
          }}
        >
          <ListItemIcon>
            <Columns size={18} />
          </ListItemIcon>
          <ListItemText primary="Add Column" />
        </MenuItem>
      )}
      
      {(onAddRow || onAddColumn) && (onDelete || onSettings) && <Divider />}
      
      {onSettings && (
        <MenuItem
          onClick={() => {
            onSettings();
            onClose();
          }}
        >
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          <ListItemText primary="Column Settings" />
        </MenuItem>
      )}
      
      {onDelete && (
        <MenuItem
          onClick={() => {
            onDelete();
            onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Trash2 size={18} color="inherit" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      )}
    </Menu>
  );
};
