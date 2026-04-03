"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRepairForm({ initialBrands }: { initialBrands: any[] }) {
  const router = useRouter();
  
  const [brands, setBrands] = useState(initialBrands);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  
  const [selectedModel, setSelectedModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [price, setPrice] = useState("");
  const [partPrice, setPartPrice] = useState("0");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeBrand = brands.find((b: any) => b.name === selectedBrand);
  const models = activeBrand ? activeBrand.models : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const brandName = selectedBrand === "other" ? customBrand : selectedBrand;
    const modelName = selectedModel === "other" ? customModel : selectedModel;

    if (!brandName) {
      setError("Please select or enter a brand.");
      setLoading(false); return;
    }
    if (!modelName) {
      setError("Please select or enter a model.");
      setLoading(false); return;
    }

    try {
      const res = await fetch("/api/admin/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          modelName,
          type,
          description,
          price: Number(price),
          partPrice: Number(partPrice),
          estimatedTime
        })
      });

      if (res.ok) {
        setMessage("Repair service added successfully! It is now available for customers to explore.");
        // We do not erase the brand and model if they want to add multiple repairs rapidly 
        setType("");
        setDescription("");
        setEstimatedTime("");
        setPrice("");
        setPartPrice("0");
        router.refresh(); 
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add repair service.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ borderTop: "4px solid var(--primary-color)" }}>
      {error && <div style={{ background: "rgba(153, 27, 27, 0.2)", color: "#ef4444", border: "1px solid #991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>{error}</div>}
      {message && <div style={{ background: "rgba(22, 101, 52, 0.2)", color: "#22c55e", border: "1px solid #166534", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>{message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="form-group">
          <label className="form-label">Phone Brand</label>
          <select className="form-select" value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); }} required>
            <option value="" disabled>Select Brand</option>
            {brands.map((b: any) => <option key={b.id} value={b.name}>{b.name}</option>)}
            <option value="other" style={{ fontWeight: "700", color: "var(--primary-color)" }}>Select Other (Add New)</option>
          </select>
          {selectedBrand === "other" && (
            <input type="text" className="form-input mt-2 animate-fade-in" placeholder="Enter new brand name (e.g. Samsung)" required value={customBrand} onChange={e => setCustomBrand(e.target.value)} />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Model</label>
          <select className="form-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required disabled={!selectedBrand}>
            <option value="" disabled>Select Model</option>
            {models.map((m: any) => <option key={m.id} value={m.name}>{m.name}</option>)}
            <option value="other" style={{ fontWeight: "700", color: "var(--primary-color)" }}>Select Other (Add New)</option>
          </select>
          {selectedModel === "other" && (
            <input type="text" className="form-input mt-2 animate-fade-in" placeholder="Enter new model name (e.g. Galaxy S24)" required value={customModel} onChange={e => setCustomModel(e.target.value)} />
          )}
        </div>
      </div>

      <div className="form-group mb-6">
        <label className="form-label">Repair Service Type</label>
        <input type="text" className="form-input" placeholder="e.g. Screen Replacement, Battery Change" required value={type} onChange={e => setType(e.target.value)} />
      </div>

      <div className="form-group mb-6">
        <label className="form-label">Description / Guidelines (Optional)</label>
        <textarea className="form-input" placeholder="Additional details about the repair" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="form-group">
          <label className="form-label">Total Custom Price (₹)</label>
          <input type="number" min="1" step="0.01" className="form-input" required value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Base Part Cost (₹)</label>
          <input type="number" min="0" step="0.01" className="form-input" required value={partPrice} onChange={e => setPartPrice(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Estimated Time Taken</label>
          <input type="text" className="form-input" placeholder="e.g. 2 hours, 1 day" required value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: "1rem", fontSize: "1.1rem" }}>
        {loading ? "Adding Repair..." : "Add Repair Service to Catalog"}
      </button>
    </form>
  );
}
