import React from "react";
import { downloadProposal } from "../services/api";

export default function PreviewModal({ proposal, onClose }) {
  const handleDownload = async () => {
    try {
      const response = await downloadProposal(proposal._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${proposal.projectName}_Proposal.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Download failed: " + error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <h2>{proposal.projectName} Proposal</h2>

        <div
          className="proposal-preview"
          dangerouslySetInnerHTML={{ __html: proposal.generatedContent }}
        />

        <button onClick={handleDownload}>Download PDF</button>
      </div>
    </div>
  );
}
