import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
	try {
		const products = await prisma.product.findMany({
			include: {
				stock: {
					include: {
						warehouse: true,
					},
				},
			},
		})

		const response = products.map((product) => ({
			productId: product.productId,
			sku: product.sku,
			name: product.name,
			description: product.description,
			price: product.price,
			weightKg: product.weightKg,
			category: product.category,
			imageUrl: product.imageUrl,
			stock: product.stock.map((s) => ({
				stockId: s.stockId,
				warehouseId: s.warehouseId,
				warehouseName: s.warehouse.name,
				warehouseLocation: s.warehouse.location,
				totalUnits: s.totalUnits,
				reservedUnits: s.reservedUnits,
				availableUnits: s.totalUnits - s.reservedUnits,
				deliveryFee:
					product.weightKg
						? Number(s.warehouse.deliveryBaseFee) +
						Number(product.weightKg) * Number(s.warehouse.deliveryFeePerKg)
						: Number(s.warehouse.deliveryBaseFee),
			})),
		}))

		return NextResponse.json(response)
	}
	catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		)
	}
}