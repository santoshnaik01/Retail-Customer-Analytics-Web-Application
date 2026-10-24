import { Database } from "lucide-react";

export default function DataExplorer() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / DATA</span>
          <h1>Data Explorer</h1>
          <p>Inspect and explore your retail dataset.</p>
        </div>
        <div className="page-icon"><Database size={25} /></div>
      </div>
      <div className="empty-panel">
        <Database size={32} />
        <h2>Data Explorer</h2>
        <p>Dataset exploration will be implemented in a later task.</p>
      </div>
    </section>
  );
}