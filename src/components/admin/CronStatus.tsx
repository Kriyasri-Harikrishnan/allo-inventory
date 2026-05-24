"use client"

import { useEffect, useState } from "react"

export default function CronStatus() {
	const [secondsUntilNext, setSecondsUntilNext] = useState(0)

	useEffect(() => {
		function calculate() {
			const now = new Date()
			return 60 - now.getSeconds()
		}

		setSecondsUntilNext(calculate())

		const interval = setInterval(() => {
			setSecondsUntilNext(calculate())
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="bg-white border border-zinc-200 rounded-xl px-5 py-4 flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-zinc-900">Expiry Cleanup Cron</p>
				<p className="text-xs text-zinc-400 mt-0.5">
					Runs every minute via Vercel Cron · releases expired PENDING reservations
				</p>
			</div>
			<div className="text-right">
				<p className="text-xs text-zinc-400">Next run in</p>
				<p className="text-2xl font-mono font-bold text-zinc-900">
					00:{String(secondsUntilNext).padStart(2, "0")}
				</p>
			</div>
		</div>
	)
}