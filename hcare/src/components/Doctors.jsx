import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  addStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
} from "../features/staff/staffSlice";
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
import "bootstrap/dist/css/bootstrap.min.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Doctors = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.staff.doctors);
  const loading = useSelector((state) => state.staff.loading);
  const error = useSelector((state) => state.staff.error);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // add / edit / view
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const allFields = [
    "id",
    "name",
    "gender",
    "age",
    "specialization",
    "qualification",
    "experience",
    "contact",
    "email",
    "address",
    "availableDays",
    "availableTime",
    "status",
    "department",
    "licenseNumber",
    "rating",
    "consultationFee",
    "bio",
  ];

  const tableFields = ["id", "name", "specialization", "department", "status", "contact"];

  // Fetch doctors
  useEffect(() => {
    dispatch(fetchStaffRequest({ role: "doctors" }));
  }, [dispatch]);

  // Filter doctors by search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        doc.department.toLowerCase().includes(query) ||
        doc.status.toLowerCase().includes(query) ||
        doc.contact.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  // Dialog handlers
  const handleOpen = (mode, doctor = {}) => {
    setDialogMode(mode);
    setFormData(doctor);
    setOpenDialog(true);
  };
  const handleClose = () => setOpenDialog(false);

  const handleSave = () => {
    if (dialogMode === "edit") {
      dispatch(updateStaffRequest({ role: "doctors", staff: formData }));
    } else if (dialogMode === "add") {
      dispatch(addStaffRequest({ role: "doctors", staff: { ...formData, id: Date.now().toString() } }));
    }
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteStaffRequest({ role: "doctors", id }));
    setDeleteMessage("Doctor deleted successfully!");
    setDeleteDialogOpen(true);
  };

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

  // Columns for DataGrid
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

          {/* Search & Add */}
          <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
            <TextField
              placeholder="Search by name, specialization, department, status, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow-1"
              size="small"
            />
            <Button variant="contained" className="btn btn-success" onClick={() => handleOpen("add")}>
              Add Doctor
            </Button>
          </div>

          {/* DataGrid */}
          <div style={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={filteredDoctors}
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
          {dialogMode === "view" ? "View Doctor" : dialogMode === "edit" ? "Edit Doctor" : "Add Doctor"}
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
            {allFields.map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={
                  Array.isArray(formData[key])
                    ? formData[key].join(", ")
                    : formData[key] || ""
                }
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                fullWidth
                size="small"
                InputProps={{ readOnly: dialogMode === "view" }}
              />
            ))}
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
          <Button variant="contained" color="primary" onClick={() => setDeleteDialogOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Doctors;
