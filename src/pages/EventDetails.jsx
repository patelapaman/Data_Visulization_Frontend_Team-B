import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvents } from "../services/api";

function getEventId(event) {
  return event?.event_id ?? event?.eventId ?? event?.id;
}

function getEventsList(response) {
  if (Array.isArray(response)) return response;
  return response?.events ?? response?.data ?? response?.results ?? [];
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function EventDetails() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        setError(null);

        const response = await getEvents();
        const matchingEvent = getEventsList(response).find(
          (item) => String(getEventId(item)) === String(eventId)
        );

        setEvent(matchingEvent ?? null);
      } catch (err) {
        setError(err.message || "Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>Event Investigation</h1>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>Event Investigation</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: "24px" }}>
        <h1>Event Investigation</h1>
        <p>No event details found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Event Investigation</h1>

      <div className="table-card" style={{ padding: "24px", marginTop: "20px" }}>
        <h2>Event Details</h2>

        <p>
          <strong>Event ID:</strong> {eventId}
        </p>

        <p>
          <strong>Timestamp:</strong> {event.timestamp || event.date || "N/A"}
        </p>

        <p>
          <strong>Source:</strong> {event.source_ip || event.source || "N/A"}
        </p>

        <p>
          <strong>Event Type:</strong> {event.event_type || event.type || "N/A"}
        </p>

        <p>
          <strong>Severity / Risk:</strong> {event.severity || event.risk || "N/A"}
        </p>

        <p>
          <strong>Status:</strong> {event.event_status || event.status || "N/A"}
        </p>

        <p>
          <strong>Description / Details:</strong>{" "}
          {event.description || event.details || event.message || "N/A"}
        </p>

        <p>
          <strong>All Event Fields</strong>
        </p>

        <div>
          <dl style={{ display: "grid", gridTemplateColumns: "minmax(150px, 1fr) 2fr", gap: "8px 16px" }}>
            {Object.entries(event).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt style={{ fontWeight: 600 }}>{key}</dt>
                <dd style={{ margin: 0, overflowWrap: "anywhere" }}>{formatValue(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
