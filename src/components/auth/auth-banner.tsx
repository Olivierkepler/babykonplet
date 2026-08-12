export default function AuthBanner() {
    return (
      <div className="flex h-full min-h-[700px] items-center justify-center rounded-[2rem] bg-slate-900 p-10 text-white">
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
            Modern Commerce
          </p>
  
          <h2 className="mt-4 text-5xl font-bold leading-tight">
            Professional shopping experience built for real users.
          </h2>
  
          <p className="mt-6 text-base leading-8 text-slate-300">
            Clean design, secure authentication, smooth checkout, order tracking,
            and a premium storefront experience from start to finish.
          </p>
  
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-700 pt-8">
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="mt-1 text-sm text-slate-400">Customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="mt-1 text-sm text-slate-400">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-sm text-slate-400">Support</p>
            </div>
          </div>
        </div>
      </div>
    );
  }