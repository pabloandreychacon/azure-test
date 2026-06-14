import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/PageStyles.css";
import { useAuth } from "../contexts/AuthContext";

export function EditUser() {
  const { user, fetchFullUserProfile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user.id) {
        await fetchFullUserProfile(user.id);
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          password: user.password || ""
        }));
        setFetching(false);
      } else {
        setFetching(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateProfile(formData);
      navigate("/business-statuses");
    } catch (err) {
      setError("Failed to update user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return <div className="loadingContainer">Loading...</div>;
  }

  return (
    <div className="formContainer">
      <h1>Edit Profile</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="fieldContainer">
          <label>First Name</label>
          <input className="inputField"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fieldContainer">
          <label>Last Name</label>
          <input className="inputField"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fieldContainer">
          <label>Email</label>
          <input className="inputField"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fieldContainer">
          <label>Phone</label>
          <input className="inputField"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fieldContainer">
          <label>New Password</label>
          <div className="passwordWrapper">
            <input className="inputField"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button
              type="button"
              className="passwordToggleButton"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
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
