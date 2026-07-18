import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

const CURRENCIES = [
  { value: "XOF", label: "Franc CFA (XOF)" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export default function HotelForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    price_per_night: "",
    currency: "XOF",
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}/`);
        const hotel = response.data;
        setForm({
          name: hotel.name,
          address: hotel.address,
          city: hotel.city || "",
          price_per_night: hotel.price_per_night,
          currency: hotel.currency,
        });
        setExistingImage(hotel.image);
      } catch (err) {
        setError("Impossible de charger cet hôtel.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("city", form.city);
    data.append("price_per_night", form.price_per_night);
    data.append("currency", form.currency);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEdit) {
        await api.patch(`/hotels/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/hotels/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/hotels");
    } catch (err) {
      const responseData = err.response?.data;
      let message = "Erreur lors de l'enregistrement.";
      if (responseData) {
        if (responseData.non_field_errors) {
          message = responseData.non_field_errors[0];
        } else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey && Array.isArray(responseData[firstKey])) {
            message = responseData[firstKey][0];
          }
        }
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-sm text-gray-400">Chargement...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto sm:mx-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
          {isEdit ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-4 sm:p-6 shadow-sm space-y-4"
        >
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nom de l'hôtel</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Adresse</label>
            <input
              type="text"
              name="address"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Ville</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-600"
            />
          </div>

          {/* Empilé sur mobile, côte à côte à partir de sm */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Prix par nuit</label>
              <input
                type="number"
                name="price_per_night"
                required
                min="0"
                step="0.01"
                value={form.price_per_night}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-600"
              />
            </div>

            <div className="w-full sm:w-40">
              <label className="block text-xs text-gray-600 mb-1">Devise</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-600"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Photo</label>
            {existingImage && !imageFile && (
              <img
                src={existingImage}
                alt="Actuelle"
                className="w-32 h-20 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm"
            />
            {isEdit && (
              <p className="text-xs text-gray-400 mt-1">
                Laisse vide pour garder l'image actuelle.
              </p>
            )}
          </div>

          {/* Boutons empilés sur mobile pour rester faciles à toucher */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer l'hôtel"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium px-4 py-2 rounded-md border border-gray-300 w-full sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}