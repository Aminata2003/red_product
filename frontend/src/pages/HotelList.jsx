import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import HotelFormModal from "./HotelFormModal";
import api from "../api/axios";

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // undefined = fermé
  // null = création
  // id = édition
  const [modalHotelId, setModalHotelId] = useState(undefined);

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
      setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleModalSaved = () => {
    setModalHotelId(undefined);
    fetchHotels();
  };

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
      <div className="flex flex-col h-full">
        {/* Barre blanche */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-2 -mx-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-4xl font-light text-gray-800">
                Hôtels
              </h2>

              <span className="text-3xl font-light text-gray-300">
                {hotels.length}
              </span>
            </div>

            <button
              onClick={() => setModalHotelId(null)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-base font-medium hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
            >
              <span className="text-2xl leading-none">+</span>
              Créer un nouvel hôtel
            </button>
          </div>
        </div>

        {/* Zone scrollable */}
        <div className="flex-1 overflow-y-auto pb-8">
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-sm text-gray-400">
              Chargement...
            </p>
          ) : hotels.length === 0 ? (
            <p className="text-sm text-gray-400">
              Aucun hôtel pour le moment.
            </p>
          ) : filteredHotels.length === 0 ? (
            <p className="text-sm text-gray-400">
              Aucun hôtel ne correspond à "{searchTerm}".
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="h-28 bg-gray-200">
                    {hotel.image ? (
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Pas d'image
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <p
                      className="text-sm truncate"
                      style={{ color: "#8D4B38" }}
                    >
                      {hotel.address}
                    </p>

                   <h3 className="text-lg font-semibold mt-1 truncate">
                      {hotel.name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {hotel.price_per_night} {hotel.currency} par nuit
                    </p>

                    <div className="flex gap-4 mt-5">
                      <button
                        onClick={() => setModalHotelId(hotel.id)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {modalHotelId !== undefined && (
          <HotelFormModal
            hotelId={modalHotelId}
            onClose={() => setModalHotelId(undefined)}
            onSaved={handleModalSaved}
          />
        )}
      </div>
    </Layout>
  );
}