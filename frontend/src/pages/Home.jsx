import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-8">
     <Logo />
   </div>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 w-full max-w-md text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Bienvenue sur RED PRODUCT
        </h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Gérez vos hôtels facilement, en toute simplicité.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="bg-neutral-800 text-white rounded py-2.5 font-medium hover:bg-neutral-700 transition"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            className="border border-neutral-800 text-neutral-800 rounded py-2.5 font-medium hover:bg-gray-100 transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}