"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
          {currentUser.displayName?.charAt(0) ||
            currentUser.email?.charAt(0) ||
            "U"}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {currentUser.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentUser.email}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition duration-200"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
