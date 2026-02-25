"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface LoginPageProps {
  onAuth: () => void;
}

export default function LoginPage({ onAuth }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === "ITC") {
      onAuth();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#E5E0D9" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[420px] mx-4 flex flex-col items-center"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "48px 40px",
          borderRadius: "2px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header Icon */}
        <div style={{ marginBottom: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <MapPin size={40} strokeWidth={1.5} color="#000000" />
        </div>

        {/* Subheading */}
        <p
          style={{
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          VERTIPORT NETWORK PLANNER
        </p>
        <p
          style={{
            fontWeight: 100,
            fontSize: "14px",
            color: "#666666",
            marginBottom: "32px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Abu Dhabi Exclusivity Zone Analysis
        </p>

        {/* Divider */}
        <div style={{ width: "40px", height: "1px", backgroundColor: "#000000", marginBottom: "32px" }} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontWeight: 700,
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#000000",
                marginBottom: "8px",
              }}
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter access code"
              autoFocus
              className={shaking ? "shake" : ""}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 100,
                border: error ? "1px solid #dc2626" : "1px solid #D4D0CA",
                borderRadius: "1px",
                outline: "none",
                backgroundColor: "#FAFAF8",
                transition: "border-color 0.2s",
                fontFamily: "var(--font-archivo), sans-serif",
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = "#000000";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = "#D4D0CA";
              }}
            />
            {error && (
              <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px", fontWeight: 400 }}>
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "1px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              fontFamily: "var(--font-archivo), sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333333")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
          >
            ACCESS PLANNER
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: "24px",
        fontSize: "11px",
        fontWeight: 100,
        color: "#999999",
        letterSpacing: "0.05em",
      }}>
        Authorized access only
      </p>

      <style jsx>{`
        .shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
