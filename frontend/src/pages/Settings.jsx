import React, { useEffect, useState } from "react";
import { Shield, Bell, SlidersHorizontal, Info, Sun, Moon, Monitor } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import "./Settings.css";

const STORAGE_KEY = "dashboardSettings";

const DEFAULT_SETTINGS = {
  threatDetection: true,
  malwareScanner: true,
  intrusionDetection: true,
  emailAlerts: true,
  smsAlerts: false,
  autoRefresh: true,
  refreshInterval: 30,
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        // ignore corrupt saved settings, fall back to defaults
      }
    }
  }, []);

  function handleToggle(name) {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setToast({ type: "success", message: "Settings saved successfully." });
  }

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="settings-grid">
        {/* Security */}
        <div className="settings-card">
          <h2>
            <Shield size={16} />
            Security Settings
          </h2>

          <Setting
            label="Threat Detection"
            checked={settings.threatDetection}
            onChange={() => handleToggle("threatDetection")}
          />
          <Setting
            label="Malware Scanner"
            checked={settings.malwareScanner}
            onChange={() => handleToggle("malwareScanner")}
          />
          <Setting
            label="Intrusion Detection"
            checked={settings.intrusionDetection}
            onChange={() => handleToggle("intrusionDetection")}
          />
        </div>

        {/* Alerts */}
        <div className="settings-card">
          <h2>
            <Bell size={16} />
            Alert Settings
          </h2>

          <Setting
            label="Email Alerts"
            checked={settings.emailAlerts}
            onChange={() => handleToggle("emailAlerts")}
          />
          <Setting
            label="SMS Alerts"
            checked={settings.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
          />
          <Setting
            label="Auto Refresh"
            checked={settings.autoRefresh}
            onChange={() => handleToggle("autoRefresh")}
          />
        </div>

        {/* Preferences */}
        <div className="settings-card">
          <h2>
            <SlidersHorizontal size={16} />
            Dashboard Preferences
          </h2>

          <label className="settings-label">Appearance</label>
          <div className="theme-picker">
            <button
              type="button"
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
            >
              <Sun size={15} />
              Light
            </button>
            <button
              type="button"
              className={theme === "dark" ? "active" : ""}
              onClick={() => setTheme("dark")}
            >
              <Moon size={15} />
              Dark
            </button>
            <button
              type="button"
              className={theme === "system" ? "active" : ""}
              onClick={() => setTheme("system")}
            >
              <Monitor size={15} />
              System
            </button>
          </div>

          <label className="settings-label" htmlFor="refreshInterval">
            Refresh Interval (seconds)
          </label>
          <input
            id="refreshInterval"
            type="number"
            name="refreshInterval"
            min={5}
            value={settings.refreshInterval}
            onChange={handleChange}
          />
        </div>

        {/* About */}
        <div className="settings-card">
          <h2>
            <Info size={16} />
            System Information
          </h2>

          <div className="info-row">
            <span>Application</span>
            <span>AI-Assisted Threat Detection Dashboard</span>
          </div>
          <div className="info-row">
            <span>Version</span>
            <span>1.0.0</span>
          </div>
          <div className="info-row">
            <span>Database</span>
            <span>MongoDB</span>
          </div>
          <div className="info-row">
            <span>Status</span>
            <span className="online">
              <span className="online-dot" />
              Online
            </span>
          </div>
        </div>
      </div>

      <div className="save-section">
        <button className="save-btn" onClick={saveSettings}>
          Save Settings
        </button>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
}

function Setting({ label, checked, onChange }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}
