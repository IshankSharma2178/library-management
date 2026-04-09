import React from "react";

const SelectContext = React.createContext(null);

export function Select({ value, onValueChange, children }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = React.useContext(SelectContext);
  return <span>{ctx?.value || placeholder || ""}</span>;
}

export function SelectContent({ children }) {
  const ctx = React.useContext(SelectContext);

  const options = React.Children.toArray(children)
    .filter((child) => child?.type?.displayName === "SelectItem")
    .map((child) => ({
      value: child.props.value,
      label: child.props.children,
    }));

  return (
    <select
      value={ctx?.value || ""}
      onChange={(e) => ctx?.onValueChange?.(e.target.value)}
      className="form-group"
      style={{
        width: "100%",
        padding: "0.75rem",
        border: "1px solid var(--border)",
        borderRadius: "6px",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SelectItem() {
  return null;
}
SelectItem.displayName = "SelectItem";
