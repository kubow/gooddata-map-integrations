// (C) 2021-2025 GoodData Corporation
import React from "react";

interface HintProps {
  hint: string;
}

/**
 * Hint component for displaying helpful tips
 */
const Hint: React.FC<HintProps> = ({ hint }) => {
  return (
    <div className="hint-container">
      <div className="hint">
        <span className="hint-icon">💡</span>
        <span className="hint-text">{hint}</span>
      </div>
    </div>
  );
};

export default Hint;
