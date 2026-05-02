import Link from 'next/link';

type AppLayoutProps = {
  children: React.ReactNode;
  activeNav?: 'reservations';
  rightSlot?: React.ReactNode;
};

export default function AppLayout({
  children,
  activeNav = 'reservations',
  rightSlot,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 items-center border-b border-border bg-white px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold text-text">Restauracja</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 justify-center">
          <Link
            href="/reserve"
            className={`relative px-4 py-4 text-sm font-medium transition-colors ${
              activeNav === 'reservations'
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Rezerwacje
          </Link>
        </nav>

        {/* Right slot */}
        <div className="text-sm text-text-muted">{rightSlot}</div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
