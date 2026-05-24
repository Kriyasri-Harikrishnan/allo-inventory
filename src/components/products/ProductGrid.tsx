import ProductCard from "./ProductCard"

type Props = {
	products: any[]
}

export default function ProductGrid({ products }: Props) {
	if (products.length === 0) {
		return (
			<div className="text-center py-20 text-zinc-400">
				<p className="text-4xl mb-2">📦</p>
				<p className="text-sm">No products found</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
			{products.map((product) => (
				<ProductCard
					key={product.productId}
					name={product.name}
					sku={product.sku}
					description={product.description}
					price={product.price}
					category={product.category}
					imageUrl={product.imageUrl}
					stock={product.stock}
				/>
			))}
		</div>
	)
}