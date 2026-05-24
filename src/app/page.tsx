"use client"

import { useEffect, useState } from "react"
import ProductGrid from "@/components/products/ProductGrid"
import { fetchProducts } from "@/lib/api"

const CATEGORIES = [
	"ALL",
	"ELECTRONICS",
	"APPAREL",
	"FOOTWEAR",
	"HOME_AND_LIVING",
	"SPORTS_AND_FITNESS",
	"BEAUTY",
]

export default function ProductsPage() {
	const [products, setProducts] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [category, setCategory] = useState("ALL")

	useEffect(() => {
		fetchProducts().then((data) => {
			setProducts(data)
			setLoading(false)
		})
	}, [])

	const filtered = products.filter((p) => {
		const matchesSearch =
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.sku.toLowerCase().includes(search.toLowerCase())
		const matchesCategory = category === "ALL" || p.category === category
		return matchesSearch && matchesCategory
	})

	return (
		<div className="max-w-7xl mx-auto px-6 py-10">
			{/* Page Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-zinc-900">Products</h1>
				<p className="text-sm text-zinc-400 mt-1">
					Browse products and reserve stock from your nearest warehouse
				</p>
			</div>

			{/* Search + Filter */}
			<div className="flex flex-col sm:flex-row gap-3 mb-8">
				<input
					type="text"
					placeholder="Search by name or SKU..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 text-sm border border-zinc-200 rounded-lg px-4 py-2 focus:outline-none focus:border-zinc-400 bg-white"
				/>
				<div className="flex gap-2 flex-wrap">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							onClick={() => setCategory(cat)}
							className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${category === cat
									? "bg-black text-white border-black"
									: "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800"
								}`}
						>
							{cat === "ALL" ? "All" : cat.replace(/_/g, " ")}
						</button>
					))}
				</div>
			</div>

			{/* Results count */}
			{!loading && (
				<p className="text-xs text-zinc-400 mb-4">
					{filtered.length} product{filtered.length !== 1 ? "s" : ""} found
				</p>
			)}

			{loading ? (
				<div className="text-center py-20 text-zinc-400 text-sm">
					Loading products...
				</div>
			) : (
				<ProductGrid products={filtered} />
			)}
		</div>
	)
}