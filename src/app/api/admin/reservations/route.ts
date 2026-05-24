import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        stock: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
    })

    const response = reservations.map((r) => ({
      reservationID: r.reservationID,
      status: r.status,
      quantity: r.quantity,
      expiresAt: r.expiresAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      product: {
        name: r.stock.product.name,
        sku: r.stock.product.sku,
        price: r.stock.product.price,
        category: r.stock.product.category,
      },
      warehouse: {
        name: r.stock.warehouse.name,
        location: r.stock.warehouse.location,
      },
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    )
  }
}