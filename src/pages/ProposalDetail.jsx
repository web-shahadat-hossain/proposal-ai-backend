import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Box, Button } from "@mui/material";
import { getProposalById } from "../services/api";

export default function ProposalDetail() {
  const { id } = useParams();
  const [proposal, setProposal] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data } = await getProposalById(id);
        setProposal(data);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!proposal) return <Typography>Proposal not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {proposal.projectName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Client: {proposal.clientName}
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: proposal.generatedContent }} />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          href={`/proposals/download/${proposal._id}`}
        >
          Download PDF
        </Button>
      </Paper>
    </Box>
  );
}
