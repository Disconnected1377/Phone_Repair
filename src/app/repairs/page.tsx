import prisma from "@/lib/prisma";
import RepairBookingFlow from "@/components/RepairBookingFlow";

// Ensure dynamic rendering to fetch latest models
export const dynamic = "force-dynamic";

export default async function RepairsPage() {
  const brands = await prisma.brand.findMany();
  const models = await prisma.model.findMany();
  const services = await prisma.repairService.findMany();

  return (
    <main style={{ background: "var(--secondary-color)", minHeight: "90vh" }}>
      <div style={{ background: "white", padding: "2rem 0", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container text-center">
          <h2>Select Repair Configuration</h2>
          <p>We provide transparent pricing and quality service.</p>
        </div>
      </div>
      
      <RepairBookingFlow brands={brands} models={models} services={services} />
    </main>
  );
}
