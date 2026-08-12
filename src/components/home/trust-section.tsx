const trustItems = [
    {
      title: "Fast Delivery",
      description:
        "Reliable shipping with timely updates so customers always know where their order stands.",
    },
    {
      title: "Secure Payments",
      description:
        "Protected checkout experience designed to keep transactions smooth, safe, and trustworthy.",
    },
    {
      title: "Easy Returns",
      description:
        "Customer-friendly support and simple return handling for a more confident shopping experience.",
    },
    {
      title: "24/7 Support",
      description:
        "Responsive assistance for product questions, order issues, and post-purchase help whenever needed.",
    },
  ];
  
  export default function TrustSection() {
    return (
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 text-white shadow-sm">
            <div className="border-b border-slate-800 px-8 py-8 md:px-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Why customers choose us
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Built for a smooth and trusted shopping experience
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                From product discovery to checkout and support, every step is
                designed to feel fast, reliable, and easy to use.
              </p>
            </div>
  
            <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
              {trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`px-8 py-8 md:px-10 ${
                    index !== trustItems.length - 1
                      ? "border-slate-800"
                      : ""
                  } border-t md:border-t-0 xl:border-l`}
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }