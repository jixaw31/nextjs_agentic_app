'use client';

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSignup?: (user: any) => void; // Optional callback
}

export default function SignupModal({ isOpen, onClose, onSignup }: Props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user_name: userName,
      password,
      email: email || undefined,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Signup failed");
      }

      const user = await res.json();

      // Optional: auto-login right after signup
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name: userName, password }),
      });

      if (!loginRes.ok) {
        throw new Error("Auto-login failed after signup");
      }

      const loginData = await loginRes.json();
      localStorage.setItem("token", loginData.access_token);
      localStorage.setItem("user_name", loginData.user_name);

      if (onSignup) onSignup(loginData);
      onClose();
    } catch (err: any) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed. Try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}