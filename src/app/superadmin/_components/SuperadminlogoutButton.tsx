"use client";

import { useLogout } from "@/hooks/lib/UseAuth";
import { useState } from "react";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const logout = useLogout();

  const handleLogout = () => {
    setOpen(false);
    logout.mutate();
  };

  return (
    <>
      {/* LOGOUT BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
      >
        Logout
      </button>

      {/* CONFIRMATION MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h2 className="text-lg font-bold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-gray-600 mt-2">
              Do you really want to logout?
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
