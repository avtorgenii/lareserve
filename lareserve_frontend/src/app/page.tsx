import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-subtle">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
        R
      </div>
      <h1 className="text-2xl font-semibold text-text">LaReserve</h1>
      <div className="flex gap-4">
        <Link
          href="/reserve"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Rezerwacja (klient)
        </Link>
        <Link
          href="/staff"
          className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-text hover:bg-surface-subtle"
        >
          Widok pracownika
        </Link>
        <Link
          href="/editor"
          className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-medium text-text hover:bg-surface-subtle"
        >
          Edytor planu
        </Link>
      </div>
    </div>
  );
}
