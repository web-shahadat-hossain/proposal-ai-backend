import React, { useState } from "react";
import { generateProposal, downloadProposal } from "../services/api";
import format from "date-fns/format";

export default function ProposalForm({ templateId }) {
  // Form state
  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    requirements: "",
    timeline: {
      startDate: format(new Date(), "yyyy-MM-dd"),
      milestones: [
        { name: "", dueDate: "" },
        { name: "", dueDate: "" },
      ],
    },
    pricing: {
      total: 0,
      breakdown: "",
    },
    templateId: "653a7b9e1b1a1a2b3c4d5e6f",
  });

  // UI state
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimelineChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, [name]: value },
    }));
  };

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = [...formData.timeline.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };

    setFormData((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, milestones: updatedMilestones },
    }));
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: [...prev.timeline.milestones, { name: "", dueDate: "" }],
      },
    }));
  };

  const removeMilestone = (index) => {
    const updatedMilestones = formData.timeline.milestones.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, milestones: updatedMilestones },
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: name === "total" ? Number(value) : value,
      },
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);

    try {
      const { data } = await generateProposal(formData);
      setProposal(data);
      showSnackbar("Proposal generated successfully!", "success");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to generate proposal";
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setGenerating(false);
    }
  };

  // Download handler
  const handleDownload = async () => {
    if (!proposal?._id) {
      showSnackbar("No proposal available to download", "error");
      return;
    }

    try {
      setDownloading(true);
      const response = await downloadProposal(proposal._id);

      if (!response.data) {
        throw new Error("No data received");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${formData.projectName || "project"}_Proposal.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      showSnackbar("Download started!", "success");
    } catch (err) {
      console.error("Download error:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to download proposal";
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
    } finally {
      setDownloading(false);
    }
  };

  // Snackbar utilities
  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });

    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Snackbar component
  const Snackbar = () => (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300
      ${snackbar.severity === "error" ? "bg-red-500" : "bg-green-500"} 
      text-white ${
        snackbar.open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{snackbar.message}</span>
        <button
          onClick={closeSnackbar}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Snackbar />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Proposal</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {!proposal ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name*
              </label>
              <input
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Acme Corporation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name*
              </label>
              <input
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="E-commerce Website"
              />
            </div>
          </div>

          {/* Project Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements*
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Describe the project requirements in detail..."
            />
          </div>

          {/* Timeline */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Project Timeline
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.timeline.startDate}
                onChange={handleTimelineChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Milestones*</h3>

              {formData.timeline.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Milestone Name
                    </label>
                    <input
                      name="name"
                      value={milestone.name}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Design Phase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={milestone.dueDate}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {formData.timeline.milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addMilestone}
                className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                + Add Milestone
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount ($)*
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.pricing.total}
                  onChange={handlePricingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Breakdown*
                </label>
                <textarea
                  name="breakdown"
                  value={formData.pricing.breakdown}
                  onChange={handlePricingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Example: Design: $1500, Frontend: $2500, Backend: $3000"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Proposal"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="border border-green-200 rounded-lg p-6 bg-green-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-2">
                Proposal Generated Successfully!
              </h2>
              <p className="text-gray-700 mb-4">
                Your proposal for {proposal.clientName || "the client"} is
                ready.
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Ready
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Project
              </h3>
              <p className="text-lg font-medium">
                {proposal.projectName || "Untitled Project"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Amount
              </h3>
              <p className="text-lg font-medium">
                ${proposal.pricing?.total?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => setProposal(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Create Another
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Downloading...
                </span>
              ) : (
                "Download PDF"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
