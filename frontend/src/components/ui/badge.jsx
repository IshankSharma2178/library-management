import React from "react";

const variantMap = {
  default: "badge",
  success: "badge badge-success",
  destructive: "badge badge-danger",
  warning: "badge badge-warning",
};

export function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  const variantClass = variantMap[variant] || variantMap.default;

  return (
    <span className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
