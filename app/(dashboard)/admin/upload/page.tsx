// app/(dashboard)/admin/upload/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage({
        type: "success",
        text: `Successfully uploaded ${data.count} orders.`,
      });

      // Refresh tracking page data
      router.refresh();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-ink tracking-tight">
          Upload Excel
        </h1>
        <p className="text-sm text-muted mt-1">
          This will replace all of today’s orders (full replace).
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-5">
        <div className="border border-border rounded-xl bg-white p-6 shadow-soft">
          <label className="block text-sm text-muted mb-2">
            Excel file (.xlsx)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface file:text-ink hover:file:bg-surface-dark"
          />
        </div>

        {message && (
          <div
            className={`text-sm px-4 py-3 rounded-lg border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                : "bg-red-50 text-red-800 border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="px-5 py-2.5 bg-ink text-ivory rounded-lg text-sm font-medium hover:bg-[#2A2927] disabled:opacity-50 transition-colors"
        >
          {loading ? "Uploading…" : "Upload & Replace"}
        </button>
      </form>
    </div>
  );
}
