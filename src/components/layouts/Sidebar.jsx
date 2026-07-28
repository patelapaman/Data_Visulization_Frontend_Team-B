import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldHalf,
  LayoutDashboard,
  ListTree,
  Radar,
  Bug,
  Siren,
  FileBarChart,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./Sidebar.css";


const NAV_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Security Events", path: "/dashboard/events", icon: ListTree },
  { label: "Threat Intelligence", path: "/dashboard/threats", icon: Radar },
  { label: "Vulnerabilities", path: "/dashboard/vulnerabilities", icon: Bug },
  { label: "Incidents", path: "/dashboard/incidents", icon: Siren },
  { label: "Reports", path: "/dashboard/reports", icon: FileBarChart },
];

/**
 * Sidebar
 * Props:
 *  - collapsed: bool        -> desktop icon-only mode
 *  - mobileOpen: bool       -> mobile drawer visibility
 *  - onCloseMobile: fn      -> closes the drawer (overlay click / nav click on mobile)
 *  - onToggleCollapse: fn   -> desktop collapse/expand toggle (also rendered here)
 */
export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) {
  return (
    <>
      {/* Backdrop only shows on mobile when the drawer is open */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "is-visible" : ""}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${collapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
        aria-label="Primary navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <ShieldHalf size={22} strokeWidth={2.25} />
          </div>
          {!collapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">SENTRYNET</span>
              <span className="sidebar-brand-subtitle">Threat Ops</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "is-active" : ""}`
              }
              title={collapsed ? label : undefined}
            >
              <span className="sidebar-link-icon">
                <Icon size={19} strokeWidth={2} />
              </span>
              {!collapsed && <span className="sidebar-link-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/dashboard/settings"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "is-active" : ""}`
            }
            title={collapsed ? "Settings" : undefined}
          >
            <span className="sidebar-link-icon">
              <Settings size={19} strokeWidth={2} />
            </span>
            {!collapsed && <span className="sidebar-link-label">Settings</span>}
          </NavLink>

          <button
            type="button"
            className="sidebar-link sidebar-logout"
            title={collapsed ? "Log out" : undefined}
          >
            <span className="sidebar-link-icon">
              <LogOut size={19} strokeWidth={2} />
            </span>
            {!collapsed && <span className="sidebar-link-label">Log out</span>}
          </button>

          {/* Desktop-only collapse toggle */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <>
                <ChevronsLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
