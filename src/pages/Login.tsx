import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { TestLink } from "../components/TestLink";
import "../assets/css/PageStyles.css";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/business-statuses");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="formContainer">
      <h1>Login</h1>
      {error && <p className="errorText">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="fieldContainer">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="inputField"
          />
        </div>
        <div className="fieldContainer">
          <label>Password</label>
          <div className="passwordWrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="inputField"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="passwordToggleButton"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="buttonPrimary">{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <TestLink href={`${import.meta.env.VITE_API_BASE_URL}/scalar/v1`} />
    </div>
  );
}
