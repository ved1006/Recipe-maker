import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "./../App.css";
import GoogleAuth from "./GoogleAuth";
import "./Auth/auth.css";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation
  const validatePassword = (password) =>
    password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Enter a valid email address";
    if (!validatePassword(password))
      newErrors.password =
        "Password must be at least 6 characters, contain 1 number and 1 special character";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);            // ✅ update App.js state
      navigate("/dashboard");         // ✅ go inside
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "12px", textAlign: "right" }}>
        <Link to="/forgot-password" style={{ color: "#ff5722", textDecoration: "none" }}>
          Forgot Password?
        </Link>
      </p>

      <div className="divider">
        <span>or</span>
      </div>

      {/* ✅ Pass setIsLoggedIn here */}
      <GoogleAuth setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}
