import React from "react";

export function Table({ children, className = "", ...props }) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        className={className}
        style={{ width: "100%", borderCollapse: "collapse" }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }) {
  return (
    <tr
      className={className}
      style={{ borderBottom: "1px solid var(--border)" }}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th
      className={className}
      style={{
        textAlign: "left",
        padding: "0.75rem",
        color: "var(--text-light)",
        fontWeight: 600,
      }}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={className} style={{ padding: "0.75rem" }} {...props}>
      {children}
    </td>
  );
}
