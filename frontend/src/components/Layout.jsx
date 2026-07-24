import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Logo from './Logo';

// Icône Dashboard (issue du Figma)
function DashboardIcon({ active }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_28244_2)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.1335 0C13.6887 0 13.2622 0.176692 12.9477 0.491206C12.6331 0.80572 12.4565 1.23229 12.4565 1.67708V5.98958C12.4565 6.91533 13.2078 7.66667 14.1335 7.66667H21.321C21.7658 7.66667 22.1924 7.48997 22.5069 7.17546C22.8214 6.86095 22.9981 6.43437 22.9981 5.98958V1.67708C22.9981 1.23229 22.8214 0.80572 22.5069 0.491206C22.1924 0.176692 21.7658 0 21.321 0L14.1335 0ZM14.1335 9.58333C13.6887 9.58333 13.2622 9.76003 12.9477 10.0745C12.6331 10.3891 12.4565 10.8156 12.4565 11.2604V21.3229C12.4565 22.2496 13.2078 23 14.1335 23H21.321C21.7658 23 22.1924 22.8233 22.5069 22.5088C22.8214 22.1943 22.9981 21.7677 22.9981 21.3229V11.2604C22.9981 10.8156 22.8214 10.3891 22.5069 10.0745C22.1924 9.76003 21.7658 9.58333 21.321 9.58333H14.1335ZM0.00195312 1.67708C0.00195312 0.751333 0.752328 0 1.67904 0H8.86654C9.79229 0 10.5436 0.751333 10.5436 1.67708V11.7396C10.5436 12.1844 10.3669 12.6109 10.0524 12.9255C9.7379 13.24 9.31133 13.4167 8.86654 13.4167H1.67904C1.23425 13.4167 0.807674 13.24 0.493159 12.9255C0.178645 12.6109 0.00195313 12.1844 0.00195312 11.7396V1.67708ZM1.67904 15.3333C1.23425 15.3333 0.807674 15.51 0.493159 15.8245C0.178645 16.1391 0.00195312 16.5656 0.00195312 17.0104V21.3229C0.00195312 22.2487 0.752328 23 1.67904 23H8.86654C9.31133 23 9.7379 22.8233 10.0524 22.5088C10.3669 22.1943 10.5436 21.7677 10.5436 21.3229V17.0104C10.5436 16.5656 10.3669 16.1391 10.0524 15.8245C9.7379 15.51 9.31133 15.3333 8.86654 15.3333H1.67904Z"
          fill={active ? '#1A1D1F' : '#FFFFFF'}
        />
      </g>
      <defs>
        <clipPath id="clip0_28244_2">
          <rect width="23" height="23" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Icône Liste des hôtels (issue du Figma)
function HotelsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 0C1.83745 0.00158443 1.20248 0.265485 0.733983 0.733983C0.265485 1.20248 0.00158443 1.83745 0 2.5V13.7C0 15.076 1.124 16.2 2.5 16.2H8.955C8.47237 15.6604 8.15623 14.9927 8.04474 14.2774C7.93325 13.5621 8.03118 12.8299 8.32671 12.169C8.62224 11.5082 9.10273 10.947 9.71018 10.5532C10.3176 10.1594 11.0261 9.94991 11.75 9.94991C12.4739 9.94991 13.1824 10.1594 13.7898 10.5532C14.3973 10.947 14.8778 11.5082 15.1733 12.169C15.4688 12.8299 15.5668 13.5621 15.4553 14.2774C15.3438 14.9927 15.0276 15.6604 14.545 16.2H21C22.376 16.2 23.5 15.076 23.5 13.7V2.5C23.5 1.124 22.376 0 21 0H2.5ZM3.75 3.125C3.58424 3.125 3.42527 3.19085 3.30806 3.30806C3.19085 3.42527 3.125 3.58424 3.125 3.75C3.125 3.91576 3.19085 4.07473 3.30806 4.19194C3.42527 4.30915 3.58424 4.375 3.75 4.375H11.75C11.9158 4.375 12.0747 4.30915 12.1919 4.19194C12.3092 4.07473 12.375 3.91576 12.375 3.75C12.375 3.58424 12.3092 3.42527 12.1919 3.30806C12.0747 3.19085 11.9158 3.125 11.75 3.125H3.75ZM18.125 3.75C18.125 3.405 18.405 3.125 18.75 3.125H20.25C20.4158 3.125 20.5747 3.19085 20.6919 3.30806C20.8092 3.42527 20.875 3.58424 20.875 3.75C20.875 3.91576 20.8092 4.07473 20.6919 4.19194C20.5747 4.30915 20.4158 4.375 20.25 4.375H18.75C18.5842 4.375 18.4253 4.30915 18.3081 4.19194C18.1908 4.07473 18.125 3.91576 18.125 3.75ZM18.75 6.125C18.5842 6.125 18.4253 6.19085 18.3081 6.30806C18.1908 6.42527 18.125 6.58424 18.125 6.75C18.125 6.91576 18.1908 7.07473 18.3081 7.19194C18.4253 7.30915 18.5842 7.375 18.75 7.375H20.25C20.4158 7.375 20.5747 7.30915 20.6919 7.19194C20.8092 7.07473 20.875 6.91576 20.875 6.75C20.875 6.58424 20.8092 6.42527 20.6919 6.30806C20.5747 6.19085 20.4158 6.125 20.25 6.125H18.75ZM9.25 13.7C9.25013 13.2493 9.37209 12.807 9.60298 12.42C9.83387 12.0329 10.1651 11.7155 10.5616 11.5012C10.9581 11.287 11.4052 11.1839 11.8555 11.2029C12.3058 11.222 12.7426 11.3623 13.1196 11.6093C13.4966 11.8562 13.7999 12.2004 13.9974 12.6056C14.1948 13.0107 14.279 13.4617 14.2412 13.9108C14.2033 14.3599 14.0447 14.7904 13.7822 15.1568C13.5197 15.5231 13.1631 15.8117 12.75 15.992V19.3H10.75V15.992C10.3041 15.7974 9.9246 15.4768 9.65815 15.0697C9.39171 14.6626 9.24986 14.1866 9.25 13.7ZM7.25 20.55C6.35 20.55 5.65 21.15 5.35 21.95L4.97 23.092C4.94498 23.1671 4.93816 23.2471 4.9501 23.3254C4.96204 23.4037 4.9924 23.478 5.03868 23.5422C5.08497 23.6065 5.14585 23.6588 5.21631 23.695C5.28678 23.7311 5.36482 23.7499 5.444 23.75H18.056C18.1353 23.7501 18.2134 23.7313 18.284 23.6953C18.3546 23.6592 18.4156 23.6069 18.462 23.5427C18.5084 23.4784 18.5389 23.404 18.5509 23.3256C18.5629 23.2473 18.556 23.1672 18.531 23.092L18.15 21.95C17.95 21.15 17.15 20.55 16.25 20.55H7.25Z"
        fill={active ? '#1A1D1F' : '#4C5053'}
      />
    </svg>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
          aria-label="Fermer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-[#262626] mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

const ACTIVITY_LAST_SEEN_KEY = 'hotel_activity_last_seen';

export default function Layout({ children, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // --- Notifications : activité réelle des autres admins sur les hôtels ---
  const [activities, setActivities] = useState([]);
  const [notifBadge, setNotifBadge] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  const fetchActivity = async (since) => {
    const params = since ? { since } : {};
    const res = await api.get('/api/hotels/activity/', { params });
    return res.data;
  };

  // Au chargement du layout : juste le badge, sans marquer comme "vu"
  useEffect(() => {
    const lastSeen = localStorage.getItem(ACTIVITY_LAST_SEEN_KEY);
    fetchActivity(lastSeen || undefined)
      .then((data) => setNotifBadge(data.count_new || 0))
      .catch((err) => console.error('Erreur badge notifications :', err));
  }, []);

  const openNotifModal = async () => {
    setNotifOpen(true);
    setNotifLoading(true);
    try {
      const lastSeen = localStorage.getItem(ACTIVITY_LAST_SEEN_KEY);
      const data = await fetchActivity(lastSeen || undefined);
      setActivities(data.results || []);
    } catch (err) {
      console.error('Erreur notifications :', err);
      setActivities([]);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleMarkAllRead = () => {
    localStorage.setItem(ACTIVITY_LAST_SEEN_KEY, new Date().toISOString());
    setNotifBadge(0);
  };

  // --- Profil éditable (nom + avatar) ---
  const fileInputRef = useRef(null);
  const [editName, setEditName] = useState(user?.username || '');
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  const openProfileModal = async () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setSaveError('');
    setProfileOpen(true);
    setLoadingProfile(true);
    try {
      const res = await api.get('/api/auth/me/');
      setEditName(res.data.username || '');
      setCurrentAvatar(res.data.avatar || null);
    } catch (err) {
      console.error('Erreur chargement profil :', err);
      setEditName(user?.username || '');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const formData = new FormData();
      formData.append('username', editName);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }
      const res = await api.patch('/api/auth/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data);
      setCurrentAvatar(res.data.avatar || null);
      setProfileOpen(false);
    } catch (err) {
      console.error('Erreur mise à jour profil :', err);
      setSaveError("La mise à jour a échoué. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (!confirmLogout) return;
    logout();
    navigate('/login');
  };

  const handleNavClick = () => setSidebarOpen(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { path: '/hotels', label: 'Liste des hôtels', Icon: HotelsIcon },
  ];

  const avatarUrl =
    previewUrl ||
    currentAvatar ||
    user?.avatarUrl ||
    user?.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=F1DCC6&color=4C5053`;

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[240px] text-white flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out overflow-hidden
        md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#262626' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/auth-background.png')" }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: '#494C4F', mixBlendMode: 'multiply' }}
        />
        <div className="absolute inset-0 bg-neutral-800/40 pointer-events-none" />

        <div className="relative z-10">
          <div className="px-7 pt-5 pb-8 flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-100 hover:text-white cursor-pointer"
              aria-label="Fermer le menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="px-6 text-xs text-gray-400 uppercase mb-2">Principal</div>
          <nav className="flex flex-col">
            {navItems.map(({ path, label, Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={handleNavClick}
                  className={`flex items-center gap-5 h-[38px] px-7 text-[17px] cursor-pointer ${
                    active
                      ? 'bg-white text-neutral-900 font-medium'
                      : 'text-gray-300 hover:bg-neutral-700'
                  }`}
                >
                  <Icon active={active} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 p-4 flex items-center gap-3 border-t border-neutral-700">
          <img
            src={avatarUrl}
            alt={user?.username || 'Utilisateur'}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> en ligne
            </p>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[74px] bg-white border-b border-[#ECECEC] flex items-center justify-between px-4 sm:px-8 gap-2">

          {/* Gauche */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 shrink-0 cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <h1 className="text-[17px] sm:text-[22px] font-semibold text-[#262626] truncate">
              {navItems.find((i) => i.path === location.pathname)?.label || 'RED PRODUCT'}
            </h1>
          </div>

          {/* Droite */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-7 shrink-0">

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Recherche"
              className="
                hidden sm:block
                w-[160px] md:w-[285px]
                h-[36px]
                rounded-full
                border
                border-[#E6E6E6]
                px-5
                text-[15px]
                outline-none
              "
            />

            {/* Notification -> ouvre une modale avec l'activité réelle des autres admins */}
            <button
              onClick={openNotifModal}
              className="relative w-6 h-6 flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {notifBadge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {notifBadge > 9 ? '9+' : notifBadge}
                </span>
              )}
            </button>

            {/* Avatar -> ouvre la modale profil */}
            <button onClick={openProfileModal} className="shrink-0 cursor-pointer" aria-label="Profil">
              <img
                src={avatarUrl}
                alt={user?.username || 'Utilisateur'}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            </button>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="text-gray-500 hover:text-gray-800 cursor-pointer shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 bg-[#F4F4F4] px-4 sm:px-8 pt-0 pb-8 overflow-y-auto">{children}</main>
      </div>

      {/* Modale Notifications */}
<Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications">
  <div className="flex items-center justify-between mb-3">
    <p className="text-sm text-gray-600">Bienvenue, {user?.username} 👋</p>
    {notifBadge > 0 && (
      <button
        onClick={handleMarkAllRead}
        className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline cursor-pointer shrink-0"
      >
        Tout marquer comme lu
      </button>
    )}
  </div>

  {notifLoading ? (
    <p className="text-sm text-gray-400">Chargement...</p>
  ) : activities.length === 0 ? (
    <p className="text-sm text-gray-500">Aucune activité récente sur les hôtels.</p>
  ) : (
    <ul className="space-y-2 max-h-64 overflow-y-auto">
      {activities.map((a) => (
        <li key={a.id} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
          {a.message}
        </li>
      ))}
    </ul>
  )}
</Modal>

      {/* Modale Profil - éditable */}
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Mon profil">
        {loadingProfile ? (
          <p className="text-sm text-gray-400 text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user?.username || 'Utilisateur'}
                className="w-16 h-16 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
                aria-label="Changer la photo"
                type="button"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="w-full text-left text-sm mt-2 space-y-3">
              <div>
                <label className="block text-gray-500 mb-1">Nom</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <p className="text-gray-500">
                <span className="font-medium text-gray-800">Email :</span> {user?.email || '—'}
              </p>
            </div>

            {saveError && <p className="text-xs text-red-500">{saveError}</p>}

            <button
              onClick={handleProfileSave}
              disabled={saving}
              className="w-full bg-[#262626] text-white rounded-lg py-2 text-sm font-medium mt-2 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}