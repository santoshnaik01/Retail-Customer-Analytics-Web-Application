import { ShoppingBag } from "lucide-react";

export default function ShoppingPatterns() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / ANALYTICS</span>
          <h1>Shopping Patterns</h1>
          <p>Explore product preferences and purchase behavior.</p>
        </div>
        <div className="page-icon"><ShoppingBag size={25} /></div>
      </div>
      <div className="empty-panel">
        <ShoppingBag size={32} />
        <h2>Shopping Patterns</h2>
        <p>Shopping pattern analysis will be implemented in a later task.</p>
      </div>
    </section>
  );
}