import prisma from "@/lib/prisma";
import CheckoutForm from "@/components/CheckoutForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Ensuring dynamic params evaluation
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ modelId?: string, services?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const { modelId, services: serviceIdsStr } = await searchParams;
  
  if (!modelId || !serviceIdsStr) {
    redirect("/repairs");
  }

  const serviceIds = serviceIdsStr.split(",");

  const [model, services] = await Promise.all([
    prisma.model.findUnique({
      where: { id: modelId },
      include: { brand: true }
    }),
    prisma.repairService.findMany({
      where: { id: { in: serviceIds } }
    })
  ]);

  if (!model || services.length === 0) {
    return (
      <div className="container mt-8 text-center">
        <h2>Invalid Configuration</h2>
        <p>Please return to repairs and select your services again.</p>
      </div>
    );
  }

  return (
    <main style={{ background: "var(--secondary-color)", minHeight: "90vh" }}>
      <div style={{ background: "white", padding: "2rem 0", borderBottom: "1px solid var(--border-color)", marginBottom: "3rem" }}>
        <div className="container text-center animate-fade-in">
          <h2>Checkout</h2>
          <p style={{ color: "var(--text-light)" }}>Complete your booking for device repair</p>
        </div>
      </div>
      
      <div className="container">
        <CheckoutForm model={model} services={services} />
      </div>
    </main>
  );
}
