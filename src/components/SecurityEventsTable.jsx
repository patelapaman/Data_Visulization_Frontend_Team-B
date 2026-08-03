import { useMemo, useState } from "react";
import "./SecurityEventsTable.css";

const ROWS_PER_PAGE = 10;

export default function SecurityEventsTable({ events = [] }) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);

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
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;

      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;

      return 0;
    });

    return data;
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);

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
        <h2>Security Events</h2>

        <input
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

            <th onClick={() => sort("timestamp")}>
              Time
            </th>

            <th onClick={() => sort("event_type")}>
              Event Type
            </th>

            <th onClick={() => sort("severity")}>
              Severity
            </th>

            <th onClick={() => sort("source_ip")}>
              Source IP
            </th>

            <th onClick={() => sort("event_status")}>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {currentRows.map((event, index) => (

            <tr key={index}>

              <td>{event.timestamp}</td>

              <td>{event.event_type}</td>

              <td>

                <span
                  className={`severity ${event.severity.toLowerCase()}`}
                >
                  {event.severity}
                </span>

              </td>

              <td>{event.source_ip}</td>

              <td>{event.event_status}</td>

            </tr>

          ))}

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