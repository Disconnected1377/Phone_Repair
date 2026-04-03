import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // Prevent users from accessing the admin dashboard if they are ADMIN
  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  const params = await searchParams;
  const isSuccess = params.success === "true";

  const bookings = await prisma.booking.findMany({
    where: { customerId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: {
      model: { include: { brand: true } },
      services: { include: { repairService: true } }
    }
  });

  return (
    <div className="container" style={{ padding: "4rem 2rem", minHeight: "80vh" }}>
      {isSuccess && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "1rem", borderRadius: "8px", marginBottom: "2rem", border: "1px solid #bbf7d0" }}>
          <strong>Success!</strong> Your booking has been placed and is currently pending approval.
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8 border-b" style={{ paddingBottom: "1rem" }}>
        <h2 style={{ margin: 0 }}>My Repair Bookings</h2>
        <Link href="/repairs" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>+ Book New Repair</Link>
      </div>
      
      {bookings.length === 0 ? (
        <div className="card text-center animate-fade-in" style={{ padding: "4rem" }}>
          <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>You haven't booked any repairs yet.</p>
          <Link href="/repairs" className="btn btn-primary">Book a Repair</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="card animate-fade-in" style={{ borderLeft: "4px solid var(--primary-color)" }}>
              <div className="flex justify-between items-center mb-4 border-b" style={{ paddingBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{booking.model.brand.name} {booking.model.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>Ordered on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div style={{ fontWeight: "700", fontSize: "1.2rem", color: "var(--primary-color)" }}>₹{booking.totalAmount}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>{booking.paymentMethod} • {booking.paymentStatus === 'PENDING' ? 'Unverified' : booking.paymentStatus}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={{ background: "var(--secondary-color)", padding: "1rem", borderRadius: "8px" }}>
                  <strong>Services:</strong>
                  <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                    {booking.services.map((bs) => (
                      <li key={bs.id} style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>{bs.repairService.type}</li>
                    ))}
                  </ul>
                  
                  <div className="mt-4">
                    <strong>Delivery:</strong> {booking.deliveryMethod === 'DROP_OFF' ? 'Dropping off at shop' : 'Parcelling to shop'}
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--secondary-color)", padding: "1rem", borderRadius: "8px" }}>
                  <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <strong>Booking Status:</strong> 
                    <span 
                      style={{ 
                        padding: "0.35rem 1rem", 
                        borderRadius: "99px", 
                        fontSize: "0.85rem", 
                        fontWeight: "600",
                        background: booking.bookingStatus === "approved" ? "#dcfce7" : booking.bookingStatus === "disapproved" ? "#fee2e2" : "#fef3c7",
                        color: booking.bookingStatus === "approved" ? "#166534" : booking.bookingStatus === "disapproved" ? "#991b1b" : "#92400e",
                        textTransform: "capitalize"
                      }}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <strong>Repair Status:</strong> 
                    <span 
                      style={{ 
                        padding: "0.35rem 1rem", 
                        borderRadius: "99px", 
                        fontSize: "0.85rem", 
                        fontWeight: "600",
                        background: booking.repairStatus === "REPAIRED" ? "#dcfce7" : booking.repairStatus === "REPAIRING" ? "#dbeafe" : booking.repairStatus === "UNREPAIRED" ? "#fee2e2" : "#f3f4f6",
                        color: booking.repairStatus === "REPAIRED" ? "#166534" : booking.repairStatus === "REPAIRING" ? "#1e40af" : booking.repairStatus === "UNREPAIRED" ? "#991b1b" : "#374151"
                      }}>
                      {booking.repairStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
