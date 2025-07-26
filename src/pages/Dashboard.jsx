import React, { useState, useEffect } from "react";
import { getAllProposals, downloadProposal } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Dashboard() {
  console.log("hi");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  console.log(proposals);
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const { data } = await getAllProposals();
        setProposals(data);
      } catch (err) {
        setError(err.message);
        showSnackbar("Failed to load proposals", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleDownload = async (id, projectName) => {
    try {
      const response = await downloadProposal(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${projectName}_Proposal.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSnackbar("Download started!", "success");
    } catch (err) {
      showSnackbar("Failed to download proposal", "error");
      console.error("Download error:", err);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading)
    return <CircularProgress sx={{ margin: "20px auto", display: "block" }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
        Your Proposals
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Client</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Project</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal._id} hover>
                <TableCell>{proposal.clientName}</TableCell>
                <TableCell>{proposal.projectName}</TableCell>
                <TableCell>
                  {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleDownload(proposal._id, proposal.projectName)
                    }
                    title="Download PDF"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    href={`/proposals/${proposal._id}`}
                    title="View Details"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
