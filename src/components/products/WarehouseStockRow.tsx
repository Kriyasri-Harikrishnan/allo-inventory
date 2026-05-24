"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createReservation } from "@/lib/api"

type Props = {
	stockId: string
	warehouseName: string
	warehouseLocation: string
	availableUnits: number
	deliveryFee: number
	reserving: boolean
	onReservingChange: (val: boolean) => void
}

export default function WarehouseStockRow({
	stockId,
	warehouseName,
	warehouseLocation,
	availableUnits,
	deliveryFee,
	reserving,
	onReservingChange,
}: Props) {
	const router = useRouter()
	const [quantity, setQuantity] = useState(1)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleReserve() {
		setLoading(true)
		setError(null)
		onReservingChange(true)

		const result = await createReservation(stockId, quantity)

		setLoading(false)
		onReservingChange(false)

		if (result.error) {
			setError(
				result.status === 409
					? "Not enough stock available."
					: "Something went wrong. Please try again."
			)
			return
		}

		router.push(`/reservations/${result.data.reservationID}`)
	}

	return (
		<div className="py-3 flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs font-medium text-zinc-800">{warehouseName}</p>
					<p className="text-xs text-zinc-400">{warehouseLocation}</p>
				</div>
				<div className="text-right">
					<p className={`text-xs font-semibold ${availableUnits === 0 ? "text-red-500" :
							availableUnits <= 3 ? "text-amber-500" :
								"text-green-600"
						}`}>
						{availableUnits} available
					</p>
					<p className="text-xs text-zinc-400">₹{deliveryFee.toFixed(2)} delivery</p>
				</div>
			</div>

			{availableUnits > 0 && (
				<div className="flex items-center gap-2">
					<input
						type="number"
						min={1}
						max={availableUnits}
						value={quantity}
						onChange={(e) =>
							setQuantity(Math.min(Number(e.target.value), availableUnits))
						}
						className="w-16 text-xs border border-zinc-200 rounded-md px-2 py-1.5 text-center focus:outline-none focus:border-zinc-400"
					/>
					<button
						onClick={handleReserve}
						disabled={loading || reserving}
						className="flex-1 text-xs font-medium bg-black text-white rounded-md py-1.5 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{loading ? "Reserving..." : "Reserve"}
					</button>
				</div>
			)}

			{availableUnits === 0 && (
				<p className="text-xs text-red-500 font-medium">Out of stock</p>
			)}

			{error && (
				<p className="text-xs text-red-500 bg-red-50 rounded-md px-2 py-1.5">{error}</p>
			)}
		</div>
	)
}