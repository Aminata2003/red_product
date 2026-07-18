import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

const CURRENCIES = [
  { value: "XOF", label: "F XOF" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

// Icône flèche retour
function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Icône image (zone d'ajout de photo)
function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HotelForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    price_per_night: "",
    currency: "XOF",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
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
          email: hotel.email || "",
          phone: hotel.phone || "",
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

  const applyImageFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    applyImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("email", form.email);
    data.append("phone", form.phone);
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

  const photoToShow = imagePreview || existingImage;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto sm:mx-0">
        {/* En-tête avec flèche retour, comme sur la maquette */}
        <button
          onClick={() => navigate("/hotels")}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 uppercase mb-6 hover:text-gray-900"
        >
          <BackArrowIcon />
          {isEdit ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
        </button>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
        >
          {/* Grille 2 colonnes sur desktop, empilée sur mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nom de l'hôtel</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Adresse</label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="information@gmail.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+221 77 777 77 77"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Prix par nuit</label>
              <input
                type="number"
                name="price_per_night"
                required
                min="0"
                step="0.01"
                value={form.price_per_night}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Devise</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone photo drag & drop, comme sur la maquette */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Ajouter une photo</label>
            <label
              htmlFor="hotel-photo-input"
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg h-40 sm:h-44 cursor-pointer text-gray-400 transition-colors ${
                dragActive ? "border-gray-500 bg-gray-50" : "border-gray-300"
              }`}
            >
              {photoToShow ? (
                <img
                  src={photoToShow}
                  alt="Aperçu"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <ImageIcon />
                  <span className="text-xs sm:text-sm">Ajouter une photo</span>
                </>
              )}
              <input
                id="hotel-photo-input"
                type="file"
                accept="image/*"
                onChange={(e) => applyImageFile(e.target.files[0])}
                className="hidden"
              />
            </label>
            {isEdit && (
              <p className="text-xs text-gray-400 mt-1">
                Laisse vide pour garder l'image actuelle.
              </p>
            )}
          </div>

          {/* Bouton unique aligné à droite, comme sur la maquette */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-medium px-6 py-2.5 rounded-md disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}