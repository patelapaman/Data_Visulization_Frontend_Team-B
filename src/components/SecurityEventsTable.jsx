import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import "./SecurityEventsTable.css";

const ROWS_PER_PAGE = 10;

export default function SecurityEventsTable({ events: externalEvents }) {
  const [internalEvents, setInternalEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (externalEvents) return;
    Papa.parse("/security_events.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setInternalEvents(results.data || []);
      },
    });
  }, [externalEvents]);

  const rawEvents = externalEvents || internalEvents;

  useEffect(() => {
    setPage(1);
  }, [rawEvents.length, search]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rawEvents;
    return rawEvents.filter((event) =>
      Object.values(event).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [rawEvents, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];

    data.sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      if (valA < valB)
        return sortDirection === "asc" ? -1 : 1;

      if (valA > valB)
        return sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return data;
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));

  const currentRows = sorted.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  function sort(col) {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  }

  return (
    <div className="events-card">

      <div className="events-header">
        <h2>
          Security Events
          <span className="events-subcount">
            ({filtered.length.toLocaleString()} matching)
          </span>
        </h2>

        <input
          placeholder="Search table..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="events-table">

        <thead>

          <tr>

            <th onClick={() => sort("timestamp")}>
              Time {sortColumn === "timestamp" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>

            <th onClick={() => sort("event_type")}>
              Event Type {sortColumn === "event_type" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>

            <th onClick={() => sort("severity")}>
              Severity {sortColumn === "severity" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>

            <th onClick={() => sort("source_ip")}>
              Source IP {sortColumn === "source_ip" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>

            <th onClick={() => sort("event_status")}>
              Status {sortColumn === "event_status" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
            </th>

          </tr>

        </thead>

        <tbody>

          {currentRows.length > 0 ? (
            currentRows.map((event, index) => (

              <tr key={index}>

                <td>{event.timestamp}</td>

                <td>{event.event_type}</td>

                <td>
                  <span
                    className={`severity ${event.severity ? event.severity.toLowerCase() : ""}`}
                  >
                    {event.severity}
                  </span>
                </td>

                <td>{event.source_ip}</td>

                <td>{event.event_status}</td>

              </tr>

            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "28px", color: "var(--text-muted)", fontSize: "13px" }}>
                No security events match the current filter criteria.
              </td>
            </tr>
          )}

        </tbody>

      </table>

      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}