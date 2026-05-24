import Link from "next/link"

export default function Header() {
	return (
		<header className="sticky top-0 z-50 bg-black text-white border-b border-zinc-800">
			<div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2.5">
					<div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
						<span className="text-black font-bold text-xs">A</span>
					</div>
					<div className="flex flex-col leading-tight">
						<span className="font-semibold text-sm">Allo Inventory</span>
						<span className="text-zinc-400 text-xs">Multi-Warehouse Platform</span>
					</div>
				</Link>
				<nav className="flex items-center gap-1">
					<Link href="/" className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
						Products
					</Link>
					<Link href="/admin" className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
						Admin
					</Link>
				</nav>
			</div>
		</header>
	)
}