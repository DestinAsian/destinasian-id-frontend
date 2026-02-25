import { useEffect, useState } from "react";

export function usePasswordProtection({ contentType, databaseId, enabled }) {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!enabled);
  const [isChecking, setIsChecking] = useState(Boolean(enabled));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setIsAuthenticated(true);
      setIsChecking(false);
      setErrorMessage("");
      return () => {
        cancelled = true;
      };
    }

    if (!databaseId || !contentType) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return () => {
        cancelled = true;
      };
    }

    const checkAuth = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(
          `/api/password/check?contentType=${encodeURIComponent(
            contentType
          )}&databaseId=${encodeURIComponent(databaseId)}`,
          { credentials: "same-origin" }
        );
        const data = await res.json();
        if (!cancelled) {
          setIsAuthenticated(Boolean(data?.ok));
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [enabled, databaseId, contentType]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!enteredPassword || !databaseId || !contentType) return false;

    setIsChecking(true);
    try {
      const res = await fetch("/api/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          contentType,
          databaseId,
          password: enteredPassword,
        }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setErrorMessage("");
        return true;
      }

      setIsAuthenticated(false);
      setErrorMessage("Incorrect password.");
      return false;
    } catch {
      setIsAuthenticated(false);
      setErrorMessage("Server error.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    enteredPassword,
    setEnteredPassword,
    isAuthenticated,
    isChecking,
    handlePasswordSubmit,
    errorMessage,
  };
}
