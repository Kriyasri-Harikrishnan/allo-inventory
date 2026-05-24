import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type ReservationRow = {
    reservationID: string
    status: string
    expiresAt: Date
    stockId: string
    quantity: number                
}

export async function POST(
    req : NextRequest,
    { params } : { params : Promise<{id : string}>}
) {
    try {
        const { id } = await params 
        const result = await prisma.$transaction(async (tx) => {

            const rows = await tx.$queryRaw<ReservationRow[]>`
                SELECT "reservationID", "status", "expiresAt", "stockId", "quantity"
                FROM "Reservation"
                WHERE "reservationID" = ${id}
                FOR UPDATE
            `

            if (rows.length === 0) {throw { code: "NOT_FOUND" }}

            const reservation = rows[0]

            if(reservation.status !== "PENDING") {throw {code : "INVALID_STATUS"}}
            
            await tx.stock.update({
                where : {stockId : reservation.stockId},
                data : {reservedUnits : {decrement : reservation.quantity}},
            })

            return await tx.reservation.update({
                where : {reservationID : id},
                data : {status : "RELEASED"},
            })

        })

        return NextResponse.json(result)

    } catch (error : any) {

        if(error?.code === "NOT_FOUND") {
            return NextResponse.json(
                {error : "Reservation not found!"},
                {status: 404}
            )
        }

        if(error?.code === "INVALID_STATUS") {
            return NextResponse.json(
                {error : "Reservation is not in PENDING status!"},
                {status : 400}
            )
        }

        console.error(error)

        return NextResponse.json(
            {error : "Failed to release reservation!"},
            {status : 500}
        )
    }
}