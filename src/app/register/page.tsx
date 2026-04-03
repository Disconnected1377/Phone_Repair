"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate phone number loosely (at least 10 digits as a basic check)
    if (form.phoneNumber.length < 10) {
      setError("User must enter valid phone number in order to traceback their repair service later.");
      return;
    }
    
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST", body: JSON.stringify(form)
    });
    
    if (res.ok) {
      // Auto-login or redirect
      router.push("/login?registered=true");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: "80vh", padding: "4rem 2rem" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "450px", borderTop: "4px solid var(--primary-color)" }}>
        <h2 className="mb-1 text-center">Create Account</h2>
        <p className="mb-4 text-center" style={{ color: "var(--text-light)" }}>Join HiTech to book your repair</p>
        
        {error && <div style={{ color: "white", background: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="johndoe" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" required value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="+91 9876543210" />
            <small style={{ color: "var(--text-light)", display: "block", marginTop: "0.5rem" }}>Required to track your repair status securely.</small>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input className="form-input" type={showPassword ? "text" : "password"} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={{ paddingRight: "3rem" }} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          <button className="btn btn-primary w-full mt-4" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-8 text-center" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <Link href="/login" style={{ color: "var(--primary-color)", fontWeight: "500" }}>Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
