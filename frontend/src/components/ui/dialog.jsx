import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (child) => child?.type?.displayName === "DialogTrigger",
  );
  const content = childArray.find(
    (child) => child?.type?.displayName === "DialogContent",
  );

  return (
    <>
      {trigger
        ? React.cloneElement(trigger, { onOpen: () => onOpenChange(true) })
        : null}
      {open && content
        ? React.cloneElement(content, { onClose: () => onOpenChange(false) })
        : null}
    </>
  );
}

export function DialogTrigger({ children, onOpen }) {
  return React.cloneElement(children, {
    onClick: (...args) => {
      children.props?.onClick?.(...args);
      onOpen();
    },
  });
}
DialogTrigger.displayName = "DialogTrigger";

export function DialogContent({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
DialogContent.displayName = "DialogContent";

export function DialogHeader({ children, className = "", ...props }) {
  return (
    <div className={className} style={{ marginBottom: "1rem" }} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "", ...props }) {
  return (
    <h3
      className={className}
      style={{ fontSize: "1.1rem", fontWeight: 600 }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({ children, className = "", ...props }) {
  return (
    <p
      className={className}
      style={{ color: "var(--text-light)", marginTop: "0.25rem" }}
      {...props}
    >
      {children}
    </p>
  );
}
