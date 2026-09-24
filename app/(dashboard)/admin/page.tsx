// app/(dashboard)/admin/page.tsx

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-ink tracking-tight">Admin</h1>
        <p className="text-sm text-muted mt-1">
          Configuration and daily operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/upload"
          className="block p-5 bg-white border border-border rounded-xl shadow-soft hover:border-border-strong transition-colors"
        >
          <h2 className="font-medium text-ink">Upload Excel</h2>
          <p className="text-sm text-muted mt-1">
            Daily full replace of today’s orders
          </p>
        </Link>

        <div className="p-5 bg-white border border-border rounded-xl shadow-soft opacity-60">
          <h2 className="font-medium text-ink">Trackers</h2>
          <p className="text-sm text-muted mt-1">Coming next</p>
        </div>

        <div className="p-5 bg-white border border-border rounded-xl shadow-soft opacity-60">
          <h2 className="font-medium text-ink">Rootcauses</h2>
          <p className="text-sm text-muted mt-1">Coming next</p>
        </div>
      </div>
    </div>
  );
}
