"use client"

import { useEffect, useState } from "react"

type Props = {
    expiresAt: string
    onExpire: () => void
}

export default function CountdownTimer({ expiresAt, onExpire }: Props) {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        function calculate() {
            const diff = new Date(expiresAt).getTime() - Date.now()
            return Math.max(0, Math.floor(diff / 1000))
        }

        setTimeLeft(calculate())

        const interval = setInterval(() => {
            const remaining = calculate()
            setTimeLeft(remaining)
            if (remaining === 0) {
                clearInterval(interval)
                onExpire()
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [expiresAt, onExpire])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    const isUrgent = timeLeft <= 60

    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${isUrgent ? "text-red-500" : "text-zinc-600"
            }`}>
            <span className={`text-2xl font-mono font-bold ${isUrgent ? "text-red-500" : "text-zinc-900"
                }`}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span>{isUrgent ? "⚠ Expiring soon" : "remaining"}</span>
        </div>
    )
}