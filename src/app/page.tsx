import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="hero" style={{ padding: "8rem 0", background: "linear-gradient(135deg, var(--secondary-color) 0%, #e2e8f0 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background decorative elements */}
        <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "300px", height: "300px", background: "var(--primary-color)", opacity: 0.05, borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "400px", height: "400px", background: "var(--primary-color)", opacity: 0.05, borderRadius: "50%", filter: "blur(60px)" }} />
        
        <div className="container animate-fade-in" style={{ position: "relative", zIndex: 10 }}>
          <h1 style={{ fontSize: "4rem", marginBottom: "1.5rem", letterSpacing: "-1px", color: "var(--text-dark)" }}>Repair Without <span style={{ color: "var(--primary-color)" }}>Boundaries</span></h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto 2.5rem", color: "var(--text-light)" }}>
            Premium smartphone repair services at your convenience. Drop off or parcel your device to us and track your repair state in real-time.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/repairs" className="btn btn-primary" style={{ padding: "1.2rem 2.5rem", fontSize: "1.1rem", borderRadius: "12px", boxShadow: "0 10px 25px rgba(46, 125, 50, 0.3)" }}>
              Book a Repair Now
            </Link>
          </div>
        </div>
      </section>

      <section className="features container" style={{ padding: "6rem 2rem" }}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="card text-center" style={{ padding: "3rem 2rem", borderRadius: "16px" }}>
             <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>📱</div>
             <h3 style={{ fontSize: "1.5rem", paddingBottom: "0.5rem" }}>1. Select Your Device</h3>
             <p>Tell us your smartphone brand and model. We support top brands.</p>
           </div>
           <div className="card text-center" style={{ padding: "3rem 2rem", borderRadius: "16px" }}>
             <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🔧</div>
             <h3 style={{ fontSize: "1.5rem", paddingBottom: "0.5rem" }}>2. Select Repair Type</h3>
             <p>Choose from our premium repair options like broken screen, charging port, or battery.</p>
           </div>
           <div className="card text-center" style={{ padding: "3rem 2rem", borderRadius: "16px" }}>
             <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>📦</div>
             <h3 style={{ fontSize: "1.5rem", paddingBottom: "0.5rem" }}>3. Drop Off or Parcel</h3>
             <p>Send the device to our shop address. We securely fix it and update your status.</p>
           </div>
         </div>
      </section>
    </main>
  );
}
