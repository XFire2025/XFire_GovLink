"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  designation: string;
  agent: string;
  date: string; // ISO date
  time: string; // HH:mm
  location?: string;
  status: "upcoming" | "completed" | "cancelled";
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    // First one will be "about to start" and have a red glow
    {
      id: "bk-001",
      designation: "Senior Officer",
      agent: "N. Silva",
      date: new Date().toISOString().slice(0, 10),
      time: new Date(Date.now() + 10 * 60 * 1000).toTimeString().slice(0, 5), // 10 minutes from now
      location: "GovLink Office - Counter 3",
      status: "upcoming",
    },
    {
      id: "bk-002",
      designation: "Officer",
      agent: "A. Perera",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      time: "10:30",
      location: "GovLink Office - Counter 1",
      status: "upcoming",
    },
    {
      id: "bk-003",
      designation: "Manager",
      agent: "R. Jayasinghe",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      time: "14:00",
      location: "GovLink Office - Room 2",
      status: "upcoming",
    },
  ]);

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function cancelBooking(id: string) {
    setCancellingId(id);
    // mock async cancel
    setTimeout(() => {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      setCancellingId(null);
    }, 700);
  }

  const sorted = useMemo(() => {
    // sort by date/time ascending, cancelled go last
    const toTs = (b: Booking) => new Date(`${b.date}T${b.time}:00`).getTime();
    return [...bookings].sort((a, b) => {
      if (a.status === "cancelled" && b.status !== "cancelled") return 1;
      if (b.status === "cancelled" && a.status !== "cancelled") return -1;
      return toTs(a) - toTs(b);
    });
  }, [bookings]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your Bookings</h1>
        <Link
          href="/User/Booking/New"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Booking
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-sm text-neutral-600">
          No bookings yet. Create one to get started.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((b, idx) => {
            const isFirst = idx === 0 && b.status === "upcoming";
            const cancelled = b.status === "cancelled";

            return (
              <li
                key={b.id}
                className={classNames(
                  "relative rounded-xl border p-4 shadow-sm transition",
                  "bg-white ring-1 ring-neutral-200",
                  isFirst && "shadow-[0_0_0_3px_rgba(239,68,68,0.35)] ring-red-200",
                  cancelled && "opacity-70"
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-neutral-500">{b.designation}</div>
                    <div className="text-base font-semibold">{b.agent}</div>
                  </div>
                  <span
                    className={classNames(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      b.status === "upcoming" && "bg-emerald-100 text-emerald-800",
                      b.status === "completed" && "bg-neutral-200 text-neutral-700",
                      b.status === "cancelled" && "bg-red-100 text-red-700"
                    )}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mb-2 text-sm text-neutral-700">
                  <span className="font-medium">Date:</span> {b.date}
                  <span className="mx-2">•</span>
                  <span className="font-medium">Time:</span> {b.time}
                </div>
                {b.location && (
                  <div className="mb-4 text-sm text-neutral-600">
                    <span className="font-medium">Location:</span> {b.location}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">ID: {b.id}</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelBooking(b.id)}
                      disabled={cancelled || cancellingId === b.id}
                      className={classNames(
                        "rounded-md px-3 py-1.5 text-sm text-white",
                        cancelled
                          ? "bg-neutral-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700",
                        cancellingId === b.id && "opacity-70"
                      )}
                    >
                      {cancelled ? "Cancelled" : cancellingId === b.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                </div>

                {isFirst && (
                  <div className="pointer-events-none absolute -inset-0.5 rounded-xl ring-2 ring-red-300/60" aria-hidden />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}