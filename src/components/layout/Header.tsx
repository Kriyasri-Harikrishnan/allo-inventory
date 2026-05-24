import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            Products
          </Link>
        </nav>

        <Link href="/">
          <Image
            src="/alloshoppe-logo.png"
            alt="AlloShoppe"
            width={220}
            height={70}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            Admin
          </Link>
        </nav>

      </div>
    </header>
  )
}