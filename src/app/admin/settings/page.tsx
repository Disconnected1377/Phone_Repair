import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSettings from "@/components/AdminSettings";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div style={{ background: "var(--secondary-color)", minHeight: "90vh", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin" className="btn btn-outline" style={{ padding: "0.5rem 1rem" }}>← Back</Link>
          <h2 style={{ margin: 0 }}>System Settings</h2>
        </div>
        <AdminSettings />
      </div>
    </div>
  );
}
