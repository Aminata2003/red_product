import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, setLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accept) {
      setError("Veuillez accepter les termes et la politique.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register(username, email, password);

      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      let message = "Erreur lors de l'inscription.";

      if (data) {
        if (data.detail) {
          message = data.detail;
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            message = data[firstKey][0];
          } else if (firstKey && typeof data[firstKey] === "string") {
            message = data[firstKey];
          }
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">

        <p className="text-sm text-gray-600 mb-8">
          Inscrivez-vous en tant que Admin
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Nom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full border-b border-gray-300 py-3 outline-none mb-5 disabled:opacity-60"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full border-b border-gray-300 py-3 outline-none mb-5 disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full border-b border-gray-300 py-3 outline-none mb-5 disabled:opacity-60"
          />

          <label className="flex items-start sm:items-center gap-2 text-sm mb-6">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              disabled={loading}
              className="mt-0.5 sm:mt-0 shrink-0"
            />
            Accepter les termes et la politique
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white rounded py-3 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <SpinnerIcon />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>

        </form>

      </div>

      <p className="mt-5 text-gray-300 text-sm text-center relative z-10">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="text-yellow-400 font-semibold"
        >
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}