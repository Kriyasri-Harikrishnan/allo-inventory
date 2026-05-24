"use client"

import { useState } from "react"
import Image from "next/image"
import WarehouseStockRow from "./WarehouseStockRow"

type StockEntry = {
	stockId: string
	warehouseName: string
	warehouseLocation: string
	availableUnits: number
	totalUnits: number
	deliveryFee: number
}

type Props = {
	name: string
	sku: string
	description: string | null
	price: string
	category: string
	imageUrl: string | null
	stock: StockEntry[]
}

const CATEGORY_COLORS: Record<string, string> = {
	ELECTRONICS: "bg-blue-100 text-blue-700",
	APPAREL: "bg-purple-100 text-purple-700",
	FOOTWEAR: "bg-orange-100 text-orange-700",
	HOME_AND_LIVING: "bg-yellow-100 text-yellow-700",
	SPORTS_AND_FITNESS: "bg-green-100 text-green-700",
	BEAUTY: "bg-pink-100 text-pink-700",
}

export default function ProductCard({
	name,
	sku,
	description,
	price,
	category,
	imageUrl,
	stock,
}: Props) {
	const [expanded, setExpanded] = useState(false)
	const [reserving, setReserving] = useState(false)

	const totalAvailable = stock.reduce((sum, s) => sum + s.availableUnits, 0)
	const totalUnits = stock.reduce((sum, s) => sum + s.totalUnits, 0)

	return (
		<div className="bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all overflow-hidden">
			{/* Image */}
			<div className="relative h-48 bg-zinc-50 flex items-center justify-center overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name}
						fill
						className="object-contain p-3"
						unoptimized
					/>
				) : (
					<div className="text-zinc-300 text-4xl">📦</div>
				)}
			</div>

			<div className="p-4 flex flex-col gap-3">
				{/* Name + SKU */}
				<div>
					<h2 className="font-semibold text-sm text-zinc-900 leading-snug">{name}</h2>
					<p className="text-xs text-zinc-400 font-mono mt-0.5">{sku}</p>
				</div>

				{/* Price + Category */}
				<div className="flex items-center justify-between">
					<p className="text-lg font-bold text-zinc-900">
						₹{Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
					</p>
					<span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category] ?? "bg-zinc-100 text-zinc-600"}`}>
						{category.replace(/_/g, " ")}
					</span>
				</div>

				{/* Description */}
				{description && (
					<p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
				)}

				{/* Stock summary */}
				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span>{totalUnits} units · {stock.length} locations</span>
					<span className={
						totalAvailable === 0 ? "text-red-500 font-medium" :
							totalAvailable <= 5 ? "text-amber-500 font-medium" :
								"text-green-600 font-medium"
					}>
						{totalAvailable} available
					</span>
				</div>

				{/* Expand button */}
				<button
					onClick={() => setExpanded(!expanded)}
					className="w-full text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg py-2 transition-colors"
				>
					{expanded ? "Hide available locations ▲" : "Available Locations ▼"}
				</button>

				{/* Warehouse rows */}
				{expanded && (
					<div className="flex flex-col divide-y divide-zinc-100">
						{stock.map((s) => (
							<WarehouseStockRow
								key={s.stockId}
								stockId={s.stockId}
								warehouseName={s.warehouseName}
								warehouseLocation={s.warehouseLocation}
								availableUnits={s.availableUnits}
								deliveryFee={s.deliveryFee}
								reserving={reserving}
								onReservingChange={setReserving}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}