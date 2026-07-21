import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, setLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Adresse e-mail ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">

        <p className="text-sm text-gray-600 mb-8">
          Connectez-vous en tant que Admin
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

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

          <label className="flex items-center gap-2 text-sm mb-6">

            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />

            Gardez-moi connecté

          </label>

          <button
            type="submit"
            className="w-full bg-neutral-700 hover:bg-neutral-800 text-white rounded py-3 transition cursor-pointer"
          >
            Se connecter
          </button>

        </form>

      </div>

      <Link
        to="/forgot-password"
        className="mt-5 text-yellow-400 text-sm relative z-10"
      >
        Mot de passe oublié ?
      </Link>

      <p className="mt-4 text-gray-300 text-sm text-center relative z-10">
        Vous n'avez pas de compte ?{" "}
        <Link
          to="/register"
          className="text-yellow-400 font-semibold"
        >
          S'inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}