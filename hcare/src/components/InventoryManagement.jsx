import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryRequest,
  addInventoryRequest,
  updateInventoryRequest,
  deleteInventoryRequest,
} from "../features/inventory/inventorySlice";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.inventory.items);
  const loading = useSelector((state) => state.inventory.loading);
  const error = useSelector((state) => state.inventory.error);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // add / edit / view
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const formFields = [
    "medicineName",
    "genericName",
    "sku",
    "weight",
    "category",
    "manufacturer",
    "price",
    "manufacturerPrice",
    "stock",
    "expireDate",
    "status",
    "medicineDetails",
  ];

  // Fetch inventory
  useEffect(() => {
    dispatch(fetchInventoryRequest());
  }, [dispatch]);

  // Filter items based on search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.medicineName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  // Dialog handlers
  const handleOpen = (mode, item = {}) => {
    setDialogMode(mode);
    setFormData(item);
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleSave = () => {
    if (dialogMode === "edit") {
      dispatch(updateInventoryRequest(formData));
    } else if (dialogMode === "add") {
      dispatch(addInventoryRequest({ ...formData, id: Date.now().toString() }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    // Real-time delete
    dispatch(deleteInventoryRequest(id));

    // Show delete dialog
    setDeleteMessage("Item deleted successfully!");
    setDeleteDialogOpen(true);
  };

  // Auto-close delete dialog after 2.5 seconds
  useEffect(() => {
    if (deleteDialogOpen) {
      const timer = setTimeout(() => setDeleteDialogOpen(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [deleteDialogOpen]);

  // Custom toolbar
  const CustomToolbar = () => (
    <GridToolbarContainer className="mb-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  // Columns with actions
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "medicineName", headerName: "Medicine Name", width: 200 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => <Typography>${params.value}</Typography>,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 120,
      renderCell: (params) => {
        let color = "green";
        if (params.value <= 10) color = "red";
        else if (params.value <= 50) color = "orange";
        return <Typography style={{ color, fontWeight: "bold" }}>{params.value}</Typography>;
      },
    },
    {
      field: "expireDate",
      headerName: "Expire Date",
      width: 130,
      renderCell: (params) => {
        const today = dayjs();
        const expire = dayjs(params.value);
        const isExpired = expire.isBefore(today);
        return (
          <Typography style={{ color: isExpired ? "red" : "inherit", fontWeight: isExpired ? "bold" : "normal" }}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Typography
          style={{
            color: params.value === "Available" ? "green" : params.value === "Out of Stock" ? "red" : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 260,
      renderCell: (params) => (
        <Box className="d-flex gap-2">
          <Button
            size="small"
            variant="contained"
            color="info"
            startIcon={<VisibilityIcon />}
            onClick={() => handleOpen("view", params.row)}
            sx={{ textTransform: "none" }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => handleOpen("edit", params.row)}
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className="container my-4">
      <Card className="shadow-sm">
        <CardContent>
          <Typography variant="h4" className="mb-3">
            Inventory Management
          </Typography>

          {error && (
            <Typography color="error" className="mb-2">
              {error}
            </Typography>
          )}

          {/* Search & Add */}
          <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
            <TextField
              placeholder="Search by name, category, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow-1"
              size="small"
            />
            <Button
              variant="contained"
              className="btn btn-success"
              onClick={() => handleOpen("add")}
            >
              Add Medicine
            </Button>
          </div>

          {/* DataGrid */}
          <div style={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={filteredItems}
              columns={columns}
              pageSize={10}
              loading={loading}
              components={{ Toolbar: CustomToolbar }}
              sx={{
                "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f1f1" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" },
              }}
              autoHeight
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit/View Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, padding: 2, overflow: 'visible' } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1976d2' }}>
          {dialogMode === "view"
            ? "View Medicine"
            : dialogMode === "edit"
            ? "Edit Medicine"
            : "Add Medicine"}
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box
            component="form"
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              mt: 1
            }}
          >
            {formFields.map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key] || ""}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                fullWidth
                size="small"
                InputProps={{ readOnly: dialogMode === "view" }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
            sx={{ fontWeight: 'bold' }}
          >
            Close
          </Button>
          {dialogMode !== "view" && (
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, padding: 2, textAlign: "center" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "green" }}>
          Success
        </DialogTitle>
        <DialogContent>
          <Typography>{deleteMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDeleteDialogOpen(false)}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
