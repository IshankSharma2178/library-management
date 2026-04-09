import React from "react";

export function useToast() {
  const toast = React.useMemo(
    () => ({
      success: (message) => window.alert(message),
      error: (message) => window.alert(message),
      info: (message) => window.alert(message),
    }),
    [],
  );

  return { toast };
}
