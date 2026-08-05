import React, { useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import "./Navbar.css";

/**
 * Navbar
 * Props:
 *  - onToggleMobile: fn   -> opens the sidebar drawer on small screens
 *  - pageTitle: string    -> current section title (e.g. "Overview")
 *
 * Search input and notification data are just local UI state here.
 * Member 6 (Filters & Search) and Member 7 (API Integration) should
 * wire the search box + alert count to the real events/threats APIs.
 */
export default function Navbar({ onToggleMobile, pageTitle = "Overview" }) {
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-icon-btn navbar-menu-btn"
          onClick={onToggleMobile}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-title-block">
          <h1 className="navbar-page-title">{pageTitle}</h1>
          <p className="navbar-page-sub">Real-time cybersecurity monitoring</p>
        </div>
      </div>

      <div className="navbar-search">
        <Search size={16} className="navbar-search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, IPs, CVEs..."
          aria-label="Global search"
        />
        <kbd className="navbar-search-kbd">⌘K</kbd>
      </div>

      <div className="navbar-right">
        {/* Signature element: live monitoring pulse — the one bit
            of ambient motion in the whole shell, signalling the
            platform is actively streaming security data. */}
        <div className="live-pulse" title="Live monitoring active">
          <span className="live-pulse-ring" />
          <span className="live-pulse-dot" />
          <span className="live-pulse-label">Live</span>
        </div>

        <button type="button" className="navbar-icon-btn" aria-label="Alerts">
          <Bell size={19} />
          <span className="navbar-badge">3</span>
        </button>

        <div className="navbar-profile">
          <button
            type="button"
            className="navbar-profile-btn"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
          >
            <span className="navbar-avatar">AN</span>
            <span className="navbar-profile-name">Analyst</span>
            <ChevronDown size={15} />
          </button>

          {profileOpen && (
            <div className="navbar-profile-menu" role="menu">
              <button role="menuitem">My Profile</button>
              <button role="menuitem">Preferences</button>
              <button role="menuitem" className="danger">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
