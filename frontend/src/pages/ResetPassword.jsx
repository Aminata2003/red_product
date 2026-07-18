import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import api from "../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/reset-password/", {
        uid,
        token,
        new_password: password,
      });
      setMessage(response.data.detail);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Une erreur est survenue, réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="bg-white w-full max-w-sm rounded-md shadow-lg p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-6">
          Nouveau mot de passe
        </h2>

        <p className="text-xs text-gray-500 leading-5 mb-6">
          Choisissez un nouveau mot de passe pour votre compte (8 caractères
          minimum).
        </p>

        {message && <p className="text-green-600 text-xs mb-4">{message}</p>}
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <label className="block text-xs text-gray-600 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-gray-600 outline-none py-2 mb-5 text-sm"
            />

            <label className="block text-xs text-gray-600 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-gray-600 outline-none py-2 mb-6 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-700 hover:bg-neutral-800 text-white py-2.5 rounded transition font-medium disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-300 text-center">
        Revenir à la{" "}
        <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
          connexion
        </Link>
      </p>
    </div>
  );
}