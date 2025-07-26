import React from "react";

const templates = [
  { id: "1", name: "Minimalist", image: "/templates/minimalist.jpg" },
  { id: "2", name: "Corporate", image: "/templates/corporate.jpg" },
  // Add all 10 templates
];

export default function TemplateSelector({ onSelect }) {
  return (
    <div className="template-grid">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect(template.id)}
          className="template-card"
        >
          <img src={template.image} alt={template.name} />
          <h3>{template.name}</h3>
        </div>
      ))}
    </div>
  );
}
