"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./flip-login.css";

export default function LoginPage() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal.");
      router.push("/dashboard");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registrasi gagal.");
      setRegSuccess("Akun berhasil dibuat! Silakan login.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setTimeout(() => setIsFlipped(false), 1500);
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1f2029 0%, #102770 50%, #1f2029 100%)" }}
    >
      <div className="w-full flex flex-col items-center">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-9 text-[#ffeba7]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight" style={{ color: "#ffeba7" }}>
            ElegantInvites
          </span>
        </div>

        {/* Toggle label */}
        <div className="mb-1 flex items-center gap-0" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span
            className="text-xs font-bold uppercase px-5 tracking-widest cursor-pointer transition-all"
            style={{ color: !isFlipped ? "#ffeba7" : "#c4c3ca" }}
            onClick={() => setIsFlipped(false)}
          >
            Log In
          </span>
          <span
            className="text-xs font-bold uppercase px-5 tracking-widest cursor-pointer transition-all"
            style={{ color: isFlipped ? "#ffeba7" : "#c4c3ca" }}
            onClick={() => setIsFlipped(true)}
          >
            Sign Up
          </span>
        </div>

        {/* Toggle pill */}
        <div className="toggle-track" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`toggle-thumb ${isFlipped ? "flipped" : ""}`}>
            {/* Sun/Moon icon via SVG */}
            {isFlipped ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </div>
        </div>

        {/* 3D Flip Card */}
        <div className="flip-card-container">
          <div className={`flip-card-wrapper ${isFlipped ? "flipped" : ""}`}>

            {/* ── FRONT: Login ── */}
            <div className="card-front">
              <div className="center-wrap">
                <form onSubmit={handleLogin} style={{ fontFamily: "Poppins, sans-serif" }}>
                  <h4
                    className="text-center font-semibold mb-6"
                    style={{ color: "#c4c3ca", fontSize: "22px" }}
                  >
                    Log In
                  </h4>

                  {loginError && (
                    <div className="flip-alert-error mb-3">{loginError}</div>
                  )}

                  <div className="flip-input-group">
                    <input
                      type="email"
                      className="flip-input"
                      placeholder="Your Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <span className="flip-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                  </div>

                  <div className="flip-input-group mt-3">
                    <input
                      type="password"
                      className="flip-input"
                      placeholder="Your Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <span className="flip-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flip-btn mt-5"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Log In"}
                  </button>

                  <p
                    className="text-center mt-4 mb-0"
                    style={{ fontSize: "13px", color: "#c4c3ca" }}
                  >
                    <span
                      className="cursor-pointer transition-colors"
                      style={{ color: "#c4c3ca" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffeba7")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#c4c3ca")}
                    >
                      Forgot your password?
                    </span>
                  </p>
                </form>
              </div>
            </div>

            {/* ── BACK: Register ── */}
            <div className="card-back">
              <div className="center-wrap">
                <form onSubmit={handleRegister} style={{ fontFamily: "Poppins, sans-serif" }}>
                  <h4
                    className="text-center font-semibold mb-5"
                    style={{ color: "#c4c3ca", fontSize: "22px" }}
                  >
                    Sign Up
                  </h4>

                  {regError && <div className="flip-alert-error mb-3">{regError}</div>}
                  {regSuccess && <div className="flip-alert-success mb-3">{regSuccess}</div>}

                  <div className="flip-input-group">
                    <input
                      type="text"
                      className="flip-input"
                      placeholder="Your Full Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <span className="flip-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                  </div>

                  <div className="flip-input-group mt-3">
                    <input
                      type="email"
                      className="flip-input"
                      placeholder="Your Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <span className="flip-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                  </div>

                  <div className="flip-input-group mt-3">
                    <input
                      type="password"
                      className="flip-input"
                      placeholder="Your Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                    <span className="flip-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffeba7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flip-btn mt-5"
                    disabled={regLoading}
                  >
                    {regLoading ? "Registering..." : "Sign Up"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
        {/* End flip card */}
      </div>
    </div>
  );
}
