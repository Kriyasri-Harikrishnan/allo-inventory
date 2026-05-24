"use client"

import { useEffect, useState, useCallback } from "react"
import StatsBar from "@/components/admin/StatsBar"
import ReservationsTable from "@/components/admin/ReservationsTable"
import CronStatus from "@/components/admin/CronStatus"
import { fetchAdminReservations, fetchAdminStats } from "@/lib/api"

export default function AdminPage() {
	const [stats, setStats] = useState<any>(null)
	const [reservations, setReservations] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

	const load = useCallback(async () => {
		try {
			const [s, r] = await Promise.all([
				fetchAdminStats(),
				fetchAdminReservations(),
			])
			setStats(s)
			setReservations(r)
			setLastRefreshed(new Date())
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		load()
		const interval = setInterval(load, 30000) // auto-refresh every 30s
		return () => clearInterval(interval)
	}, [load])

	return (
		<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
					<p className="text-sm text-zinc-400 mt-0.5">
						Live inventory and reservation overview
					</p>
				</div>
				<div className="flex items-center gap-3">
					{lastRefreshed && (
						<p className="text-xs text-zinc-400">
							Last updated {lastRefreshed.toLocaleTimeString("en-IN")}
						</p>
					)}
					<button
						onClick={load}
						className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
					>
						Refresh
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-center py-20 text-zinc-400 text-sm">Loading...</div>
			) : (
				<>
					{/* Stats */}
					{stats && <StatsBar stats={stats} />}

					{/* Cron Status */}
					<CronStatus />

					{/* Reservations Table */}
					<div>
						<h2 className="text-sm font-semibold text-zinc-900 mb-3">
							All Reservations ({reservations.length})
						</h2>
						<ReservationsTable reservations={reservations} />
					</div>
				</>
			)}
		</div>
	)
}