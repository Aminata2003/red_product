import Logo from './Logo';

/**
 * Layout partagé pour les pages d'authentification (Home, Login, Register,
 * ForgotPassword, ResetPassword) : fond sombre avec le motif de sphères/
 * hexagones en filigrane (image fournie par l'équipe design), logo centré
 * en haut, puis le contenu (carte blanche) passé en children.
 *
 * Place le fichier image (celui du motif de sphères) dans :
 *   frontend/public/images/auth-background.png
 * Le chemin ci-dessous ('/images/auth-background.png') suppose cet
 * emplacement — adapte-le si tu la ranges ailleurs.
 */
export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ backgroundColor: '#262626' }}
    >
      {/* Motif de fond, assombri par un voile pour rester lisible */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/auth-background.png')" }}
      />
      <div className="absolute inset-0 bg-neutral-800/40" />

      {/* Contenu au-dessus du fond */}
      <div className="relative z-10 mb-8">
        <Logo />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}