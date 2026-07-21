import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Icône enveloppe (Formulaires, E-mails) — path exact repris du Figma
function EnvelopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32.1999 32.983L40.4486 27.8275L32.1999 23.0001L23.9511 27.8275L32.1999 32.983ZM42.1827 28.015V37.9978C42.1827 38.529 41.9796 38.9977 41.5734 39.4039C41.1985 39.8101 40.7454 40.0132 40.2143 40.0132H24.1855C23.6543 40.0132 23.1856 39.8101 22.7794 39.4039C22.4045 38.9977 22.217 38.529 22.217 37.9978V28.015C22.217 27.2339 22.5295 26.6558 23.1544 26.2809L32.1999 20.9848L41.2453 26.2809C41.8702 26.6558 42.1827 27.2339 42.1827 28.015Z"
        fill="white"
        fillOpacity="0.87"
      />
    </svg>
  );
}

// Icône personnes (Utilisateurs, Entités)
function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 20v-1a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lettre "P" (Messages, Hôtels) — telle qu'affichée sur la maquette
function LetterIcon() {
  return <span className="text-white text-sm font-semibold">P</span>;
}

// Couleurs exactes reprises du Figma (hex précis, pas d'approximation Tailwind)
// "Utilisateurs" reste figé à 600 (valeur maquette) tant que sa définition n'est pas tranchée.
// "hotels" et "emails" sont dynamiques : le backend doit renvoyer, dans /dashboard/stats/ :
//   - hotels : nombre total d'hôtels en base
//   - emails : nombre de comptes admin créés (inscriptions)
const CARDS = [
  { key: "formulaires", label: "Formulaires", color: "#A88ADD", Icon: EnvelopeIcon },
  { key: "messages", label: "Messages", color: "#0CC2AA", Icon: LetterIcon },
  { key: "utilisateurs", label: "Utilisateurs", color: "#FCC100", Icon: PeopleIcon },
  { key: "emails", label: "E-mails", color: "#F90000", Icon: EnvelopeIcon },
  { key: "hotels", label: "Hôtels", color: "#9C27B0", Icon: LetterIcon },
  { key: "entites", label: "Entités", color: "#1565C0", Icon: PeopleIcon },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats/");
        setStats(response.data);
      } catch (err) {
        setError("Impossible de charger les statistiques.");
      }
    };
    fetchStats();
  }, []);

  const filteredCards = CARDS.filter((card) =>
    card.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout onSearch={setSearchTerm}>
        {/* Barre blanche */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-2 -mx-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-4xl font-light text-gray-800">
                Bienvenue sur RED PRODUCT
              </h2>
              
        <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet consectetur</p>
      </div>
      </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {filteredCards.length === 0 ? (
        <p className="text-sm text-gray-400">
          Aucune carte ne correspond à « {searchTerm} ».
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCards.map(({ key, label, color, Icon }) => (
            <div
              key={key}
              className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
              >
                <Icon />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {key === "utilisateurs"
                    ? 600
                    : stats
                    ? stats[key]
                    : "…"}
                </p>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xs text-gray-400">Je ne sais pas quoi mettre</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}