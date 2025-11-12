import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../features/staff/staffSlice";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
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
import "bootstrap/dist/css/bootstrap.min.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Pharmacists = () => {
  const dispatch = useDispatch();
  const pharmacists = useSelector((state) => state.staff.pharmacists);
  const loading = useSelector((state) => state.staff.loading);
  const error = useSelector((state) => state.staff.error);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const allFields = ["id", "name", "licenseNo", "email", "contact", "experience"];
  const tableFields = ["id", "name", "licenseNo", "email", "contact", "experience"];

  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "pharmacists" }));
  }, [dispatch]);

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = pharmacists.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.licenseNo.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.contact.toLowerCase().includes(query) ||
        p.experience.toLowerCase().includes(query)
    );
    setFilteredPharmacists(filtered);
  }, [searchQuery, pharmacists]);

  const handleOpen = (mode, pharmacist = {}) => {
    setDialogMode(mode);
    setFormData(pharmacist);
    setOpenDialog(true);
  };
  const handleClose = () => setOpenDialog(false);

  const handleSave = () => {
    if (dialogMode === "edit") {
      dispatch(updateStaffRequest({ role: "pharmacists", staff: formData }));
    } else if (dialogMode === "add") {
      const newPharmacist = { ...formData, id: Date.now().toString() };
      dispatch(addStaffRequest({ role: "pharmacists", staff: newPharmacist }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "pharmacists", id }));
    setDeleteMessage("Pharmacist deleted successfully!");
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    if (deleteDialogOpen) {
      const timer = setTimeout(() => setDeleteDialogOpen(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [deleteDialogOpen]);

  const CustomToolbar = () => (
    <GridToolbarContainer className="mb-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const columns = [
    ...tableFields.map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: 150,
    })),
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
          

          {error && <Typography color="error" className="mb-2">{error}</Typography>}

          <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
            <TextField
              placeholder="Search by name, licenseNo, email, contact, or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow-1"
              size="small"
            />
            <Button variant="contained" className="btn btn-success" onClick={() => handleOpen("add")}>
              Add Pharmacist
            </Button>
          </div>

          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredPharmacists}
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
          {dialogMode === "view" ? "View Pharmacist" : dialogMode === "edit" ? "Edit Pharmacist" : "Add Pharmacist"}
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
            {allFields.map((key) => {
              if (dialogMode === "add" && key === "id") return null;
              return (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: dialogMode === "view" }}
                />
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="secondary" sx={{ fontWeight: 'bold' }}>
            Close
          </Button>
          {dialogMode !== "view" && (
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 'bold' }}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Success Dialog */}
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
          <Button variant="contained" color="primary" onClick={() => setDeleteDialogOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pharmacists;
