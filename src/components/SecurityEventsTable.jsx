import React, { useEffect, useMemo, useState } from "react";
import "./SecurityEventsTable.css";
import { getEvents } from "../services/api";

const ROWS_PER_PAGE = 10;

export default function SecurityEventsTable() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }

    loadEvents();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((event) =>
      Object.values(event)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];

    data.sort((a, b) => {
      const valueA = a[sortColumn] || "";
      const valueB = b[sortColumn] || "";

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;

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
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  }

  return (
    <div className="events-card">
      <div className="events-header">
        <h2>Security Events</h2>

        <input
          type="text"
          placeholder="Search events..."
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
            <th onClick={() => sort("timestamp")}>Time</th>
            <th onClick={() => sort("event_type")}>Event Type</th>
            <th onClick={() => sort("severity")}>Severity</th>
            <th onClick={() => sort("source_ip")}>Source IP</th>
            <th onClick={() => sort("event_status")}>Status</th>
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
                    className={`severity ${(event.severity || "").toLowerCase()}`}
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
              <td colSpan="5" style={{ textAlign: "center" }}>
                No events found
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
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}