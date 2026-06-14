import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BusinessStatusModel } from "../types";
import { api } from "../services/api";
import "../assets/css/PageStyles.css";

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
    return <div className="loadingContainer">Loading...</div>;
  }

  return (
    <div className="formContainer">
      <h1>Edit Business Status</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="fieldContainer">
          <label>ID</label>
          <input
            type="number"
            name="id"
            value={formData.id || ""}
            disabled
            className="inputField disabledInput"
          />
        </div>
        <div className="fieldContainer">
          <label>Business ID</label>
          <input
            type="number"
            name="idBusiness"
            value={formData.idBusiness}
            disabled
            className="inputField disabledInput"
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
        <div className="fieldContainer">
          <label>Business Image URL</label>
          <input
            type="text"
            name="businessImageUrl"
            value={formData.businessImageUrl || ""}
            disabled
            className="inputField disabledInput"
          />
        </div>
        {formData.businessImageUrl && (
          <div className="fieldContainer">
            <img src={formData.businessImageUrl} alt="Current" className="thumbnailImg" />
          </div>
        )}
        <div className="fieldContainer">
          <label>Or upload an image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="uploadInput"
          />
        </div>
        <div className="buttonGroup">
          <button type="submit" disabled={loading} className="buttonPrimary">
            {loading ? "Updating..." : "Update"}
          </button>
          <button type="button" onClick={() => navigate("/business-statuses")} className="buttonSecondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
