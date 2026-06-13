import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { BusinessStatusModel } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function BusinessStatusList() {
  const [businessStatuses, setBusinessStatuses] = useState<BusinessStatusModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchBusinessStatuses();
  }, []);

  const fetchBusinessStatuses = async () => {
    try {
      const data = await api.getAllBusinessStatuses();
      console.log("getAllBusinessStatuses data:", data);
      setBusinessStatuses(data || []);
    } catch (error) {
      console.error("Failed to fetch business statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.deleteBusinessStatus(id);
      fetchBusinessStatuses();
    } catch (error) {
      console.error("Failed to delete business status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px", alignItems: "center" }}>
        <div>
          <span style={{ marginRight: "10px" }}>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} style={{ padding: "5px 10px" }}>
            Logout
          </button>
        </div>
        <h1>Business Statuses</h1>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/business-statuses/create" style={{ textDecoration: "none" }}>
          <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
            Create New Business Status
          </button>
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Business ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Active</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Image</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {businessStatuses.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                No business statuses found
              </td>
            </tr>
          ) : (
            businessStatuses.map((status) => (
              <tr key={status.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{status.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{status.idBusiness}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{status.active ? "Yes" : "No"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {status.businessImageUrl ? (
                    <img src={status.businessImageUrl} alt="Business" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                  ) : (
                    "No image"
                  )}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <Link to={`/business-statuses/edit/${status.id}`} style={{ marginRight: "10px" }}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(status.id)} style={{ color: "red", cursor: "pointer" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
