"use client";
import React, { useState, useEffect } from "react";

export default function AdminSettings() {
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data.paymentQRCodeUrl) setQrCode(data.paymentQRCodeUrl);
      });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Under 5MB please."); return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setQrCode(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    setLoading(true); setMessage(""); setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentQRCodeUrl: qrCode })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Settings updated successfully!");
      } else {
        setError(data.message || "Failed to update settings.");
      }
    } catch (err) {
      setError("Network error or file too large.");
    }
    setLoading(false);
  };

  return (
    <div className="card animate-fade-in" style={{ borderTop: "4px solid var(--primary-color)" }}>
      <h3 className="mb-4">Payment System Configuration</h3>
      <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
        Upload your Google Pay / UPI QR code here. This will be displayed to all customers who choose the "Online" payment method during checkout.
      </p>

      {error && <div style={{ background: "rgba(153, 27, 27, 0.2)", color: "#ef4444", border: "1px solid #991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>{error}</div>}
      {message && <div style={{ background: "rgba(22, 101, 52, 0.2)", color: "#22c55e", border: "1px solid #166534", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>{message}</div>}

      <div className="form-group">
        <label className="form-label">Google Pay QR Code Image</label>
        <input type="file" accept=".png, .jpg, .jpeg" className="form-input" onChange={handleFileUpload} />
        <small style={{ color: "var(--text-light)", display: "block", marginTop: "0.5rem" }}>Please upload a clear, high-resolution square image of your QR code.</small>
      </div>

      {qrCode && (
        <div style={{ marginTop: "2rem", textAlign: "center", padding: "1.5rem", background: "var(--secondary-color)", borderRadius: "12px", border: "1px dashed var(--border-color)" }}>
           <p style={{ fontWeight: "600", marginBottom: "1rem" }}>Current Preview:</p>
           <img src={qrCode} alt="QRCode Preview" style={{ maxWidth: "250px", borderRadius: "8px", boxShadow: "var(--shadow-md)" }} />
        </div>
      )}

      <button onClick={saveSettings} disabled={loading} className="btn btn-primary w-full mt-8" style={{ padding: "1rem" }}>
        {loading ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  );
}
