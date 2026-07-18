import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hotels/");
      setHotels(response.data);
    } catch (err) {
      setError("Impossible de charger la liste des hôtels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet hôtel définitivement ?")) return;

    try {
      await api.delete(`/hotels/${id}/`);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  // Filtre sur le nom et l'adresse, insensible à la casse et aux accents
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredHotels = hotels.filter((hotel) => {
    const term = normalize(searchTerm);
    if (!term) return true;
    return (
      normalize(hotel.name).includes(term) ||
      normalize(hotel.address).includes(term)
    );
  });

  return (
    <Layout onSearch={setSearchTerm}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Hôtels</h2>
          <p className="text-sm text-gray-400">{hotels.length}</p>
        </div>
        <button
          onClick={() => navigate("/hotels/new")}
          className="bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium px-4 py-2 rounded-md border border-gray-300 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span className="text-lg leading-none">+</span> Créer un nouvel hôtel
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Chargement...</p>
      ) : hotels.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun hôtel pour le moment.</p>
      ) : filteredHotels.length === 0 ? (
        <p className="text-sm text-gray-400">
          Aucun hôtel ne correspond à « {searchTerm} ».
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Pas d'image
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Couleur exacte de la maquette pour l'adresse */}
                <p className="text-xs font-medium" style={{ color: "#8D4B38" }}>
                  {hotel.address}
                </p>
                <p className="font-semibold text-gray-900 text-base mt-1">
                  {hotel.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {hotel.price_per_night} {hotel.currency} par nuit
                </p>

                <div className="flex gap-3 mt-3 text-xs">
                  <Link
                    to={`/hotels/${hotel.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}