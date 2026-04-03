"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav className="navbar animate-fade-in">
      <div className="container flex items-center justify-between">
        <Link href="/" className="logo flex items-center" style={{ gap: "0.5rem" }}>
          <div style={{ background: "var(--primary-color)", color: "white", padding: "0.25rem 0.5rem", borderRadius: "8px", fontWeight: "900", fontSize: "1.5rem" }}>HT</div>
          <h2 style={{ margin: 0, fontWeight: "800", color: "var(--text-dark)", letterSpacing: "-0.5px" }}>HiTech</h2>
        </Link>
        
        <div className="nav-links flex items-center">
          <Link href="/" className="nav-link">Home</Link>
          {(session?.user as any)?.role === "ADMIN" ? (
             <>
               <Link href="/admin/add-repair" className="nav-link">Add Repairs</Link>
               <Link href="/admin/settings" className="nav-link">Settings</Link>
             </>
          ) : (
             <Link href="/repairs" className="nav-link">Repairs</Link>
          )}

          <button 
            onClick={toggleTheme}
            className="btn"
            style={{ background: "transparent", fontSize: "1.2rem", padding: "0.5rem", borderRadius: "50%", width: "40px", height: "40px", marginLeft: "1rem" }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          
          {session ? (
            <div className="flex items-center" style={{ marginLeft: "1rem", gap: "1rem" }}>
              <Link href={(session.user as any).role === "ADMIN" ? "/admin" : "/dashboard"} className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", color: "var(--text-light)", background: "transparent" }}>Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center" style={{ marginLeft: "1rem", gap: "1rem" }}>
              <Link href="/register" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Sign Up</Link>
              <Link href="/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
