import Link from 'next/link';

// Root-level not-found page - outside [locale] segment
// Uses static English text as fallback since i18n context is unavailable
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface-variant flex items-center justify-center">
          <span className="material-symbols-rounded text-6xl text-on-surface-variant">
            explore_off
          </span>
        </div>
        <h2 className="text-display-small font-display mb-4 text-on-surface">404</h2>
        <p className="text-headline-small font-display mb-2 text-on-surface">Page Not Found</p>
        <p className="mb-8 font-body text-body-large text-on-surface-variant">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-all shadow-elevation-1 hover:shadow-elevation-2"
        >
          <span className="material-symbols-rounded text-xl">home</span>
          Return Home
        </Link>
      </div>
    </div>
  );
}
