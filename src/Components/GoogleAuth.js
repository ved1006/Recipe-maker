// src/Components/GoogleAuth.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function GoogleAuth({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setIsLoggedIn(true);   // ✅ mark logged in
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: "12px 20px",
        backgroundColor: "#DB4437",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "15px",
      }}
    >
      Continue with Google
    </button>
  );
}
