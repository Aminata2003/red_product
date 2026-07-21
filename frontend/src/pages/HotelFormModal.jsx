import { useEffect, useState } from "react";
import api from "../api/axios";

const CURRENCIES = [
  { value: "XOF", label: "F XOF" },
  { value: "USD", label: "Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Modale de création/modification d'hôtel.
 * hotelId = null -> mode création. hotelId défini -> mode édition (charge l'hôtel).
 * onClose : ferme la modale sans forcément avoir sauvegardé.
 * onSaved : appelé après un enregistrement réussi (la liste parente peut se rafraîchir).
 */
export default function HotelFormModal({ hotelId, onClose, onSaved }) {
  const isEdit = Boolean(hotelId);

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
        const response = await api.get(`/api/hotels/${hotelId}/`);
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
  }, [hotelId, isEdit]);

  // Empêche le scroll de la page derrière la modale pendant qu'elle est ouverte
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // N'autorise que les chiffres, espaces et un "+" initial pour le numéro de téléphone
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d+\s]/g, "");
    setForm({ ...form, phone: cleaned });
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

    // Validation stricte du téléphone avant envoi (au cas où un collage aurait
    // contourné le filtrage de la saisie)
    if (form.phone && !/^[\d+\s]*$/.test(form.phone)) {
      setError("Le numéro de téléphone ne doit contenir que des chiffres.");
      return;
    }

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
        await api.patch(`/api/hotels/${hotelId}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/hotels/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSaved?.();
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

  const photoToShow = imagePreview || existingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay sombre derrière la modale */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Contenu de la modale */}
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-lg sm:max-w-3xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex items-center justify-between px-4 sm:px-6 py-4 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-gray-700 uppercase hover:text-gray-900 cursor-pointer"
          >
            <BackArrowIcon />
            {isEdit ? "Modifier l'hôtel" : "Créer un nouvel hôtel"}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <p className="text-sm text-gray-400">Chargement...</p>
          ) : (
            <>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <form onSubmit={handleSubmit}>
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
                      onChange={handlePhoneChange}
                      inputMode="numeric"
                      pattern="[\d+\s]*"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

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

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-medium px-6 py-2.5 rounded-md disabled:opacity-50 w-full sm:w-auto cursor-pointer"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}