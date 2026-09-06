import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Pencil,
  X,
  Save,
  LogOut,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import "./Profile.css";

/**
 * Profile ("My Profile")
 * Always shown for the currently signed-in analyst — no separate
 * :id param needed since a user only ever views their own profile
 * from the navbar. Renders instantly from AuthContext, then quietly
 * enriches with any extra fields the backend has (department,
 * designation, phone) if reachable — never gets stuck on a blank
 * "Loading..." screen if the backend is offline.
 */
export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    designation: user?.designation || "",
  });

  // Quietly try to enrich the profile from the backend, without
  // ever blocking the page or crashing if it's unreachable.
  useEffect(() => {
    let cancelled = false;
    getProfile().then((data) => {
      if (cancelled || !data || !Object.keys(data).length) return;
      const merged = { ...user, ...data };
      updateUser(merged);
      setForm((prev) => ({
        ...prev,
        phone: merged.phone || prev.phone,
        department: merged.department || prev.department,
        designation: merged.designation || prev.designation,
      }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = user?.name || "Analyst";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEditing() {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      department: user?.department || "",
      designation: user?.designation || "",
    });
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const updated = { ...user, ...form };

    try {
      await updateProfile(form);
      setToast({ type: "success", message: "Profile updated successfully." });
    } catch {
      // Backend not reachable — still save locally so the edit isn't lost.
      setToast({
        type: "info",
        message: "Saved locally. Backend was unreachable.",
      });
    } finally {
      updateUser(updated);
      setSaving(false);
      setEditing(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <DashboardLayout pageTitle="My Profile">
      <div className="profile-page">
        {/* Header card */}
        <div className="profile-hero">
          <div className="profile-avatar-lg">{initials}</div>

          <div className="profile-hero-info">
            <h1>{displayName}</h1>
            <p className="profile-role-badge">
              <ShieldCheck size={14} />
              {user?.role || "Security Analyst"}
            </p>
          </div>

          <div className="profile-hero-actions">
            {!editing && (
              <button className="profile-btn profile-btn-primary" onClick={startEditing}>
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
            <button className="profile-btn profile-btn-danger" onClick={handleLogout}>
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        <div className="profile-grid">
          {/* Account details */}
          <div className="profile-card">
            <h2>Account Details</h2>

            {editing ? (
              <form className="profile-form" onSubmit={handleSave}>
                <label>
                  <span>Full name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </label>

                <label>
                  <span>Phone</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                  />
                </label>

                <label>
                  <span>Department</span>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. Security Operations"
                  />
                </label>

                <label>
                  <span>Designation</span>
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="e.g. SOC Analyst II"
                  />
                </label>

                <div className="profile-form-actions">
                  <button type="submit" className="profile-btn profile-btn-primary" disabled={saving}>
                    <Save size={15} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    className="profile-btn"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    <X size={15} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-fields">
                <ProfileField icon={Mail} label="Email" value={user?.email} />
                <ProfileField icon={Phone} label="Phone" value={user?.phone || "Not added"} />
                <ProfileField
                  icon={Building2}
                  label="Department"
                  value={user?.department || "Not added"}
                />
                <ProfileField
                  icon={BadgeCheck}
                  label="Designation"
                  value={user?.designation || "Not added"}
                />
              </div>
            )}
          </div>

          {/* Session info */}
          <div className="profile-card">
            <h2>Session</h2>
            <div className="profile-fields">
              <ProfileField
                icon={ShieldCheck}
                label="Role"
                value={user?.role || "Security Analyst"}
              />
              <div className="profile-field">
                <span className="profile-field-icon">
                  <BadgeCheck size={16} />
                </span>
                <div>
                  <span className="profile-field-label">Status</span>
                  <span className="profile-field-value">
                    <span className="profile-status-dot" />
                    Active session
                  </span>
                </div>
              </div>
            </div>

            <p className="profile-note">
              Account edits are saved to the backend when it's reachable, and
              always kept locally so nothing is lost if it isn't.
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </DashboardLayout>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="profile-field">
      <span className="profile-field-icon">
        <Icon size={16} />
      </span>
      <div>
        <span className="profile-field-label">{label}</span>
        <span className="profile-field-value">{value || "—"}</span>
      </div>
    </div>
  );
}
