import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminBookingList from "@/components/AdminBookingList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      model: { include: { brand: true } },
      services: { include: { repairService: true } }
    }
  });

  return (
    <div style={{ background: "var(--secondary-color)", minHeight: "90vh", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: "1400px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", letterSpacing: "-0.5px", margin: 0 }}>Super User Dashboard</h2>
          <Link href="/admin/add-repair" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
            + Add Repair Service
          </Link>
        </div>
        
        <div className="card animate-fade-in" style={{ padding: "0", borderTop: "4px solid var(--primary-color)", background: "var(--card-bg)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)", background: "rgba(46, 125, 50, 0.05)" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-dark)" }}>Customer Bookings Overview</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-light)", marginTop: "0.25rem" }}>Manage payments, verify screenshots, and update repair statuses.</p>
          </div>
          <AdminBookingList initialBookings={bookings} />
        </div>
      </div>
    </div>
  );
}
