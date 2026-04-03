"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");
  
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      phoneNumber: form.phoneNumber,
      password: form.password,
    });
    
    if (res?.error) {
      setError("Invalid phone number or password. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: "80vh", padding: "4rem 2rem" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "450px", borderTop: "4px solid var(--primary-color)" }}>
        <h2 className="mb-1 text-center">Welcome Back</h2>
        <p className="mb-4 text-center" style={{ color: "var(--text-light)" }}>Login to track your repairs</p>
        
        {isRegistered && <div style={{ color: "#166534", background: "#dcfce7", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Account created successfully! Please log in.</div>}
        {error && <div style={{ color: "white", background: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" required value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} placeholder="+91 9876543210" />
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-8 text-center" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <Link href="/register" style={{ color: "var(--primary-color)", fontWeight: "500" }}>Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="container mt-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
