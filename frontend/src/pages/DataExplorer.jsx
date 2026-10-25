
import CsvUpload from "../components/CsvUpload";
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

        <div className="page-icon">
          <Database size={25} />
        </div>
      </div>

      <CsvUpload />
    </section>
  );
}
