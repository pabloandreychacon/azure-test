import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { BusinessStatusModel } from "../types";

export function EditBusinessStatus() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<BusinessStatusModel>({
    id: Number(id || 0),
    idBusiness: Number(id || 0),
    active: true,
    businessImageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBusinessStatus();
    }
  }, [id]);

  const fetchBusinessStatus = async () => {
    try {
      const data = await api.getBusinessStatusById(id!);
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Failed to fetch business status:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let imageUrl = formData.businessImageUrl;

      if (imageFile) {
        const updateResponse = await api.updateImage(Number(formData.id), imageFile!);
        imageUrl = updateResponse.businessImageUrl || imageUrl;
      }

      /* await api.updateBusinessStatus(formData.id!, {
        ...formData,
        businessImageUrl: imageUrl || null,
      }); */
      navigate("/business-statuses");
    } catch (err) {
      setError("Failed to update business status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  if (fetching) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Edit Business Status</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>ID</label>
          <input
            type="number"
            name="id"
            value={formData.id || ""}
            disabled
            style={{ width: "100%", padding: "8px", marginTop: "4px", backgroundColor: "#e9ecef" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Business ID</label>
          <input
            type="number"
            name="idBusiness"
            value={formData.idBusiness}
            disabled
            style={{ width: "100%", padding: "8px", marginTop: "4px", backgroundColor: "#e9ecef" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              style={{ marginRight: "8px" }}
            />
            Active
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Business Image URL</label>
          <input
            type="text"
            name="businessImageUrl"
            value={formData.businessImageUrl || ""}
            disabled
            style={{ width: "100%", padding: "8px", marginTop: "4px", backgroundColor: "#e9ecef" }}
          />
        </div>
        {formData.businessImageUrl && (
          <div style={{ marginBottom: "10px" }}>
            <img
              src={formData.businessImageUrl}
              alt="Current"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Or upload an image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", marginTop: "4px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/business-statuses")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
