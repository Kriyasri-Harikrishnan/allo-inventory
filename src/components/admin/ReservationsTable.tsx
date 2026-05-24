"use client"

type Reservation = {
	reservationID: string
	status: string
	quantity: number
	expiresAt: string
	createdAt: string
	product: { name: string; sku: string; price: string }
	warehouse: { name: string; location: string }
}

type Props = { reservations: Reservation[] }

const STATUS_STYLES: Record<string, string> = {
	PENDING: "bg-amber-100 text-amber-700",
	CONFIRMED: "bg-green-100 text-green-700",
	RELEASED: "bg-zinc-100 text-zinc-500",
}

function isExpired(expiresAt: string, status: string) {
	return status === "PENDING" && new Date(expiresAt) < new Date()
}

export default function ReservationsTable({ reservations }: Props) {
	if (reservations.length === 0) {
		return (
			<div className="text-center py-16 text-zinc-400 text-sm">
				No reservations yet.
			</div>
		)
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-zinc-200">
			<table className="w-full text-sm">
				<thead>
					<tr className="bg-zinc-50 border-b border-zinc-200">
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">ID</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Product</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Warehouse</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Qty</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Status</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Expires</th>
						<th className="text-left px-4 py-3 text-xs font-medium text-zinc-500">Created</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-zinc-100">
					{reservations.map((r) => {
						const expired = isExpired(r.expiresAt, r.status)
						return (
							<tr
								key={r.reservationID}
								className={expired ? "bg-red-50" : "bg-white hover:bg-zinc-50"}
							>
								<td className="px-4 py-3 font-mono text-xs text-zinc-400">
									{r.reservationID.slice(0, 12)}...
								</td>
								<td className="px-4 py-3">
									<p className="font-medium text-zinc-900 text-xs">{r.product.name}</p>
									<p className="text-zinc-400 font-mono text-xs">{r.product.sku}</p>
								</td>
								<td className="px-4 py-3">
									<p className="text-xs text-zinc-800">{r.warehouse.name}</p>
									<p className="text-xs text-zinc-400">{r.warehouse.location}</p>
								</td>
								<td className="px-4 py-3 text-xs text-zinc-800 font-medium">{r.quantity}</td>
								<td className="px-4 py-3">
									<span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-zinc-100 text-zinc-500"}`}>
										{expired ? "EXPIRED" : r.status}
									</span>
								</td>
								<td className="px-4 py-3 text-xs text-zinc-500">
									{new Date(r.expiresAt).toLocaleTimeString("en-IN", {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
									})}
								</td>
								<td className="px-4 py-3 text-xs text-zinc-500">
									{new Date(r.createdAt).toLocaleTimeString("en-IN", {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
									})}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}