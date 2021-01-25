import React from "react";
import { useLocation } from "react-router-dom";

export default function BulmaBreadcrumb({ disabled = false }) {
  const location = useLocation();

  return (
    <div className="box">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          {location.pathname.split("/").map((route) => (
            <li>
              <a href="/" style={{ pointerEvents: disabled ? "none" : "" }}>
                {route}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
