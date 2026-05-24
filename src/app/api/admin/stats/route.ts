import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { lazyCleanup } from "@/lib/lazyCleanup"

export async function GET() {
    try {
        await lazyCleanup()
        const now = new Date()

        const [reservations, stocks] = await Promise.all([
            prisma.reservation.findMany(),
            prisma.stock.findMany(),
        ])

        const pending = reservations.filter((r) => r.status === "PENDING")
        const confirmed = reservations.filter((r) => r.status === "CONFIRMED")
        const released = reservations.filter((r) => r.status === "RELEASED")
        const expiredPending = pending.filter((r) => r.expiresAt < now)

        const totalStock = stocks.reduce((sum, s) => sum + s.totalUnits, 0)
        const totalReserved = stocks.reduce((sum, s) => sum + s.reservedUnits, 0)

        const confirmedWithProduct = await prisma.reservation.findMany({
            where: { status: "CONFIRMED" },
            include: {
                stock: { include: { product: true } },
            },
        })

        const revenue = confirmedWithProduct.reduce((sum, r) => {
            return sum + Number(r.stock.product.price) * r.quantity
        }, 0)

        return NextResponse.json({
            totalReservations: reservations.length,
            pendingReservations: pending.length,
            confirmedReservations: confirmed.length,
            releasedReservations: released.length,
            expiredPending: expiredPending.length,
            totalStockUnits: totalStock,
            totalReservedUnits: totalReserved,
            totalAvailableUnits: totalStock - totalReserved,
            revenueConfirmed: revenue,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        )
    }
}