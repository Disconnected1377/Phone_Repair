"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookingList({ initialBookings }: { initialBookings: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const updateBooking = async (id: string, field: string, value: string) => {
    setLoading(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update booking. Make sure you are an admin.");
    }
    setLoading(null);
  };

  return (
    <div style={{ overflowX: "auto", position: "relative" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--card-bg)", borderRadius: "8px", overflow: "hidden", color: "var(--text-dark)" }}>
        <thead style={{ background: "var(--secondary-color)", textAlign: "left" }}>
          <tr>
            <th style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-dark)" }}>Date / ID</th>
            <th style={{ padding: "1rem", color: "var(--text-dark)" }}>Customer</th>
            <th style={{ padding: "1rem", color: "var(--text-dark)" }}>Device & Services</th>
            <th style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-dark)" }}>Payment Info</th>
            <th style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-dark)" }}>Booking Status</th>
            <th style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-dark)" }}>Repair Status</th>
          </tr>
        </thead>
        <tbody>
          {initialBookings.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid var(--border-color)", opacity: loading === b.id ? 0.5 : 1, transition: "opacity 0.2s" }}>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>{new Date(b.createdAt).toLocaleDateString()}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>ID: {b.id.substring(0,8)}...</div>
              </td>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <div style={{ fontWeight: "600" }}>{b.customer.username}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>{b.customer.phoneNumber}</div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  <strong>{b.deliveryMethod === 'DROP_OFF' ? 'Drop Off' : 'Parcel'}</strong>
                  {b.deliveryMethod === 'PARCEL' && <div style={{ fontSize: "0.75rem" }}>{b.contactAddress}</div>}
                </div>
              </td>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <div style={{ fontWeight: "600" }}>{b.model.brand.name} {b.model.name}</div>
                <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0", fontSize: "0.85rem" }}>
                  {b.services.map((s:any) => <li key={s.id}>{s.repairService.type}</li>)}
                </ul>
              </td>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <div style={{ fontWeight: "600" }}>₹{b.totalAmount}</div>
                <div style={{ fontSize: "0.85rem" }}>{b.paymentMethod}</div>
                {b.paymentScreenshotUrl && (
                  <button 
                    onClick={() => setModalImage(b.paymentScreenshotUrl)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      padding: "0.25rem 0", 
                      fontSize: "0.85rem", 
                      color: "var(--primary-color)", 
                      textDecoration: "underline", 
                      cursor: "pointer", 
                      display: "block", 
                      fontWeight: "600" 
                    }}
                  >
                    View Screenshot
                  </button>
                )}
                <div className="mt-2">
                  <select 
                    className="form-select" 
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", background: "var(--card-bg)", color: "var(--text-dark)" }}
                    value={b.paymentStatus}
                    onChange={(e) => updateBooking(b.id, 'paymentStatus', e.target.value)}
                  >
                    <option value="PENDING">Pending (Unverified)</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </td>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <select 
                  className="form-select" 
                  style={{ 
                    padding: "0.25rem 0.5rem", 
                    fontSize: "0.8rem", 
                    color: "var(--text-dark)",
                    background: b.bookingStatus === 'approved' ? 'rgba(22, 101, 52, 0.2)' : b.bookingStatus === 'disapproved' ? 'rgba(153, 27, 27, 0.2)' : 'var(--card-bg)',
                    borderColor: b.bookingStatus === 'approved' ? '#166534' : b.bookingStatus === 'disapproved' ? '#991b1b' : 'var(--border-color)'
                  }}
                  value={b.bookingStatus}
                  onChange={(e) => updateBooking(b.id, 'bookingStatus', e.target.value)}
                >
                  <option value="pending approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="disapproved">Disapproved</option>
                </select>
              </td>
              <td style={{ padding: "1rem", verticalAlign: "top" }}>
                <select 
                  className="form-select" 
                  style={{ 
                    padding: "0.25rem 0.5rem", 
                    fontSize: "0.8rem", 
                    color: "var(--text-dark)",
                    background: b.repairStatus === 'REPAIRED' ? 'rgba(22, 101, 52, 0.2)' : 'var(--card-bg)',
                    borderColor: b.repairStatus === 'REPAIRED' ? '#166534' : 'var(--border-color)'
                  }}
                  value={b.repairStatus}
                  onChange={(e) => updateBooking(b.id, 'repairStatus', e.target.value)}
                  disabled={b.bookingStatus !== 'approved'}
                >
                  <option value="PENDING">Pending Auth</option>
                  <option value="REPAIRING">Repairing...</option>
                  <option value="REPAIRED">Repaired</option>
                  <option value="UNREPAIRED">Unrepaired</option>
                </select>
              </td>
            </tr>
          ))}
          {initialBookings.length === 0 && (
            <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-light)" }}>No bookings have been made yet.</td></tr>
          )}
        </tbody>
      </table>

      {/* Screenshot Modal Overlay */}
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: "rgba(0,0,0,0.85)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 9999,
            padding: "2rem",
            backdropFilter: "blur(4px)"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: "relative", 
              background: "var(--card-bg)", 
              padding: "10px", 
              borderRadius: "12px", 
              maxWidth: "90%", 
              maxHeight: "90%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              border: "1px solid var(--border-color)"
            }}
          >
            <button 
              onClick={() => setModalImage(null)}
              style={{ 
                position: "absolute", 
                top: "-15px", 
                right: "-15px", 
                width: "35px", 
                height: "35px", 
                borderRadius: "50%", 
                background: "var(--primary-color)", 
                color: "white", 
                border: "none", 
                cursor: "pointer", 
                fontWeight: "bold", 
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              ×
            </button>
            <img 
              src={modalImage} 
              alt="Payment Screenshot" 
              style={{ display: "block", maxWidth: "100%", maxHeight: "calc(90vh - 40px)", borderRadius: "6px", objectFit: "contain" }} 
            />
            <div style={{ padding: "1rem", textAlign: "center" }}>
               <p style={{ margin: 0, fontWeight: "600", color: "var(--text-dark)" }}>Payment Verification Screenshot</p>
               <small style={{ color: "var(--text-light)" }}>Click anywhere outside to close</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
