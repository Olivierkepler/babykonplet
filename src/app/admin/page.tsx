import Link from "next/link";
import { prisma } from "../../lib/prisma";
import AdminLayout from "../../components/admin/AdminLayout";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function AdminDashboardPage() {
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const topProducts = products.slice(0, 5);

  return (
    <AdminLayout>
    <main className="min-h-screen bg-[#f6f8fb]">
      <div>

          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <input
                placeholder="Search for products, orders, customers..."
                className="hidden w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:block"
              />

              <div className="ml-auto flex items-center gap-3">
                <Link
                  href="/products"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm"
                >
                  View Store
                </Link>

                <Link
                  href="/admin/products/new"
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100"
                >
                  + Add Product
                </Link>

                <div className="hidden items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 md:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Admin</p>
                    <p className="text-xs text-slate-500">Store Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-950">
                  Welcome back, Admin 👋
                </h1>
                <p className="mt-2 text-slate-500">
                  Here’s what’s happening with your store today.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm">
              {new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
})}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-bold text-slate-500">Total Revenue</p>
  <h2 className="mt-3 text-3xl font-black text-slate-950">
    {formatPrice(totalRevenue)}
  </h2>
  <p className="mt-4 text-sm font-bold text-emerald-600">
    ↑ Updated live
  </p>
</div>

<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-sm font-bold text-slate-500">Total Orders</p>
  <h2 className="mt-3 text-3xl font-black text-slate-950">
    {totalOrders}
  </h2>
  

                <p className="mt-4 text-sm font-bold text-emerald-600">
                  ↑ Updated live
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Total Products</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  {totalProducts}
                </h2>
                <p className="mt-4 text-sm font-bold text-emerald-600">
                  ↑ Updated live
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Inventory Units</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  {totalStock}
                </h2>
                <p className="mt-4 text-sm font-bold text-emerald-600">
                  ↑ Updated live
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-6">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-6 text-white shadow-lg lg:col-span-2">
                <p className="text-sm font-bold text-white/70">Active Products</p>
                <h2 className="mt-3 text-4xl font-black">{activeProducts}</h2>
                <p className="mt-3 text-sm text-white/70">Currently active</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-slate-700 to-slate-950 p-6 text-white shadow-lg lg:col-span-2">
                <p className="text-sm font-bold text-white/70">Inactive Products</p>
                <h2 className="mt-3 text-4xl font-black">{inactiveProducts}</h2>
                <p className="mt-3 text-sm text-white/70">Currently hidden</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-orange-700 to-yellow-950 p-6 text-white shadow-lg">
                <p className="text-sm font-bold text-white/70">Low Stock</p>
                <h2 className="mt-3 text-4xl font-black">{lowStock}</h2>
                <p className="mt-3 text-sm text-white/70">Need attention</p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-red-700 to-red-950 p-6 text-white shadow-lg">
                <p className="text-sm font-bold text-white/70">Out of Stock</p>
                <h2 className="mt-3 text-4xl font-black">{outOfStock}</h2>
                <p className="mt-3 text-sm text-white/70">Unavailable</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      Store Actions
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Quick access to important admin controls.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Link href="/admin/products" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
                    <p className="text-sm font-bold text-emerald-600">Product Control</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">Manage Products</h3>
                    <p className="mt-2 text-sm text-slate-500">Edit pricing, stock, visibility, and images.</p>
                  </Link>

                  <Link href="/admin/products/new" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
                    <p className="text-sm font-bold text-blue-600">Quick Action</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">Add Product</h3>
                    <p className="mt-2 text-sm text-slate-500">Add products with multiple images.</p>
                  </Link>

                  <Link href="/admin/orders" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
                    <p className="text-sm font-bold text-purple-600">Order Center</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">View Orders</h3>
                    <p className="mt-2 text-sm text-slate-500">Track payments and order status.</p>
                  </Link>

                  <Link href="/products" className="rounded-2xl border border-slate-200 p-5 hover:bg-slate-50">
                    <p className="text-sm font-bold text-orange-600">Storefront</p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">View Store</h3>
                    <p className="mt-2 text-sm text-slate-500">Open customer-facing store.</p>
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">
                    Recent Orders
                  </h2>
                  <Link href="/admin/orders" className="text-sm font-bold text-slate-500">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <div>
                          <p className="font-black text-slate-900">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {order.status}
                          </p>
                        </div>
                        <p className="font-black text-slate-950">
  {formatPrice(order.totalAmount)}
</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      No orders yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">
                    Top Products
                  </h2>
                  <Link href="/admin/products" className="text-sm font-bold text-slate-500">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-700">
                          {index + 1}
                        </span>

                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">N/A</span>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.stock} in stock
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-black text-emerald-600">
  {formatPrice(product.price)}
</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
  DJADOR FAMILY STORE - Admin Dashboard
</p>
          </div>
                        
        </div>
      </main>
    </AdminLayout>
  );
}