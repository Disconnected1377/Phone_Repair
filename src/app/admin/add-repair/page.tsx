import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddRepairForm from "@/components/AddRepairForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AddRepairPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const brands = await prisma.brand.findMany({
    include: { models: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ background: "var(--secondary-color)", minHeight: "90vh", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
           <Link href="/admin" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none", marginRight: "1rem" }}>← Back to Dashboard</Link>
           <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", margin: 0 }}>Add New Repair</h2>
        </div>
        
        <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>Populate the catalog cleanly. If you cannot find the intended phone brand or model in the select list, simply click 'Other' at the bottom to dynamically add them!</p>
        
        <AddRepairForm initialBrands={brands} />
      </div>
    </div>
  );
}
