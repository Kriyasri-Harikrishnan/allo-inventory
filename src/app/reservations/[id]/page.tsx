"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import CountdownTimer from "@/components/reservations/CountdownTimer"
import { confirmReservation, releaseReservation } from "@/lib/api"

type ReservationData = {
    reservationID: string
    status: string
    quantity: number
    expiresAt: string
    createdAt: string
    product: {
        name: string
        sku: string
        price: string
        category: string
    }
    warehouse: {
        name: string
        location: string
    }
    deliveryFee: number
}

type PageStatus = "pending" | "confirmed" | "released" | "expired" | "error"

export default function ReservationPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    const [reservation, setReservation] = useState<ReservationData | null>(null)
    const [pageStatus, setPageStatus] = useState<PageStatus>("pending")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<"confirm" | "cancel" | null>(null)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        async function fetchReservation() {
            try {
                const res = await fetch(`/api/reservations/${id}`)
                if (!res.ok) {
                    setPageStatus("error")
                    setError("Reservation not found.")
                    return
                }
                const data = await res.json()
                setReservation(data)
                if (data.status === "CONFIRMED") setPageStatus("confirmed")
                else if (data.status === "RELEASED") setPageStatus("released")
                else if (new Date(data.expiresAt) < new Date()) setPageStatus("expired")
                else setPageStatus("pending")
            } catch {
                setPageStatus("error")
                setError("Failed to load reservation.")
            } finally {
                setFetching(false)
            }
        }
        fetchReservation()
    }, [id])

    const handleExpire = useCallback(() => {
        setPageStatus("expired")
    }, [])

    async function handleConfirm() {
        setLoading("confirm")
        setError(null)
        const result = await confirmReservation(id)
        setLoading(null)
        if (result.status === 410) {
            setPageStatus("expired")
            setError("Your reservation expired before you could confirm.")
            return
        }
        if (result.error) {
            setError(result.error)
            return
        }
        setPageStatus("confirmed")
    }

    async function handleCancel() {
        setLoading("cancel")
        setError(null)
        const result = await releaseReservation(id)
        setLoading(null)
        if (result.error) {
            setError(result.error)
            return
        }
        setPageStatus("released")
        setTimeout(() => router.push("/"), 2000)
    }

    if (fetching) {
        return (
            <div className="max-w-lg mx-auto px-6 py-20 text-center text-zinc-400 text-sm">
                Loading reservation...
            </div>
        )
    }

    if (pageStatus === "error" || !reservation) {
        return (
            <div className="max-w-lg mx-auto px-6 py-20 text-center">
                <p className="text-red-500 font-medium">{error ?? "Something went wrong."}</p>
                <Link href="/" className="text-sm text-zinc-500 underline mt-4 inline-block">
                    Back to products
                </Link>
            </div>
        )
    }

    const totalPrice = Number(reservation.product.price) * reservation.quantity
    const total = totalPrice + reservation.deliveryFee

    return (
        <div className="max-w-lg mx-auto px-6 py-12">
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
                ← Back to products
            </Link>

            <div className="mt-6 bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100">
                    <h1 className="font-semibold text-zinc-900">Your Reservation</h1>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{reservation.reservationID}</p>
                </div>

                <div className="px-6 py-4 border-b border-zinc-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-medium text-sm text-zinc-900">{reservation.product.name}</p>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">{reservation.product.sku}</p>
                        </div>
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                            {reservation.product.category.replace(/_/g, " ")}
                        </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-1.5 text-sm">
                        <div className="flex justify-between text-zinc-500">
                            <span>Warehouse</span>
                            <span className="text-zinc-800 font-medium">{reservation.warehouse.name}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                            <span>Location</span>
                            <span className="text-zinc-800">{reservation.warehouse.location}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                            <span>Quantity</span>
                            <span className="text-zinc-800 font-medium">{reservation.quantity}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                            <span>Unit price</span>
                            <span className="text-zinc-800">
                                ₹{Number(reservation.product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                            <span>Delivery</span>
                            <span className="text-zinc-800">₹{reservation.deliveryFee?.toFixed(2) ?? "—"}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-zinc-900 border-t border-zinc-100 pt-2 mt-1">
                            <span>Total</span>
                            <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    {pageStatus === "pending" && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500">Expires in</span>
                                <CountdownTimer expiresAt={reservation.expiresAt} onExpire={handleExpire} />
                            </div>
                            {error && (
                                <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handleConfirm}
                                disabled={loading !== null}
                                className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                {loading === "confirm" ? "Confirming..." : "Confirm Purchase"}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading !== null}
                                className="w-full bg-white text-zinc-600 text-sm font-medium py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-50"
                            >
                                {loading === "cancel" ? "Cancelling..." : "Cancel Reservation"}
                            </button>
                        </div>
                    )}

                    {pageStatus === "confirmed" && (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">✓</div>
                            <p className="font-semibold text-zinc-900">Purchase Confirmed</p>
                            <p className="text-xs text-zinc-400">Your order has been placed successfully.</p>
                            <Link href="/" className="text-xs text-zinc-500 underline mt-2">Continue shopping</Link>
                        </div>
                    )}

                    {pageStatus === "released" && (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 text-lg">✕</div>
                            <p className="font-semibold text-zinc-900">Reservation Cancelled</p>
                            <p className="text-xs text-zinc-400">Redirecting you back to products...</p>
                        </div>
                    )}

                    {pageStatus === "expired" && (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-lg">⏱</div>
                            <p className="font-semibold text-zinc-900">Reservation Expired</p>
                            <p className="text-xs text-zinc-400">
                                {error ?? "Your hold has expired. Units have been returned to stock."}
                            </p>
                            <Link href="/" className="text-xs text-zinc-500 underline mt-2">Back to products</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}