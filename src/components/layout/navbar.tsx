"use client";

import Link from "next/link";
import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Bell,
  ChevronDown,
  CircleHelp,
  CheckCircle2,
  Heart,
  Home,
  LayoutGrid,
  LocateFixed,
  LogOut,
  MapPin,
  Menu,
  Package,
  RotateCcw,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "../cart/cart-context";
import Image from "next/image";

// TODO: replace with your real top-level storefront categories
// (these are generic marketplace placeholders, not Baby Konplet's)
const categoryLinks = [
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Dresses", href: "/products?productType=dresses" },
  { label: "Tops", href: "/products?productType=tops" },
  { label: "Outerwear", href: "/products?productType=jackets" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Sale", href: "/products?sort=price-low" },
];

const DELIVERY_STORAGE_KEY = "baby-konplet-delivery-location";
const DEFAULT_DELIVERY_LABEL = "Choose location";

// Design tokens — centralized brand blue pair so hover/focus/shadow
// states stay consistent across the header.
const BRAND = "#63A0C7";
const BRAND_HOVER = "#4F8CB5";
const BRAND_TINT = "#EAF4F8";
const INK = "#0f172a"; // slate-950

type NavbarProps = {
  cartCount?: number;
  notificationCount?: number;
  wishlistCount?: number;
};

type LocationResult = {
  label: string;
  deliverable: boolean;
  area?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
};

type IconComponent = ComponentType<{ className?: string }>;

export default function Navbar({
  cartCount: cartCountProp = 0,
  notificationCount = 0,
  wishlistCount = 0,
}: NavbarProps) {
  const { data: session } = useSession();
  const { cartCount: liveCartCount } = useCart();

  const cartCount = liveCartCount || cartCountProp;

  const [accountOpen, setAccountOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartBadgePopKey, setCartBadgePopKey] = useState(0);

  const [search, setSearch] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [deliveryLabel, setDeliveryLabel] = useState(
    DEFAULT_DELIVERY_LABEL
  );

  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const [resolvedLocation, setResolvedLocation] =
    useState<LocationResult | null>(null);

  const accountRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const previousCartCountRef = useRef<number | null>(null);

  const displayName =
    session?.user?.name?.trim().split(/\s+/)[0] ||
    session?.user?.email ||
    "Sign in";

  useEffect(() => {
    const savedLocation = window.localStorage.getItem(
      DELIVERY_STORAGE_KEY
    );

    if (!savedLocation) return;

    try {
      const parsedLocation = JSON.parse(
        savedLocation
      ) as LocationResult;

      if (
        !parsedLocation.label ||
        parsedLocation.deliverable !== true
      ) {
        throw new Error(
          "Invalid or unsupported saved location"
        );
      }

      setDeliveryLabel(parsedLocation.label);
      setZipCode(parsedLocation.postcode || "");
    } catch {
      window.localStorage.removeItem(DELIVERY_STORAGE_KEY);

      setDeliveryLabel(DEFAULT_DELIVERY_LABEL);
      setZipCode("");
    }
  }, []);

  useEffect(() => {
    if (previousCartCountRef.current === null) {
      previousCartCountRef.current = cartCount;
      return;
    }

    if (cartCount > previousCartCountRef.current) {
      setCartBadgePopKey((current) => current + 1);
    }

    previousCartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        accountRef.current &&
        !accountRef.current.contains(target)
      ) {
        setAccountOpen(false);
      }

      if (
        locationRef.current &&
        !locationRef.current.contains(target)
      ) {
        setLocationOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setAccountOpen(false);
      setLocationOpen(false);
      setLocationModalOpen(false);
      setMobileMenuOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );
    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  useEffect(() => {
    const shouldLockScroll =
      mobileMenuOpen || locationModalOpen;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = shouldLockScroll
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [mobileMenuOpen, locationModalOpen]);

  useEffect(() => {
    if (!locationModalOpen) return;

    const timer = window.setTimeout(() => {
      locationInputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timer);
  }, [locationModalOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function closeDesktopMenus() {
    setAccountOpen(false);
    setLocationOpen(false);
  }

  function openLocationModal() {
    setLocationOpen(false);
    setAccountOpen(false);
    setMobileMenuOpen(false);
    setLocationError("");
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    setLocationError("");
    setLocationLoading(false);
    setResolvedLocation(null);
  }

  async function saveZipCode(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedZip = zipCode.trim();

    if (!/^\d{5}(?:-\d{4})?$/.test(normalizedZip)) {
      setLocationError(
        "Enter a valid 5-digit ZIP code."
      );
      return;
    }

    try {
      setLocationLoading(true);
      setLocationError("");
      setResolvedLocation(null);

      const response = await fetch(
        `/api/location?zip=${encodeURIComponent(
          normalizedZip
        )}`
      );

      const data = (await response.json()) as
        | LocationResult
        | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error(
          "error" in data
            ? data.error
            : "We could not find that ZIP code."
        );
      }

      const stateName =
        data.state?.trim().toLowerCase() || "";

      const isMassachusetts =
        stateName === "massachusetts" ||
        data.deliverable === true;

      setResolvedLocation({
        ...data,
        deliverable: isMassachusetts,
      });
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : "We could not find that ZIP code."
      );
    } finally {
      setLocationLoading(false);
    }
  }

  function clearSavedLocation() {
    window.localStorage.removeItem(
      DELIVERY_STORAGE_KEY
    );

    setDeliveryLabel(DEFAULT_DELIVERY_LABEL);
    setZipCode("");
    setResolvedLocation(null);
    setLocationError("");
  }

  function confirmResolvedLocation() {
    if (!resolvedLocation?.deliverable) return;

    window.localStorage.setItem(
      DELIVERY_STORAGE_KEY,
      JSON.stringify(resolvedLocation)
    );

    setDeliveryLabel(resolvedLocation.label);
    setZipCode(resolvedLocation.postcode || "");
    setLocationModalOpen(false);
    setResolvedLocation(null);
    setLocationError("");
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by this browser."
      );

      return;
    }

    setLocationLoading(true);
    setLocationError("");
    setResolvedLocation(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const response = await fetch(
            `/api/location?lat=${encodeURIComponent(
              latitude
            )}&lon=${encodeURIComponent(longitude)}`
          );

          const data = (await response.json()) as
            | LocationResult
            | { error: string };

          if (!response.ok || "error" in data) {
            throw new Error(
              "error" in data
                ? data.error
                : "We could not determine your address."
            );
          }

          const stateName =
            data.state?.trim().toLowerCase() || "";

          const isMassachusetts =
            stateName === "massachusetts" ||
            data.deliverable === true;

          setResolvedLocation({
            ...data,
            deliverable: isMassachusetts,
          });
        } catch (error) {
          setLocationError(
            error instanceof Error
              ? error.message
              : "We could not determine your address."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        let message =
          "We could not access your location. Enter a ZIP code instead.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Allow location access or enter a ZIP code.";
        }

        if (error.code === error.TIMEOUT) {
          message =
            "Location request timed out. Try again or enter a ZIP code.";
        }

        setLocationError(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 10000,
      }
    );
  }

  const iconActionClass =
    "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-transparent transition duration-200 hover:text-[#63A0C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2";

  const popoverPanelClass =
    "overflow-hidden rounded-2xl border border-[#E7EEF3] bg-white shadow-[0_24px_60px_-15px_rgba(15,23,42,0.18)]";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
        {/* Brand accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#4F8CB5] via-[#63A0C7] to-[#4F8CB5]" />

        <div className="mx-auto flex h-[76px] max-w-full items-center gap-3 px-4 sm:px-6 lg:gap-6 xl:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Baby Konplet home"
            className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
          >
            {/* <Image
              src="/favicons/favicon-512x512.png"
              alt="Baby Konplet"
              width={100}
              height={100}
              priority
              className="h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105 sm:h-[68px] sm:w-[68px]"
            /> */}
            <Image src="/logo.png" alt="Djadorde Family Store" width={100} height={100} />

            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              Djadorde {" "}
              <span className="text-[#63A0C7]">
              Family Store
              </span>
            </span>
          </Link>

          {/* Desktop search */}
          <form
            action="/products"
            method="GET"
            className="relative hidden min-w-0 flex-1 lg:block"
            role="search"
          >
            <Search className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              name="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, brands and categories"
              autoComplete="off"
              aria-label="Search products"
              className="h-[50px] w-full rounded-full border border-slate-200 bg-slate-50 pl-13 pr-14 text-[15px] text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#63A0C7] focus:bg-white focus:ring-4 focus:ring-[#63A0C7]/10"
              style={{ paddingLeft: "3.25rem" }}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Desktop navigation */}
          <nav
            className="ml-auto hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {/* Location */}
            <div
              ref={locationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setLocationOpen(
                    (current) => !current
                  );

                  setAccountOpen(false);
                }}
                aria-expanded={locationOpen}
                aria-haspopup="menu"
                className="flex h-12 cursor-pointer items-center gap-2 rounded-xl px-3 text-left transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
              >
                <MapPin className="h-[18px] w-[18px] shrink-0 text-[#63A0C7]" />

                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider leading-none text-slate-400">
                    Deliver to
                  </span>

                  <span className="mt-1.5 block max-w-[130px] truncate text-sm font-bold leading-none text-slate-950">
                    {deliveryLabel}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    locationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {locationOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 w-80 pt-3"
                >
                  <div className={popoverPanelClass}>
                    <div className="flex items-start gap-3 p-5">
                      <div className="rounded-xl bg-[#EAF4F8] p-2.5 text-[#63A0C7]">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950">
                          Delivery location
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          See accurate availability and
                          delivery estimates.
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5">
                      {deliveryLabel !==
                        DEFAULT_DELIVERY_LABEL && (
                        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            Currently selected
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-emerald-950">
                            {deliveryLabel}
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={openLocationModal}
                        className="w-full cursor-pointer rounded-xl bg-[#63A0C7] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(99,160,199,0.5)] transition hover:bg-[#4F8CB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
                      >
                        {deliveryLabel ===
                        DEFAULT_DELIVERY_LABEL
                          ? "Choose delivery location"
                          : "Update delivery location"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="mx-1 h-8 w-px bg-slate-100"
              aria-hidden="true"
            />

            {/* Account */}
            <div
              ref={accountRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(
                    (current) => !current
                  );

                  setLocationOpen(false);
                }}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex h-12 cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left transition duration-200 hover:text-[#63A0C7] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#63A0C7]">
                  <User className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider leading-none text-slate-400">
                    {session?.user
                      ? "Hello"
                      : "Welcome"}
                  </span>

                  <span className="mt-1.5 block max-w-[115px] truncate text-sm font-bold leading-none text-slate-950">
                    {displayName}
                  </span>
                </span>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 w-[340px] pt-3"
                >
                  <div className={popoverPanelClass}>
                    <div className="border-b border-[#E7EEF3] bg-[#F2F9FC]/60 p-5">
                      {session?.user ? (
                        <>
                          <p className="truncate text-base font-bold text-slate-950">
                            {session.user.name ||
                              "Your account"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {session.user.email}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-bold text-slate-950">
                            Welcome to Baby Konplet
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Sign in for faster checkout,
                            saved items and order tracking.
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                              href="/login"
                              onClick={
                                closeDesktopMenus
                              }
                              className="rounded-xl bg-[#63A0C7] px-4 py-2.5 text-center text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(99,160,199,0.5)] transition hover:bg-[#4F8CB5]"
                            >
                              Sign in
                            </Link>

                            <Link
                              href="/register"
                              onClick={
                                closeDesktopMenus
                              }
                              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:border-[#63A0C7] hover:bg-[#EAF4F8]"
                            >
                              Register
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-3">
                      <SectionLabel>
                        Your account
                      </SectionLabel>

                      <AccountLink
                        href="/account/profile"
                        icon={User}
                        label="My profile"
                        onClick={closeDesktopMenus}
                      />

                      <AccountLink
                        href="/orders"
                        icon={Package}
                        label="My orders"
                        onClick={closeDesktopMenus}
                      />

                      <AccountLink
                        href="/account/wishlist"
                        icon={Heart}
                        label="Wishlist"
                        badge={wishlistCount}
                        onClick={closeDesktopMenus}
                      />

                      {/* <AccountLink
                        href="/notifications"
                        icon={Bell}
                        label="Notifications"
                        badge={notificationCount}
                        onClick={closeDesktopMenus}
                      /> */}

                      <button
                        type="button"
                        onClick={openLocationModal}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        <MapPin className="h-[18px] w-[18px] text-[#63A0C7]" />

                        <span className="flex-1">
                          Saved addresses
                        </span>
                      </button>

                      <div className="my-3 border-t border-[#E7EEF3]" />

                      <SectionLabel>
                        Customer care
                      </SectionLabel>

                      <AccountLink
                        href="/support"
                        icon={CircleHelp}
                        label="Help center"
                        onClick={closeDesktopMenus}
                      />

                      <AccountLink
                        href="/returns"
                        icon={RotateCcw}
                        label="Returns & refunds"
                        onClick={closeDesktopMenus}
                      />

                      {session?.user && (
                        <>
                          <div className="my-3 border-t border-[#E7EEF3]" />

                          <button
                            type="button"
                            onClick={() =>
                              signOut({
                                callbackUrl: "/login",
                              })
                            }
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                          >
                            <LogOut className="h-[18px] w-[18px]" />
                            Sign out
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <HeaderIconLink
              href="/account/wishlist"
              label="Wishlist"
              count={wishlistCount}
              className={iconActionClass}
            >
              <Heart className="h-5 w-5 text-[#63A0C7] hover:text-[#4F8CB5]" />
            </HeaderIconLink>

            {/* Notifications */}
            {/* <HeaderIconLink
              href="/account/notifications"
              label="Notifications"
              count={notificationCount}
              className={iconActionClass}
            >
              <Bell className="h-5 w-5 text-[#63A0C7] hover:text-[#4F8CB5]" />
            </HeaderIconLink> */}

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart${
                cartCount
                  ? `, ${cartCount} items`
                  : ""
              }`}
              className="relative ml-2 flex h-12 cursor-pointer items-center gap-2.5 px-5 text-sm font-bold text-slate-950 transition duration-200 hover:scale-105 hover:text-[#63A0C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5 text-[#63A0C7] hover:text-[#4F8CB5]" />

                {cartCount > 0 && (
                  <span
                    key={cartBadgePopKey}
                    className="cart-increment-badge-anim absolute -right-2 -top-2 z-10"
                  >
                    <CountBadge
                      count={cartCount}
                    />
                  </span>
                )}
              </span>
            </Link>

            <style jsx>{`
              .cart-increment-badge-anim {
                animation: cart-badge-pop 0.3s
                  cubic-bezier(
                    0.2,
                    0.65,
                    0.6,
                    1
                  );
              }

              @keyframes cart-badge-pop {
                0% {
                  transform: scale(1.4);
                  opacity: 0.4;
                }

                60% {
                  transform: scale(1.1);
                  opacity: 1;
                }

                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `}</style>
          </nav>

          {/* Mobile quick actions */}
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Link
              href="/account/wishlist"
              aria-label={`Wishlist${
                wishlistCount
                  ? `, ${wishlistCount} items`
                  : ""
              }`}
              className={iconActionClass}
            >
              <Heart className="h-5 w-5" />

              {wishlistCount > 0 && (
                <CountBadge
                  count={wishlistCount}
                />
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart${
                cartCount
                  ? `, ${cartCount} items`
                  : ""
              }`}
              className={iconActionClass}
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span
                  key={cartBadgePopKey}
                  className="cart-increment-badge-anim"
                >
                  <CountBadge
                    count={cartCount}
                  />
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className={iconActionClass}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-slate-100 px-4 py-3 lg:hidden sm:px-6">
          <form
            action="/products"
            method="GET"
            className="relative"
            role="search"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              name="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, brands and categories"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-12 pr-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#63A0C7] focus:bg-white focus:ring-4 focus:ring-[#63A0C7]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 cursor-pointer bg-slate-950/50 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="relative flex h-full w-[88%] max-w-sm flex-col bg-white shadow-[-24px_0_60px_-15px_rgba(15,23,42,0.25)]"
          >
            <div className="border-b border-slate-100 px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  aria-label="Baby Konplet home"
                  className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
                >
                  <Image
                    src="/favicons/favicon-512x512.png"
                    alt="Baby Konplet"
                    width={100}
                    height={100}
                    className="h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-105"
                  />

                  <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-950">
                    Baby{" "}
                    <span className="text-[#63A0C7]">
                      Konplet
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition duration-200 hover:bg-[#EAF4F8] hover:text-[#63A0C7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2"
                >
                  <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>

              {session?.user && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Signed in as
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-slate-950">
                    {session.user.name ||
                      session.user.email}
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <MobileMenuLink
                href="/"
                icon={Home}
                label="Home"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/products"
                icon={LayoutGrid}
                label="Shop all products"
                onClick={closeMobileMenu}
              />

              <button
                type="button"
                onClick={openLocationModal}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-[#EAF4F8]"
              >
                <MapPin className="h-5 w-5 text-[#63A0C7]" />

                <span className="min-w-0 flex-1">
                  <span className="block">
                    Delivery location
                  </span>

                  <span className="mt-0.5 block truncate text-xs font-normal text-slate-500">
                    {deliveryLabel}
                  </span>
                </span>
              </button>

              <MenuDivider />

              <SectionLabel>
                Your shopping
              </SectionLabel>

              <MobileMenuLink
                href="/profile"
                icon={User}
                label="My profile"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/orders"
                icon={Package}
                label="My orders"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/wishlist"
                icon={Heart}
                label="Wishlist"
                onClick={closeMobileMenu}
                badge={wishlistCount}
              />

              <MobileMenuLink
                href="/notifications"
                icon={Bell}
                label="Notifications"
                onClick={closeMobileMenu}
                badge={notificationCount}
              />

              <MobileMenuLink
                href="/cart"
                icon={ShoppingCart}
                label="Cart"
                onClick={closeMobileMenu}
                badge={cartCount}
              />

              <MenuDivider />

              <SectionLabel>
                Categories
              </SectionLabel>

              <div className="grid grid-cols-2 gap-2 px-1">
                {categoryLinks.map(
                  (category) => (
                    <Link
                      key={category.label}
                      href={category.href}
                      onClick={
                        closeMobileMenu
                      }
                      className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#63A0C7]/40 hover:bg-[#EAF4F8] hover:text-slate-950"
                    >
                      {category.label}
                    </Link>
                  )
                )}
              </div>

              <MenuDivider />

              <SectionLabel>
                Customer care
              </SectionLabel>

              <MobileMenuLink
                href="/support"
                icon={CircleHelp}
                label="Help center"
                onClick={closeMobileMenu}
              />

              <MobileMenuLink
                href="/returns"
                icon={RotateCcw}
                label="Returns & refunds"
                onClick={closeMobileMenu}
              />
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              {session?.user ? (
                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#63A0C7] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(99,160,199,0.5)] transition hover:bg-[#4F8CB5]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[#63A0C7] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(99,160,199,0.5)] transition hover:bg-[#4F8CB5]"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:border-[#63A0C7] hover:bg-[#EAF4F8]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Delivery location modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close delivery location panel"
            onClick={closeLocationModal}
            className="absolute inset-0 cursor-pointer"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-location-title"
            className="relative h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-[-24px_0_60px_-15px_rgba(15,23,42,0.25)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#63A0C7]">
                  Delivery preferences
                </p>

                <h2
                  id="delivery-location-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
                >
                  Select your delivery location
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Baby Konplet currently delivers only
                  within Massachusetts. Enter a ZIP code
                  or use your current location to check
                  availability.
                </p>
              </div>

              <button
                type="button"
                onClick={closeLocationModal}
                className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-[#EAF4F8] hover:text-[#63A0C7]"
                aria-label="Close location panel"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={saveZipCode}
              className="mt-8"
            >
              <label
                htmlFor="delivery-zip"
                className="text-sm font-bold text-slate-950"
              >
                ZIP code
              </label>

              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#63A0C7]" />

                <input
                  ref={locationInputRef}
                  id="delivery-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={zipCode}
                  onChange={(event) => {
                    setZipCode(
                      event.target.value
                    );

                    setLocationError("");
                    setResolvedLocation(null);
                  }}
                  placeholder="Enter ZIP code"
                  maxLength={10}
                  className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-[#63A0C7] focus:ring-4 focus:ring-[#63A0C7]/10"
                />
              </div>

              {locationError && (
                <p
                  role="alert"
                  className="mt-3 flex items-start gap-2 text-sm font-medium text-rose-600"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  {locationError}
                </p>
              )}

              <button
                type="submit"
                disabled={locationLoading}
                className="mt-4 w-full cursor-pointer rounded-xl bg-[#63A0C7] px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(99,160,199,0.5)] transition hover:bg-[#4F8CB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63A0C7] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locationLoading
                  ? "Finding your location..."
                  : "Check Massachusetts delivery"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                or
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locationLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:border-[#63A0C7] hover:bg-[#EAF4F8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LocateFixed
                className={`h-5 w-5 ${
                  locationLoading
                    ? "animate-pulse text-[#63A0C7]"
                    : "text-[#63A0C7]"
                }`}
              />

              {locationLoading
                ? "Finding your address..."
                : "Use my current location"}
            </button>

            {resolvedLocation &&
              (resolvedLocation.deliverable ? (
                <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Delivery available
                      </p>

                      <p className="mt-1 text-base font-bold text-emerald-950">
                        {resolvedLocation.label}
                      </p>

                      {(resolvedLocation.area ||
                        resolvedLocation.city ||
                        resolvedLocation.state) && (
                        <p className="mt-2 text-sm leading-6 text-emerald-800">
                          {[
                            resolvedLocation.area,
                            resolvedLocation.city,
                            resolvedLocation.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}

                      {resolvedLocation.postcode && (
                        <p className="mt-1 text-sm text-emerald-800">
                          ZIP code:{" "}
                          {
                            resolvedLocation.postcode
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      confirmResolvedLocation
                    }
                    className="mt-4 w-full cursor-pointer rounded-xl bg-emerald-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
                  >
                    Deliver to this location
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
                      <AlertCircle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        Delivery not available
                      </p>

                      <p className="mt-1 text-base font-bold text-rose-950">
                        {resolvedLocation.label}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-rose-800">
                        Baby Konplet currently delivers
                        only within Massachusetts.
                        Please enter a Massachusetts ZIP
                        code.
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {deliveryLabel !==
              DEFAULT_DELIVERY_LABEL && (
              <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Current delivery location
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-950">
                  {deliveryLabel}
                </p>

                <button
                  type="button"
                  onClick={clearSavedLocation}
                  className="mt-3 cursor-pointer text-sm font-bold text-emerald-800 underline underline-offset-4 transition hover:text-emerald-950"
                >
                  Remove saved location
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function SectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </p>
  );
}

function MenuDivider() {
  return (
    <div className="my-5 border-t border-slate-100" />
  );
}

function AccountLink({
  href,
  icon: Icon,
  label,
  badge = 0,
  onClick,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
    >
      <Icon className="h-[18px] w-[18px] text-[#63A0C7]" />

      <span className="flex-1">
        {label}
      </span>

      {badge > 0 && (
        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#63A0C7] px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

function HeaderIconLink({
  href,
  label,
  count,
  className,
  children,
}: {
  href: string;
  label: string;
  count: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}${
        count ? `, ${count}` : ""
      }`}
      title={label}
      className={className}
    >
      {children}

      {count > 0 && (
        <CountBadge count={count} />
      )}

      <span className="pointer-events-none absolute top-[calc(100%+8px)] z-50 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}

function CountBadge({
  count,
}: {
  count: number;
}) {
  return (
    <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#63A0C7] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function MobileMenuLink({
  href,
  icon: Icon,
  label,
  onClick,
  badge = 0,
}: {
  href: string;
  icon: IconComponent;
  label: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-[#EAF4F8]"
    >
      <Icon className="h-5 w-5 text-[#63A0C7]" />

      <span className="flex-1">
        {label}
      </span>

      {badge > 0 && (
        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#63A0C7] px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}