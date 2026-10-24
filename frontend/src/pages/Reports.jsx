import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORKSPACE / REPORTING</span>
          <h1>Reports Center</h1>
          <p>Access downloadable retail analytics reports.</p>
        </div>
        <div className="page-icon"><FileText size={25} /></div>
      </div>
      <div className="empty-panel">
        <FileText size={32} />
        <h2>Reports Center</h2>
        <p>Report generation and downloads will be implemented in a later task.</p>
      </div>
    </section>
  );
}