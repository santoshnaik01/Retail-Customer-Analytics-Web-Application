import { Users } from "lucide-react";

export default function Customers() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / ANALYTICS</span>
          <h1>Customer Analytics</h1>
          <p>Understand customer demographics and behavior.</p>
        </div>
        <div className="page-icon"><Users size={25} /></div>
      </div>
      <div className="empty-panel">
        <Users size={32} />
        <h2>Customer Analytics</h2>
        <p>Customer analysis content will be implemented in a later task.</p>
      </div>
    </section>
  );
}