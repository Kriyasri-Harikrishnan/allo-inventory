type Stats = {
	totalReservations: number
	pendingReservations: number
	confirmedReservations: number
	releasedReservations: number
	expiredPending: number
	totalStockUnits: number
	totalReservedUnits: number
	totalAvailableUnits: number
	revenueConfirmed: number
}

type Props = { stats: Stats }

export default function StatsBar({ stats }: Props) {
	const cards = [
		{ label: "Total Reservations", value: stats.totalReservations, color: "text-zinc-900" },
		{ label: "Pending", value: stats.pendingReservations, color: "text-amber-600" },
		{ label: "Confirmed", value: stats.confirmedReservations, color: "text-green-600" },
		{ label: "Released", value: stats.releasedReservations, color: "text-zinc-400" },
		{ label: "Expired (uncleaned)", value: stats.expiredPending, color: "text-red-500" },
		{ label: "Available Units", value: stats.totalAvailableUnits, color: "text-zinc-900" },
		{
			label: "Revenue",
			value: `₹${stats.revenueConfirmed.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
			color: "text-green-700",
		},
	]

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
			{cards.map((card) => (
				<div
					key={card.label}
					className="bg-white border border-zinc-200 rounded-xl px-4 py-3 flex flex-col gap-1"
				>
					<p className="text-xs text-zinc-400">{card.label}</p>
					<p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
				</div>
			))}
		</div>
	)
}