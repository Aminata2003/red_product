import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, setLoading } = useAuth();

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
    <div className="min-h-screen bg-neutral-800 flex flex-col items-center justify-center px-4 py-8">

      <div className="mb-8">
        <Logo />
      </div>

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
            className="w-full border-b border-gray-300 py-3 outline-none mb-5"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 py-3 outline-none mb-5"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-3 outline-none mb-5"
          />

          <label className="flex items-start sm:items-center gap-2 text-sm mb-6">

            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-0.5 sm:mt-0 shrink-0"
            />

            Accepter les termes et la politique

          </label>

          <button
            type="submit"
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white rounded py-3 transition"
          >
            S'inscrire
          </button>

        </form>

      </div>

      <p className="mt-5 text-gray-300 text-sm text-center">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="text-yellow-400 font-semibold"
        >
          Se connecter
        </Link>
      </p>

    </div>
  );
}