import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { BusinessStatusModel } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { TestLink } from "../components/TestLink";
import "../assets/css/PageStyles.css";

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

  const handleDelete = async (id: number) => {
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
    return <div className="loadingContainer">Loading...</div>;
  }

  return (
    <div className="pageWrapper">
      <div className="headerFlex">
        <div className="inlineFlex">
          <TestLink href={`${import.meta.env.VITE_API_BASE_URL}/scalar/v1`} />
          <span className="marginRight10">Welcome, {user?.firstName} {user?.lastName}!</span>
          <Link to="/profile">
            <button className="smallButton">
              Profile
            </button>
          </Link>
          <button onClick={handleLogout} className="smallButton">
            Logout
          </button>
        </div>
        <h1>Business Statuses</h1>
      </div>
      <div className="marginBottom20">
        <Link to="/business-statuses/create" className="linkNoDeco">
          <button className="buttonPrimary">
            Create New Business Status
          </button>
        </Link>
      </div>
      <table className="tableFull">
        <thead>
          <tr>
            <th className="tableHeaderCell">ID</th>
            <th className="tableHeaderCell">Business ID</th>
            <th className="tableHeaderCell">Active</th>
            <th className="tableHeaderCell">Image</th>
            <th className="tableHeaderCell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {businessStatuses.length === 0 ? (
            <tr>
              <td colSpan={5} className="centerCell">
                No business statuses found
              </td>
            </tr>
          ) : (
            businessStatuses.map((status) => (
              <tr key={status.id}>
                <td className="tableCell">{status.id}</td>
                <td className="tableCell">{status.idBusiness}</td>
                <td className="tableCell">{status.active ? "Yes" : "No"}</td>
                <td className="tableCell">
                  {status.businessImageUrl ? (
                    <img src={status.businessImageUrl} alt="Business" className="thumbnailImg" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="tableCell">
                  <Link to={`/business-statuses/edit/${status.id}`} className="actionLink">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(status.id as number)} className="deleteBtn">
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
