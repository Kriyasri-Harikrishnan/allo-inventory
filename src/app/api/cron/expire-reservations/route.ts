import { NextRequest, NextResponse } from "next/server"
import { lazyCleanup } from "@/lib/lazyCleanup"

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization")

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error : "Unauthorized!" },
                { status : 401 }
            )
        }

        const released = await lazyCleanup()

        if (released === 0) {
            return NextResponse.json({
                message : "No expired reservations found!",
                released : 0,
            })
        }

        console.log(
            `[ CRON ] Released ${released} reservation(s) due to expiry.`
        )

        return NextResponse.json({
            message : "Expired reservation(s) cleanup completed!",
            released,
        })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error : "Cron job failed!" },
            { status : 500 }
        )
    }
}