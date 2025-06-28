"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  if (!isOpen) return null;

  const switchToSignUp = () => setMode("signup");
  const switchToLogin = () => setMode("login");

  return (
    <>
      {mode === "login" && (
        <LoginForm onSwitchToSignUp={switchToSignUp} onClose={onClose} />
      )}
      {mode === "signup" && (
        <SignUpForm onSwitchToLogin={switchToLogin} onClose={onClose} />
      )}
    </>
  );
}
