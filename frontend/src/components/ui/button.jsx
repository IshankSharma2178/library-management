import React from "react";

const sizeClassMap = {
  default: "",
  sm: "btn-sm",
  lg: "",
};

export function Button({
  children,
  className = "",
  size = "default",
  type = "button",
  ...props
}) {
  const sizeClass = sizeClassMap[size] || "";

  return (
    <button
      type={type}
      className={`btn btn-primary ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
