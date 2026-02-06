import Link from 'next/link';

// Root-level not-found page - outside [locale] segment
// Uses static English text as fallback since i18n context is unavailable
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface">
      <h2 className="text-4xl font-display mb-4">Page Not Found</h2>
      <p className="mb-6 font-body text-body-large">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
