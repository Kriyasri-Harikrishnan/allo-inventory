import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const reservation = await prisma.reservation.findUnique({
            where: { reservationID: id },
            include: {
                stock: {
                    include: {
                        product: true,
                        warehouse: true,
                    },
                },
            },
        })

        if (!reservation) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 }
            )
        }

        const product = reservation.stock.product
        const warehouse = reservation.stock.warehouse

        const deliveryFee = product.weightKg
            ? Number(warehouse.deliveryBaseFee) +
            Number(product.weightKg) * Number(warehouse.deliveryFeePerKg)
            : Number(warehouse.deliveryBaseFee)

        return NextResponse.json({
            reservationID: reservation.reservationID,
            status: reservation.status,
            quantity: reservation.quantity,
            expiresAt: reservation.expiresAt,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
            product: {
                name: product.name,
                sku: product.sku,
                price: product.price,
                category: product.category,
            },
            warehouse: {
                name: warehouse.name,
                location: warehouse.location,
            },
            deliveryFee,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch reservation" },
            { status: 500 }
        )
    }
}