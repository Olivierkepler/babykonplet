export default function CategoryStrip() {
    const categories = [
      "Electronics",
      "Fashion",
      "Mobiles",
      "Beauty",
      "Home",
      "Appliances",
      "Sports",
      "Gaming",
    ];
  
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {categories.map((item) => (
              <div
                key={item}
                className="flex flex-col items-center rounded-xl p-3 hover:bg-slate-50"
              >
                <div className="h-14 w-14 rounded-full bg-slate-100" />
                <p className="mt-2 text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }