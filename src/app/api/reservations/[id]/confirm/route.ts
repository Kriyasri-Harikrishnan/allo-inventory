import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    {params} : {params : Promise<{id: string}>}
) {
    try {
        const {id} = await params
        const result = await prisma.$transaction(async (tx) => {
            const reservation = await tx.reservation.findUnique({
                where : {reservationID : id},
            })

            if(!reservation) {throw {code : "NOT_FOUND"}}
            if(reservation.status !== "PENDING") {throw {code : "INVALID_STATUS"}}
            
            if(new Date() > reservation.expiresAt) { /* Stocks Reservation Expired */
                
                await tx.stock.update({
                    where : {stockId : reservation.stockId},
                    data : {reservedUnits : {decrement : reservation.quantity}},
                })

                await tx.reservation.update({
                    where : {reservationID : id},
                    data : {status : "RELEASED"},
                })

                return { __status : "EXPIRED"}
            }

            /*  Below section is for a successful payment (User presses 'Confirm Purchase')*/

            await tx.stock.update({
                where : {stockId : reservation.stockId},
                data : {
                    totalUnits : {decrement : reservation.quantity},
                    reservedUnits : {decrement : reservation.quantity},
                },
            })

            return await tx.reservation.update({
                where : {reservationID : id},
                data : {status : "CONFIRMED"},
            })
        })

        if ((result as any).__status === "EXPIRED") {
        return NextResponse.json(
                { error: "Reservation has expired" },
                { status: 410 }
            )
        }

        return NextResponse.json(result)

    } catch (error: any) {

        if(error?.code == "NOT_FOUND") {
            return NextResponse.json(
                {error : "Reservation not found!"},
                {status : 404}
            )
        } 

        if(error?.code == "INVALID_STATUS") {
            return NextResponse.json(
                {error : "Reservation is not in the PENDING status! [Not confirmable!]"},
                {status : 400}
            )
        }

        console.error(error)

        return NextResponse.json(
            {error : "Failed to confirm reservation"},
            {status : 500}
        )
    }
} 