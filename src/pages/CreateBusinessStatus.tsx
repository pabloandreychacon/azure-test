import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../assets/css/PageStyles.css";

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

  const handleSubmit = async (e: React.SubmitEvent) => {
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
    <div className="formContainer">
      <h1>Create Business Status</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="fieldContainer">
          <label>ID (optional)</label>
          <input
            disabled
            placeholder="Auto-generated"
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="inputField"
          />
        </div>
        <div className="fieldContainer">
          <label>Business ID</label>
          <input
            placeholder="Unique business ID"
            type="number"
            name="idBusiness"
            value={formData.idBusiness}
            onChange={handleChange}
            required
            className="inputField"
          />
        </div>
        <div className="fieldContainer">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="checkbox"
            />
            Active
          </label>
        </div>
        <div className="marginBottom10">
          <label>Business Image URL (optional)</label>
          <input
            disabled
            placeholder="Auto-generated when uploading an image"
            type="text"
            name="businessImageUrl"
            value={formData.businessImageUrl}
            onChange={handleChange}
            className="inputField disabledInput"
          />
        </div>
        <div className="marginBottom10">
          <label>Or upload an image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="uploadInput"
          />
        </div>
        <div className="buttonGroup">
          <button
            type="submit"
            disabled={loading}
            className="buttonPrimary"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/business-statuses")}
            className="buttonSecondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
