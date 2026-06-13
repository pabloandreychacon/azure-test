import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export function CreateBusinessStatus() {
  const [formData, setFormData] = useState({
    id: "",
    idBusiness: "",
    active: true,
    businessImageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let imageUrl = formData.businessImageUrl;
      if (imageFile) {
        const uploadResponse = await api.uploadImage(imageFile);
        imageUrl = uploadResponse.url || imageUrl;
      }
      await api.createBusinessStatus({
        ...formData,
        id: formData.id ? parseInt(formData.id) : undefined,
        idBusiness: parseInt(formData.idBusiness),
        businessImageUrl: imageUrl || null,
      });
      navigate("/business-statuses");
    } catch (err) {
      setError("Failed to create business status. Please try again.");
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

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Create Business Status</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>ID (optional)</label>
          <input
            disabled
            placeholder="Auto-generated"
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Business ID</label>
          <input
            placeholder="Unique business ID"
            type="number"
            name="idBusiness"
            value={formData.idBusiness}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
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
          <label>Business Image URL (optional)</label>
          <input
            disabled
            placeholder="Auto-generated when uploading an image"
            type="text"
            name="businessImageUrl"
            value={formData.businessImageUrl}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
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
            {loading ? "Creating..." : "Create"}
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
