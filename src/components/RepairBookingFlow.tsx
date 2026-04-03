"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Brand = { id: string; name: string };
type Model = { id: string; name: string; brandId: string };
type Service = { id: string; type: string; price: number; description: string; modelId: string; estimatedTime: string | null };

interface Props {
  brands: Brand[];
  models: Model[];
  services: Service[];
}

export default function RepairBookingFlow({ brands, models, services }: Props) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedRepairs, setSelectedRepairs] = useState<Service[]>([]);

  const filteredModels = models.filter((m) => m.brandId === selectedBrand);
  const availableServices = services.filter((s) => s.modelId === selectedModel);

  const toggleRepair = (service: Service) => {
    if (selectedRepairs.find((s) => s.id === service.id)) {
      setSelectedRepairs(selectedRepairs.filter((s) => s.id !== service.id));
    } else {
      setSelectedRepairs([...selectedRepairs, service]);
    }
  };

  const totalAmount = selectedRepairs.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (selectedRepairs.length === 0) return alert("Select at least one repair service");
    const serviceIds = selectedRepairs.map(s => s.id).join(",");
    router.push(`/checkout?modelId=${selectedModel}&services=${serviceIds}`);
  };

  return (
    <div className="container" style={{ padding: "3rem 1rem" }}>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Selection Flow */}
        <div style={{ flex: "2" }}>
          
          <div className="card mb-8">
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              1. Which Device are you using?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="form-select" 
                value={selectedBrand} 
                onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); setSelectedRepairs([]); }}
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              
              <select 
                className="form-select" 
                value={selectedModel} 
                onChange={(e) => { setSelectedModel(e.target.value); setSelectedRepairs([]); }}
                disabled={!selectedBrand}
              >
                <option value="">Select Model</option>
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedModel && (
            <div className="card animate-fade-in">
              <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                2. Select Repair Type
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.length > 0 ? availableServices.map((service) => (
                  <div key={service.id} style={{ 
                    border: "1px solid", 
                    borderColor: selectedRepairs.find((s) => s.id === service.id) ? "var(--primary-color)" : "var(--border-color)", 
                    borderRadius: "8px", 
                    padding: "1rem",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    background: selectedRepairs.find((s) => s.id === service.id) ? "rgba(46, 125, 50, 0.05)" : "white"
                  }}
                  onClick={() => toggleRepair(service)}
                  >
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{service.type}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "1rem", minHeight: "40px" }}>{service.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span style={{ fontWeight: "600", color: "var(--primary-color)", display: "block" }}>₹ {service.price}</span>
                        {service.estimatedTime && <small style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>Time: {service.estimatedTime}</small>}
                      </div>
                      <button 
                        className={`btn ${selectedRepairs.find((s) => s.id === service.id) ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
                      >
                        {selectedRepairs.find((s) => s.id === service.id) ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                )) : (
                  <p>No services currently available for this model.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Repair List Summary */}
        <div style={{ flex: "1" }}>
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem", textAlign: "center" }}>
              Repair List
            </h3>
            
            <div className="flex justify-between items-center mb-4">
              <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Total</span>
              <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary-color)" }}>₹ {totalAmount}</span>
            </div>

            <div style={{ minHeight: "150px" }}>
              {selectedRepairs.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-light)", marginTop: "2rem" }}>No repair selected</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {selectedRepairs.map((s) => (
                    <li key={s.id} className="flex justify-between" style={{ padding: "0.75rem 0", borderBottom: "1px dashed var(--border-color)", fontSize: "0.9rem" }}>
                      <span>{s.type}</span>
                      <span style={{ fontWeight: "600" }}>₹ {s.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              className="btn btn-primary w-full mt-8" 
              style={{ padding: "1rem", fontSize: "1.1rem" }}
              disabled={selectedRepairs.length === 0}
              onClick={handleCheckout}
            >
              CHECKOUT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
