import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reserveData = z.object({
    stockId : z.string(),
    quantity : z.number().int().positive(),
})

export async function POST(req : NextRequest) {
    try {
        const body = await req.json()
        const parse = reserveData.safeParse(body)

        if(!parse.success) {
            return NextResponse.json({
                    error : "Invalid request body!",
                    details : z.flattenError(parse.error),
                }, {
                    status : 400
                }
            )
        }

        const {stockId, quantity} = parse.data;

        const reservation = await prisma.$transaction(async (tx) => {

            type StockRow = {
                stockId: string
                totalUnits: number
                reservedUnits: number
            }

            const stock = await tx.$queryRaw<StockRow[]>`
                SELECT "stockId", "totalUnits", "reservedUnits"
                FROM "Stock"
                WHERE "stockId" = ${stockId}
                FOR UPDATE
            `
        
            if (stock.length === 0) {
                throw { code: "NOT_FOUND" }
            }

            const row = stock[0]
            const availableUnits = row.totalUnits - row.reservedUnits

            if (availableUnits < quantity) {
                throw { code: "INSUFFICIENT_STOCK" }
            }

            const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

            const newReservation = await tx.reservation.create({
                data: {
                stockId,
                quantity,
                expiresAt,
                },
            })

            await tx.stock.update({
                where: { stockId },
                data: { reservedUnits: { increment: quantity } },
            })

            return newReservation
        })

        return NextResponse.json(reservation, { status: 201 })

    } catch (error : any) {
        if(error?.code === "INSUFFICIENT_STOCK") {
            return NextResponse.json(
                {error : "Sufficient stock is not available! Sorry for the inconvenience."},
                {status : 409}
            )
        } 
        if(error?.code == "NOT_FOUND") {
            return NextResponse.json(
                {error : "Requested stock not found!"},
                {status : 404}
            )
        }
        console.log(error)
        return NextResponse.json(
            {error : "Failed to create reservation. Sorry for the inconvenience."},
            {status : 500}
        )
    }
}