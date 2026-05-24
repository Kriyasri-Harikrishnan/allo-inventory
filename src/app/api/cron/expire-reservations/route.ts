import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization")
        if(authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                {error: "Unauthorized!"},
                {status : 401}
            )
        }

        const now = new Date()

        const expiredReservations = await prisma.reservation.findMany({
            where : {
                status : "PENDING",
                expiresAt : {lt : now},
            },
        })

        if (expiredReservations.length === 0) {
            return NextResponse.json({ message: "No expired reservations found!", released: 0 })
        }

        let released = 0
        for(const reservation of expiredReservations) {
            await prisma.$transaction(async (tx) => {
                await tx.reservation.update({
                    where : {reservationID : reservation.reservationID},
                    data : {status: "RELEASED"}, 
                })
                await tx.stock.update({
                    where : {stockId : reservation.stockId},
                    data : {reservedUnits : {decrement : reservation.quantity}},
                })
            })
            released++
        }

        console.log(`[ CRON ] Released ${released} reservations due to expiry.`)

        return NextResponse.json({
            message : "Expired reservation(s) cleanup completed!",
            released
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Cron job failed!" },
            { status: 500 }
        )
    }
}