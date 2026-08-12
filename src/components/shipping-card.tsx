import {
    Building2,
    Mail,
    MapPin,
    PackageSearch,
    Phone,
    Truck,
    UserRound,
  } from "lucide-react";
  
  type ShippingDetails = {
    name: string;
    email: string;
    phone: string;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    trackingNumber: string | null;
    carrier: string | null;
  };
  
  type Props = {
    shipping: ShippingDetails;
  };
  
  function buildLocationLine(shipping: ShippingDetails) {
    return [
      shipping.city,
      shipping.state,
      shipping.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }
  
  function formatCountry(country: string | null) {
    if (!country) {
      return "";
    }
  
    const normalized = country.trim().toUpperCase();
  
    const countryNames: Record<string, string> = {
      US: "United States",
      USA: "United States",
      IN: "India",
      IND: "India",
      CA: "Canada",
      CAN: "Canada",
      GB: "United Kingdom",
      UK: "United Kingdom",
    };
  
    return countryNames[normalized] || country;
  }
  
  export default function ShippingCard({
    shipping,
  }: Props) {
    const locationLine = buildLocationLine(shipping);
    const country = formatCountry(shipping.country);
  
    const hasAddress = Boolean(
      shipping.addressLine1 ||
        shipping.city ||
        shipping.state ||
        shipping.postalCode ||
        shipping.country
    );
  
    const hasTracking = Boolean(shipping.trackingNumber);
  
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Shipping details
            </h2>
  
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Delivery address and shipment information.
            </p>
          </div>
  
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Truck className="h-5 w-5" />
          </span>
        </div>
  
        <div className="p-5 sm:p-6">
          {/* Recipient */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Recipient
            </p>
  
            <div className="mt-3 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <UserRound className="h-4 w-4" />
              </span>
  
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950">
                  {shipping.name || "Customer"}
                </p>
  
                <p className="mt-1 text-sm text-slate-500">
                  Delivery recipient
                </p>
              </div>
            </div>
          </div>
  
          {/* Address */}
          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Delivery address
            </p>
  
            {hasAddress ? (
              <div className="mt-3 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <MapPin className="h-4 w-4" />
                </span>
  
                <address className="min-w-0 not-italic text-sm leading-6 text-slate-700">
                  {shipping.addressLine1 ? (
                    <div className="font-semibold text-slate-950">
                      {shipping.addressLine1}
                    </div>
                  ) : null}
  
                  {shipping.addressLine2 ? (
                    <div>{shipping.addressLine2}</div>
                  ) : null}
  
                  {locationLine ? <div>{locationLine}</div> : null}
  
                  {country ? <div>{country}</div> : null}
                </address>
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  Shipping address unavailable
                </p>
  
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  No delivery address was stored for this order.
                </p>
              </div>
            )}
          </div>
  
          {/* Contact */}
          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Contact information
            </p>
  
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Mail className="h-4 w-4" />
                </span>
  
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    Email
                  </p>
  
                  <p className="mt-0.5 break-all text-sm font-semibold text-slate-900">
                    {shipping.email || "Not available"}
                  </p>
                </div>
              </div>
  
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Phone className="h-4 w-4" />
                </span>
  
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Phone
                  </p>
  
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {shipping.phone || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Shipment */}
          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Shipment
            </p>
  
            {hasTracking ? (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <PackageSearch className="h-5 w-5" />
                  </span>
  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-blue-950">
                      Tracking information available
                    </p>
  
                    <dl className="mt-3 space-y-2">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                        <dt className="text-xs font-semibold text-blue-700">
                          Carrier
                        </dt>
  
                        <dd className="text-sm font-bold text-blue-950">
                          {shipping.carrier || "Shipping carrier"}
                        </dd>
                      </div>
  
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                        <dt className="text-xs font-semibold text-blue-700">
                          Tracking number
                        </dt>
  
                        <dd className="break-all text-sm font-bold text-blue-950">
                          {shipping.trackingNumber}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
  
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Tracking not available yet
                  </p>
  
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Carrier and tracking details will appear after the
                    order is prepared for shipment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }