import { prisma } from "@/lib/prisma"

export async function lazyCleanup() {
    const now = new Date()

    const expiredReservations = await prisma.reservation.findMany({
        where: {
            status: "PENDING",
            expiresAt: { lt: now },
        },
    })

    let released = 0

    for (const reservation of expiredReservations) {
        await prisma.$transaction(async (tx) => {
            await tx.reservation.update({
                where: { reservationID: reservation.reservationID },
                data: { status: "RELEASED" },
            })

            await tx.stock.update({
                where: { stockId: reservation.stockId },
                data: {
                    reservedUnits: {
                        decrement: reservation.quantity,
                    },
                },
            })
        })

        released++
    }

    return released
}