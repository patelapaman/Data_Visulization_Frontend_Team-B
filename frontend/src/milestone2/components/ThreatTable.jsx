import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

const PAGE_SIZE = 12;

<<<<<<< HEAD
export default function ThreatTable({ data, onSelect, search, setSearch, filters, filterOptions, updateFilter }) {
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, filters]);
=======
export default function ThreatTable({ data, onSelect, search, setSearch, severity, setSeverity }) {
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, severity]);
>>>>>>> origin/main

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const rows = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  return (
    <div className="m2-panel">
      <div className="m2-panel-head">
        <div>
          <h2>AI Threat Analysis</h2>
          <p>{data.length.toLocaleString()} matching predictions from the shared Overview telemetry</p>
        </div>
        <div className="m2-filters">
          <label><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search event, IP, type, user..." /></label>
<<<<<<< HEAD
          <select value={filters.risk} onChange={e => updateFilter("risk", e.target.value)} aria-label="Risk level">
            <option value="">All risk levels</option>
            <option>Normal</option><option>Low Threat</option><option>Medium Threat</option>
            <option>High Threat</option><option>Critical Threat</option>
          </select>
          <select value={filters.threatType} onChange={e => updateFilter("threatType", e.target.value)} aria-label="Threat type">
            <option value="">All threat types</option>
            {filterOptions.threatTypes.map(value => <option key={value}>{value}</option>)}
          </select>
          <select value={filters.asset} onChange={e => updateFilter("asset", e.target.value)} aria-label="Asset">
            <option value="">All assets</option>
            {filterOptions.assets.map(value => <option key={value}>{value}</option>)}
          </select>
          <select value={filters.department} onChange={e => updateFilter("department", e.target.value)} aria-label="Department">
            <option value="">All departments</option>
            {filterOptions.departments.map(value => <option key={value}>{value}</option>)}
          </select>
          <select value={filters.mitre} onChange={e => updateFilter("mitre", e.target.value)} aria-label="MITRE technique">
            <option value="">All MITRE techniques</option>
            {filterOptions.mitre.map(value => <option key={value}>{value}</option>)}
          </select>
          <label className="m2-date-filter"><span>From</span><input type="date" value={filters.dateFrom} onChange={e => updateFilter("dateFrom", e.target.value)} /></label>
          <label className="m2-date-filter"><span>To</span><input type="date" value={filters.dateTo} onChange={e => updateFilter("dateTo", e.target.value)} /></label>
          <select value={filters.status} onChange={e => updateFilter("status", e.target.value)} aria-label="Event status">
            <option value="">All statuses</option>
            {filterOptions.statuses.map(value => <option key={value}>{value}</option>)}
          </select>
          <select value={filters.sort} onChange={e => updateFilter("sort", e.target.value)} aria-label="Sort predictions">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="confidence-high">Highest confidence</option>
            <option value="confidence-low">Lowest confidence</option>
          </select>
=======
          <select value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="">All severity</option>
            <option>Normal</option><option>Low Threat</option><option>Medium Threat</option>
            <option>High Threat</option><option>Critical Threat</option>
          </select>
>>>>>>> origin/main
        </div>
      </div>
      <div className="m2-table-wrap">
        <table>
          <thead><tr><th>Event ID</th><th>Event Type</th><th>Prediction</th><th>Confidence</th><th>Severity</th><th>Source IP</th><th>Timestamp</th><th /></tr></thead>
          <tbody>
            {rows.map(x => (
              <tr key={x.event_id} onClick={() => onSelect(x.event_id)}>
                <td className="m2-mono">{x.event_id}</td>
                <td>{x.event?.event_type || "—"}</td>
                <td><span className={`m2-pill m2-${x.prediction.toLowerCase()}`}>{x.prediction}</span></td>
                <td><b>{x.confidence_score}%</b></td>
                <td><span className={`m2-severity m2-${x.severity.replaceAll(" ","-").toLowerCase()}`}>{x.severity}</span></td>
                <td className="m2-mono">{x.event?.source_ip || "N/A"}</td>
                <td>{new Date(x.prediction_timestamp).toLocaleString()}</td>
                <td><ChevronRight size={17} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <div className="m2-empty">No matching predictions.</div>}
      </div>
      {data.length > PAGE_SIZE && (
        <div className="m2-pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
