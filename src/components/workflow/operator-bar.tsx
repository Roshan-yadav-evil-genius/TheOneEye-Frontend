"use client";

interface OperatorBarProps {
  operator: "AND" | "OR" | "NOT";
  onOperatorChange: (operator: "AND" | "OR" | "NOT") => void;
  size?: "sm" | "md" | "lg";
}

export function OperatorBar({ 
  operator, 
  onOperatorChange, 
  size = "md" 
}: OperatorBarProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  return (
    <div className="flex items-center justify-center my-2">
      <div className="flex bg-gray-800 rounded p-1">
        <button
          onClick={() => onOperatorChange("AND")}
          className={`${sizeClasses[size]} rounded ${
            operator === "AND" 
              ? "bg-gray-700 text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          AND
        </button>
        <button
          onClick={() => onOperatorChange("OR")}
          className={`${sizeClasses[size]} rounded ${
            operator === "OR" 
              ? "bg-gray-700 text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          OR
        </button>
        <button
          onClick={() => onOperatorChange("NOT")}
          className={`${sizeClasses[size]} rounded ${
            operator === "NOT" 
              ? "bg-gray-700 text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          NOT
        </button>
      </div>
    </div>
  );
}
