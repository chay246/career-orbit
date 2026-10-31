import React from "react";


function Stat({ title, value, icon, color, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <h2 className="stat-value">{value ?? 0}</h2>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>

        <div
          className="stat-icon"
          style={{ backgroundColor: color || "#2563eb" }}
        >
          {icon || "📊"}
        </div>
      </div>
    </div>
  );
}

export default Stat;