import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password/", { email });
      setMessage(response.data.detail);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Une erreur est survenue, réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white w-full max-w-sm rounded-md shadow-lg p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-6">
          Mot de passe oublié?
        </h2>

        <p className="text-xs text-gray-500 leading-5 mb-6">
          Entrez votre adresse e-mail ci-dessous et nous vous enverrons des
          instructions sur la façon de modifier votre mot de passe.
        </p>

        {message && (
          <p className="text-green-600 text-xs mb-4">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-xs mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs text-gray-600 mb-2">
            Votre e-mail
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-gray-600 outline-none py-2 mb-6 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white py-2.5 rounded transition font-medium disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-gray-300 text-center relative z-10">
        Revenir à la{" "}
        <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
          connexion
        </Link>
      </p>
    </AuthLayout>
  );
}