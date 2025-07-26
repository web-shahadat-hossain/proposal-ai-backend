import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={10}>
        <Typography variant="h3" gutterBottom>
          AI-Powered Proposal Generator
        </Typography>
        <Typography variant="h6" paragraph>
          Create professional client proposals in minutes
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/create"
          sx={{ mt: 3 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
