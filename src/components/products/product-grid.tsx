import ProductCard from "./product-card";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  stock?: number;
  imageUrl?: string | null;
  image?: string | null;
};

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}