import axios from "axios";

const API = axios.create({
  baseURL:
    "https://proposal-ai-frontend.onrender.com/api" ||
    "https://proposal-ai-frontend.onrender.com/api",
});

// Proposal Generation
export const generateProposal = (proposalData) =>
  API.post("/proposals/generate", proposalData);

// Get All Proposals
export const getAllProposals = () => API.get("/proposals/all");

// Download Proposal PDF
export const downloadProposal = (id) =>
  API.get(`/proposals/download/${id}`, {
    responseType: "blob",
  });

// Get Single Proposal
export const getProposalById = (id) => API.get(`/proposals/${id}`);
