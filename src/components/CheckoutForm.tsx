"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ model, services }: any) {
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState("DROP_OFF");
  
  const [addressForm, setAddressForm] = useState({
    village: "",
    poAddress: "",
    city: "",
    state: "",
    pinCode: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("OFFLINE");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data.paymentQRCodeUrl) setQrCode(data.paymentQRCodeUrl);
      });
  }, []);

  const totalAmount = services.reduce((acc: number, s: any) => acc + s.price, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
         alert("Image is too large. Please upload an image under 5MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAddress = () => {
    const { village, poAddress, city, state, pinCode } = addressForm;
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(pinCode)) {
      setError("PIN Code must be exactly 6 digits.");
      return false;
    }

    const textRegex = /^[A-Za-z\s]+$/;
    if (village.length <= 5 || !textRegex.test(village)) {
      setError("Village / Street Name must be more than 5 characters and contain only alphabets.");
      return false;
    }
    if (poAddress.length <= 5 || !textRegex.test(poAddress)) {
      setError("P.O. Address must be more than 5 characters and contain only alphabets.");
      return false;
    }
    if (city.length <= 5 || !textRegex.test(city)) {
      setError("City must be more than 5 characters and contain only alphabets.");
      return false;
    }
    if (state.length <= 5 || !textRegex.test(state)) {
      setError("State must be more than 5 characters and contain only alphabets.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateAddress()) {
      setLoading(false);
      return;
    }

    if (paymentMethod === "ONLINE" && !screenshotUrl) {
      setError("Please upload a payment screenshot for online payments.");
      setLoading(false);
      return;
    }

    const fullAddress = `${addressForm.village}, ${addressForm.poAddress}, ${addressForm.city}, ${addressForm.state} - PIN: ${addressForm.pinCode}`;

    const payload = {
      modelId: model.id,
      services: services.map((s: any) => s.id),
      deliveryMethod,
      contactAddress: fullAddress,
      paymentMethod,
      paymentScreenshotUrl: screenshotUrl || null,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/dashboard?success=true");
    } else {
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login?redirect=/checkout");
      } else {
        setError(data.message || "Failed to place order.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Checkout Form */}
      <div style={{ flex: "2" }}>
        {error && <div style={{ color: "white", background: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ borderTop: "4px solid var(--primary-color)" }}>
          <h3 className="mb-4" style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>Delivery Details</h3>
          
          <div className="form-group">
            <label className="form-label">Delivery Method</label>
            <select className="form-select" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
              <option value="DROP_OFF">Drop Off at Shop</option>
              <option value="PARCEL">Parcel Device to Shop</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>Village / Street Name</label>
                <input className="form-input" minLength={6} pattern="^[A-Za-z\s]+$" title="Only alphabets and spaces are allowed." required value={addressForm.village} onChange={e => {
                  const val = e.target.value;
                  if (val === "" || /^[A-Za-z\s]+$/.test(val)) setAddressForm({...addressForm, village: val});
                }} placeholder="Village name" />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>P.O. Address</label>
                <input className="form-input" minLength={6} pattern="^[A-Za-z\s]+$" title="Only alphabets and spaces are allowed." required value={addressForm.poAddress} onChange={e => {
                  const val = e.target.value;
                  if (val === "" || /^[A-Za-z\s]+$/.test(val)) setAddressForm({...addressForm, poAddress: val});
                }} placeholder="Post Office" />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>City</label>
                <input className="form-input" minLength={6} pattern="^[A-Za-z\s]+$" title="Only alphabets and spaces are allowed." required value={addressForm.city} onChange={e => {
                  const val = e.target.value;
                  if (val === "" || /^[A-Za-z\s]+$/.test(val)) setAddressForm({...addressForm, city: val});
                }} placeholder="City" />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>State</label>
                <input className="form-input" minLength={6} pattern="^[A-Za-z\s]+$" title="Only alphabets and spaces are allowed." required value={addressForm.state} onChange={e => {
                  const val = e.target.value;
                  if (val === "" || /^[A-Za-z\s]+$/.test(val)) setAddressForm({...addressForm, state: val});
                }} placeholder="State" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>PIN Code</label>
                <input className="form-input" type="text" maxLength={6} pattern="\d{6}" required value={addressForm.pinCode} onChange={e => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setAddressForm({...addressForm, pinCode: val});
                  }
                }} placeholder="123456" />
              </div>
            </div>
            {deliveryMethod === "DROP_OFF" && (
              <small style={{ color: "var(--text-light)", display: "block", marginTop: "1rem" }}>We still need your address for billing and record purposes.</small>
            )}
            {deliveryMethod === "PARCEL" && (
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(46, 125, 50, 0.05)", borderRadius: "8px", border: "1px dashed var(--primary-color)" }}>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Shop Parcel Address:</strong>
                HiTech Repair Center<br/>
                123 Main Street, Tech Park<br/>
                City, State, 123456
              </div>
            )}
          </div>

          <h3 className="mb-4 mt-8" style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>Payment Method</h3>
          <div className="form-group">
            <div className="flex gap-4">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "8px", width: "100%", cursor: "pointer", background: paymentMethod === "OFFLINE" ? "rgba(46, 125, 50, 0.05)" : "white", transition: "var(--transition)" }}>
                <input type="radio" name="payment" value="OFFLINE" checked={paymentMethod === "OFFLINE"} onChange={() => setPaymentMethod("OFFLINE")} />
                Pay Offline (At Shop)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "8px", width: "100%", cursor: "pointer", background: paymentMethod === "ONLINE" ? "rgba(46, 125, 50, 0.05)" : "white", transition: "var(--transition)" }}>
                <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
                Google Pay (Online)
              </label>
            </div>
          </div>

          {paymentMethod === "ONLINE" && (
            <div className="form-group animate-fade-in" style={{ padding: "1.5rem", background: "var(--secondary-color)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div className="text-center mb-6">
                <div style={{ width: "200px", height: "auto", minHeight: "200px", background: "white", border: "1px solid #e0e0e0", borderRadius: "12px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", boxShadow: "var(--shadow-sm)" }}>
                  {qrCode ? (
                    <img src={qrCode} alt="Google Pay QR Code" style={{ maxWidth: "100%", borderRadius: "8px" }} />
                  ) : (
                    <div style={{ color: "var(--text-light)", fontSize: "0.85rem", padding: "1rem" }}>
                      QR Code not set by shop yet. Please contact admin.
                    </div>
                  )}
                </div>
                {qrCode && <p className="mt-3" style={{ fontWeight: "600", fontSize: "1.1rem" }}>Scan to Pay ₹{totalAmount}</p>}
              </div>
              
              <label className="form-label" style={{ fontWeight: "600" }}>Upload Payment Screenshot (Required)</label>
              <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
                <input 
                  type="file" 
                  accept=".png, .jpg, .jpeg"
                  className="form-input" 
                  required={paymentMethod === "ONLINE"} 
                  onChange={handleFileUpload} 
                  style={{ background: "white", padding: "0.5rem", cursor: "pointer" }}
                />
              </div>
              
              {screenshotUrl && (
                <div className="mt-4 text-center animate-fade-in">
                  <p style={{ fontSize: "0.85rem", color: "var(--primary-color)", marginBottom: "0.5rem", fontWeight: "600" }}>Screenshot selected</p>
                  <img src={screenshotUrl} alt="Screenshot Preview" style={{ maxWidth: "200px", maxHeight: "250px", borderRadius: "8px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }} />
                </div>
              )}
              
              <small style={{ color: "var(--text-light)", display: "block", marginTop: "1rem", lineHeight: "1.4" }}>Browse and upload the screenshot of your successful transaction (.png, .jpg, .jpeg). Our super user will verify this before approving.</small>
            </div>
          )}

          <button className="btn btn-primary w-full mt-8" type="submit" disabled={loading} style={{ padding: "1rem", fontSize: "1.1rem" }}>
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div style={{ flex: "1" }}>
        <div className="card" style={{ position: "sticky", top: "100px", borderTop: "4px solid var(--primary-color)" }}>
          <h3 className="mb-4" style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)", textAlign: "center" }}>Order Summary</h3>
          <div className="mb-4" style={{ background: "var(--secondary-color)", padding: "1rem", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-light)", display: "block", marginBottom: "0.25rem" }}>Device</span>
            <strong>{model?.brand?.name} {model?.name}</strong>
          </div>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
            {services.map((s: any) => (
              <li key={s.id} className="flex justify-between items-center mb-3 pb-3" style={{ borderBottom: "1px dashed var(--border-color)" }}>
                <span style={{ fontSize: "0.95rem" }}>{s.type}</span>
                <span style={{ fontWeight: "600" }}>₹{s.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center" style={{ paddingTop: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-light)" }}>Total</span>
            <span style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-dark)", letterSpacing: "-1px" }}>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
