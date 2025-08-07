"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// Simple mock data for demo
const DESIGNATIONS = [
	{ value: "officer", label: "Officer" },
	{ value: "senior-officer", label: "Senior Officer" },
	{ value: "manager", label: "Manager" },
];

const AGENTS_BY_DESIGNATION: Record<string, { value: string; label: string }[]> = {
	officer: [
		{ value: "a_perera", label: "A. Perera" },
		{ value: "s_fernando", label: "S. Fernando" },
	],
	"senior-officer": [
		{ value: "n_silva", label: "N. Silva" },
		{ value: "k_de_alwis", label: "K. De Alwis" },
	],
	manager: [{ value: "r_jayasinghe", label: "R. Jayasinghe" }],
};

// Generate the next 7 days and mock availability slots per day
function generateDays(days = 7) {
	const out: { key: string; date: Date; label: string }[] = [];
	const now = new Date();
	for (let i = 0; i < days; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		const key = d.toISOString().slice(0, 10);
		const label = d.toLocaleDateString(undefined, {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
		out.push({ key, date: d, label });
	}
	return out;
}

function generateSlots() {
	// Example: 09:00 to 16:30 every 30 minutes
	const slots: string[] = [];
	for (let h = 9; h <= 16; h++) {
		for (const m of [0, 30]) {
			const hh = h.toString().padStart(2, "0");
			const mm = m.toString().padStart(2, "0");
			slots.push(`${hh}:${mm}`);
		}
	}
	return slots;
}

// For demo, mark some slots as unavailable
function mockAvailability(dayKey: string, agent: string) {
	const base = generateSlots();
	// Pretend different agents/days have different blocked patterns
	const blocked = new Set<string>();
	for (let i = 0; i < base.length; i++) {
		// pseudo-randomly block some based on string hash
		const seed = (dayKey.charCodeAt(0) + (agent?.charCodeAt(0) || 0) + i) % 5;
		if (seed === 0) blocked.add(base[i]);
	}
	const available = base.filter((s) => !blocked.has(s));
	return new Set(available);
}

export default function BookingPage() {
	const [form, setForm] = useState({
		designation: "",
		agent: "",
		day: "",
		slot: "",
		notes: "",
	});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const days = useMemo(() => generateDays(10), []);
	const slots = useMemo(() => generateSlots(), []);

	const agents = useMemo(() => {
		if (!form.designation) return [] as { value: string; label: string }[];
		return AGENTS_BY_DESIGNATION[form.designation] || [];
	}, [form.designation]);

	const availableSlots = useMemo(() => {
		if (!form.day || !form.agent) return new Set<string>();
		return mockAvailability(form.day, form.agent);
	}, [form.day, form.agent]);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
			...(name === "designation" ? { agent: "", slot: "" } : {}),
			...(name === "agent" ? { slot: "" } : {}),
		}));
	}

	function selectDay(dayKey: string) {
		setForm((prev) => ({ ...prev, day: dayKey, slot: "" }));
	}

	function selectSlot(slot: string) {
		if (!availableSlots.has(slot)) return;
		setForm((prev) => ({ ...prev, slot }));
	}

	function validate() {
		if (!form.designation) return "Please select an agent designation";
		if (!form.agent) return "Please select an agent";
		if (!form.day) return "Please pick a day";
		if (!form.slot) return "Please choose a time slot";
		return null;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSuccess(null);
		setError(null);

		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setSubmitting(true);
			await new Promise((res) => setTimeout(res, 800));
			setSuccess("Your booking has been requested. You will receive a confirmation email shortly.");
			setForm({ designation: "", agent: "", day: "", slot: "", notes: "" });
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="mx-auto max-w-3xl px-4 py-10">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">Book an Appointment</h1>
				<Link href="/" className="text-sm text-blue-600 hover:underline">Home</Link>
			</div>

			<p className="mb-6 text-sm text-muted-foreground">
				Select an agent designation and agent, then choose from the available time slots below.
			</p>

			{success && (
				<div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
					{success}
				</div>
			)}
			{error && (
				<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Designation */}
				<div>
					<label htmlFor="designation" className="mb-1 block text-sm font-medium">Agent Designation</label>
					<select
						id="designation"
						name="designation"
						value={form.designation}
						onChange={handleChange}
						className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
					>
						<option value="" disabled>Select a designation</option>
						{DESIGNATIONS.map((d) => (
							<option key={d.value} value={d.value}>{d.label}</option>
						))}
					</select>
				</div>

				{/* Agent */}
				<div>
					<label htmlFor="agent" className="mb-1 block text-sm font-medium">Agent Name</label>
					<select
						id="agent"
						name="agent"
						value={form.agent}
						onChange={handleChange}
						className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring disabled:opacity-60"
						disabled={!form.designation}
					>
						<option value="" disabled>
							{form.designation ? "Select an agent" : "Select a designation first"}
						</option>
						{agents.map((a) => (
							<option key={a.value} value={a.value}>{a.label}</option>
						))}
					</select>
				</div>

				{/* Day picker - horizontal chips */}
				<div>
					<div className="mb-2 text-sm font-medium">Pick a Day</div>
					<div className="flex gap-2 overflow-x-auto pb-1">
						{days.map((d) => {
							const isActive = form.day === d.key;
							return (
								<button
									type="button"
									key={d.key}
									onClick={() => selectDay(d.key)}
									className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm ${
										isActive
											? "border-blue-500 bg-blue-50 text-blue-700"
											: "border-transparent bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
									}`}
								>
									{d.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Slot grid */}
				<div>
					<div className="mb-2 text-sm font-medium">Available Slots</div>
					<div className="rounded-lg bg-neutral-50 p-3 ring-1 ring-neutral-200">
						{!form.day || !form.agent ? (
							<div className="text-sm text-neutral-500">
								Select a day and agent to view available slots.
							</div>
						) : (
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
								{slots.map((s) => {
									const isAvailable = availableSlots.has(s);
									const isActive = form.slot === s;
									return (
										<button
											key={s}
											type="button"
											disabled={!isAvailable}
											onClick={() => selectSlot(s)}
											className={`rounded-md px-3 py-2 text-sm transition ${
												!isAvailable
													? "cursor-not-allowed bg-neutral-200 text-neutral-400"
													: isActive
													? "bg-green-600 text-white"
													: "bg-green-100 text-green-800 hover:bg-green-200"
											}`}
											aria-pressed={isActive}
										>
											{s}
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Notes */}
				<div>
					<label htmlFor="notes" className="mb-1 block text-sm font-medium">Notes (optional)</label>
					<textarea
						id="notes"
						name="notes"
						value={form.notes}
						onChange={handleChange}
						rows={3}
						className="w-full resize-y rounded-md border bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
						placeholder="Add any details or questions..."
					/>
				</div>

				<div className="pt-2">
					<button
						type="submit"
						disabled={submitting}
						className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{submitting ? "Submitting..." : "Request Booking"}
					</button>
				</div>
			</form>
		</main>
	);
}
