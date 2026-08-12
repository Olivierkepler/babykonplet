"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

type ContactErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

type AddressErrors = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

const checkoutSteps = [
  {
    number: 1 as Step,
    label: "Contact",
    icon: UserRound,
  },
  {
    number: 2 as Step,
    label: "Address",
    icon: MapPin,
  },
  {
    number: 3 as Step,
    label: "Payment",
    icon: CreditCard,
  },
  {
    number: 4 as Step,
    label: "Review",
    icon: PackageCheck,
  },
];

export default function CheckoutForm() {
  const [currentStep, setCurrentStep] =
    useState<Step>(1);

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [contactErrors, setContactErrors] =
    useState<ContactErrors>({});

  const [addressErrors, setAddressErrors] =
    useState<AddressErrors>({});

  function validateContact() {
    const errors: ContactErrors = {};

    if (!contact.firstName.trim()) {
      errors.firstName =
        "First name is required.";
    }

    if (!contact.lastName.trim()) {
      errors.lastName =
        "Last name is required.";
    }

    if (!contact.email.trim()) {
      errors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        contact.email.trim(),
      )
    ) {
      errors.email =
        "Enter a valid email address.";
    }

    if (!contact.phone.trim()) {
      errors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9+\-().\s]{7,20}$/.test(
        contact.phone.trim(),
      )
    ) {
      errors.phone =
        "Enter a valid phone number.";
    }

    setContactErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function validateAddress() {
    const errors: AddressErrors = {};

    if (!address.street.trim()) {
      errors.street =
        "Street address is required.";
    }

    if (!address.city.trim()) {
      errors.city = "City is required.";
    }

    if (!address.state.trim()) {
      errors.state = "State is required.";
    }

    if (!address.zip.trim()) {
      errors.zip =
        "ZIP code is required.";
    } else if (
      !/^[A-Za-z0-9 -]{3,10}$/.test(
        address.zip.trim(),
      )
    ) {
      errors.zip =
        "Enter a valid ZIP code.";
    }

    if (!address.country.trim()) {
      errors.country =
        "Country is required.";
    }

    setAddressErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function continueToAddress() {
    if (!validateContact()) {
      return;
    }

    setCurrentStep(2);
  }

  function continueToPayment() {
    if (!validateAddress()) {
      return;
    }

    setCurrentStep(3);
  }

  function continueToReview() {
    const contactIsValid =
      validateContact();

    if (!contactIsValid) {
      setCurrentStep(1);
      return;
    }

    const addressIsValid =
      validateAddress();

    if (!addressIsValid) {
      setCurrentStep(2);
      return;
    }

    setCurrentStep(4);
  }

  function openStep(targetStep: Step) {
    if (targetStep === 1) {
      setCurrentStep(1);
      return;
    }

    if (targetStep === 2) {
      if (!validateContact()) {
        setCurrentStep(1);
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (targetStep === 3) {
      if (!validateContact()) {
        setCurrentStep(1);
        return;
      }

      if (!validateAddress()) {
        setCurrentStep(2);
        return;
      }

      setCurrentStep(3);
      return;
    }

    continueToReview();
  }

  const baseInputClass =
    "h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4";

  const inputClass =
    `${baseInputClass} border-slate-300 focus:border-slate-950 focus:ring-slate-950/10`;

  const errorInputClass =
    `${baseInputClass} border-red-400 focus:border-red-600 focus:ring-red-100`;

  const primaryButtonClass =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/15";

  const secondaryButtonClass =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

  const contactCompleted =
    Boolean(contact.firstName.trim()) &&
    Boolean(contact.lastName.trim()) &&
    Boolean(contact.email.trim()) &&
    Boolean(contact.phone.trim()) &&
    currentStep > 1;

  const addressCompleted =
    Boolean(address.street.trim()) &&
    Boolean(address.city.trim()) &&
    Boolean(address.state.trim()) &&
    Boolean(address.zip.trim()) &&
    Boolean(address.country.trim()) &&
    currentStep > 2;

  const paymentCompleted =
    currentStep > 3;

  return (
    <div className="space-y-5">
      {/* CHECKOUT PROGRESS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Checkout progress
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-950">
              Step {currentStep} of 4
            </h2>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {Math.round(
              (currentStep / 4) * 100,
            )}
            %
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-0.5 bg-slate-200 sm:block" />

          <div
            className="absolute left-[12.5%] top-5 hidden h-0.5 bg-slate-950 transition-all duration-300 sm:block"
            style={{
              width:
                currentStep === 1
                  ? "0%"
                  : currentStep === 2
                    ? "25%"
                    : currentStep === 3
                      ? "50%"
                      : "75%",
            }}
          />

          <div className="relative grid grid-cols-4 gap-2">
            {checkoutSteps.map(
              (checkoutStep) => {
                const Icon =
                  checkoutStep.icon;

                const isActive =
                  checkoutStep.number ===
                  currentStep;

                const isCompleted =
                  checkoutStep.number <
                  currentStep;

                return (
                  <button
                    key={checkoutStep.number}
                    type="button"
                    onClick={() =>
                      openStep(
                        checkoutStep.number,
                      )
                    }
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        isCompleted
                          ? "border-slate-950 bg-slate-950 text-white"
                          : isActive
                            ? "border-slate-950 bg-white text-slate-950 shadow-sm"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        isActive ||
                        isCompleted
                          ? "text-slate-950"
                          : "text-slate-400"
                      }`}
                    >
                      {checkoutStep.label}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* STEP 1: CONTACT */}
      <section
        className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
          currentStep === 1
            ? "border-slate-950/20 ring-1 ring-slate-950/5"
            : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={() =>
            setCurrentStep(1)
          }
          className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left sm:px-6"
        >
          <div className="flex min-w-0 gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                contactCompleted
                  ? "bg-emerald-100 text-emerald-700"
                  : currentStep === 1
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {contactCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <UserRound className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Step 1
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                Contact information
              </h2>

              {currentStep !== 1 &&
              contact.email ? (
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {contact.firstName}{" "}
                    {contact.lastName}
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {contact.email}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    {contact.phone}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Enter your contact details for
                  receipts and order updates.
                </p>
              )}
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {currentStep === 1
              ? "Active"
              : contactCompleted
                ? "Edit"
                : "Open"}
          </span>
        </button>

        {currentStep === 1 ? (
          <div className="border-t border-slate-200 px-5 pb-6 pt-5 sm:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="checkout-first-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  First name
                </label>

                <input
                  id="checkout-first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter first name"
                  value={contact.firstName}
                  onChange={(event) => {
                    setContact((previous) => ({
                      ...previous,
                      firstName:
                        event.target.value,
                    }));

                    setContactErrors(
                      (previous) => ({
                        ...previous,
                        firstName: undefined,
                      }),
                    );
                  }}
                  className={
                    contactErrors.firstName
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.firstName ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {
                      contactErrors.firstName
                    }
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-last-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Last name
                </label>

                <input
                  id="checkout-last-name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  value={contact.lastName}
                  onChange={(event) => {
                    setContact((previous) => ({
                      ...previous,
                      lastName:
                        event.target.value,
                    }));

                    setContactErrors(
                      (previous) => ({
                        ...previous,
                        lastName: undefined,
                      }),
                    );
                  }}
                  className={
                    contactErrors.lastName
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.lastName ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {
                      contactErrors.lastName
                    }
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={contact.email}
                  onChange={(event) => {
                    setContact((previous) => ({
                      ...previous,
                      email:
                        event.target.value,
                    }));

                    setContactErrors(
                      (previous) => ({
                        ...previous,
                        email: undefined,
                      }),
                    );
                  }}
                  className={
                    contactErrors.email
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.email ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {contactErrors.email}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Your receipt and order updates
                    will be sent here.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 617 555 0123"
                  value={contact.phone}
                  onChange={(event) => {
                    setContact((previous) => ({
                      ...previous,
                      phone:
                        event.target.value,
                    }));

                    setContactErrors(
                      (previous) => ({
                        ...previous,
                        phone: undefined,
                      }),
                    );
                  }}
                  className={
                    contactErrors.phone
                      ? errorInputClass
                      : inputClass
                  }
                />

                {contactErrors.phone ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {contactErrors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={
                  continueToAddress
                }
                className={`${primaryButtonClass} w-full sm:w-auto`}
              >
                Save and continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 2: SHIPPING */}
      <section
        className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
          currentStep === 2
            ? "border-slate-950/20 ring-1 ring-slate-950/5"
            : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={() => openStep(2)}
          className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left sm:px-6"
        >
          <div className="flex min-w-0 gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                addressCompleted
                  ? "bg-emerald-100 text-emerald-700"
                  : currentStep === 2
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {addressCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Step 2
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                Shipping address
              </h2>

              {currentStep !== 2 &&
              address.street ? (
                <div className="mt-3 text-sm leading-6 text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {address.street}
                    {address.apartment
                      ? `, ${address.apartment}`
                      : ""}
                  </p>

                  <p>
                    {address.city},{" "}
                    {address.state}{" "}
                    {address.zip}
                  </p>

                  <p>{address.country}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Enter the address where your
                  order should be delivered.
                </p>
              )}
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {currentStep === 2
              ? "Active"
              : addressCompleted
                ? "Edit"
                : "Open"}
          </span>
        </button>

        {currentStep === 2 ? (
          <div className="border-t border-slate-200 px-5 pb-6 pt-5 sm:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-street"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Street address
                </label>

                <input
                  id="checkout-street"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={(event) => {
                    setAddress((previous) => ({
                      ...previous,
                      street:
                        event.target.value,
                    }));

                    setAddressErrors(
                      (previous) => ({
                        ...previous,
                        street: undefined,
                      }),
                    );
                  }}
                  className={
                    addressErrors.street
                      ? errorInputClass
                      : inputClass
                  }
                />

                {addressErrors.street ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {addressErrors.street}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-apartment"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Apartment, suite, etc.
                  <span className="ml-1 font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  id="checkout-apartment"
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Apartment 4B"
                  value={address.apartment}
                  onChange={(event) =>
                    setAddress(
                      (previous) => ({
                        ...previous,
                        apartment:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="checkout-city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Boston"
                  value={address.city}
                  onChange={(event) => {
                    setAddress((previous) => ({
                      ...previous,
                      city:
                        event.target.value,
                    }));

                    setAddressErrors(
                      (previous) => ({
                        ...previous,
                        city: undefined,
                      }),
                    );
                  }}
                  className={
                    addressErrors.city
                      ? errorInputClass
                      : inputClass
                  }
                />

                {addressErrors.city ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {addressErrors.city}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-state"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  State / Province
                </label>

                <input
                  id="checkout-state"
                  type="text"
                  autoComplete="address-level1"
                  placeholder="Massachusetts"
                  value={address.state}
                  onChange={(event) => {
                    setAddress((previous) => ({
                      ...previous,
                      state:
                        event.target.value,
                    }));

                    setAddressErrors(
                      (previous) => ({
                        ...previous,
                        state: undefined,
                      }),
                    );
                  }}
                  className={
                    addressErrors.state
                      ? errorInputClass
                      : inputClass
                  }
                />

                {addressErrors.state ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {addressErrors.state}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-zip"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  ZIP / Postal code
                </label>

                <input
                  id="checkout-zip"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="02125"
                  value={address.zip}
                  onChange={(event) => {
                    setAddress((previous) => ({
                      ...previous,
                      zip:
                        event.target.value,
                    }));

                    setAddressErrors(
                      (previous) => ({
                        ...previous,
                        zip: undefined,
                      }),
                    );
                  }}
                  className={
                    addressErrors.zip
                      ? errorInputClass
                      : inputClass
                  }
                />

                {addressErrors.zip ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {addressErrors.zip}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-country"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Country
                </label>

                <input
                  id="checkout-country"
                  type="text"
                  autoComplete="country-name"
                  placeholder="United States"
                  value={address.country}
                  onChange={(event) => {
                    setAddress((previous) => ({
                      ...previous,
                      country:
                        event.target.value,
                    }));

                    setAddressErrors(
                      (previous) => ({
                        ...previous,
                        country: undefined,
                      }),
                    );
                  }}
                  className={
                    addressErrors.country
                      ? errorInputClass
                      : inputClass
                  }
                />

                {addressErrors.country ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {
                      addressErrors.country
                    }
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  setCurrentStep(1)
                }
                className={
                  secondaryButtonClass
                }
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={
                  continueToPayment
                }
                className={
                  primaryButtonClass
                }
              >
                Continue to payment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 3: PAYMENT */}
      <section
        className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
          currentStep === 3
            ? "border-slate-950/20 ring-1 ring-slate-950/5"
            : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={() => openStep(3)}
          className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left sm:px-6"
        >
          <div className="flex min-w-0 gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                paymentCompleted
                  ? "bg-emerald-100 text-emerald-700"
                  : currentStep === 3
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {paymentCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Step 3
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                Payment method
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Credit or debit card
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {currentStep === 3
              ? "Active"
              : paymentCompleted
                ? "Edit"
                : "Open"}
          </span>
        </button>

        {currentStep === 3 ? (
          <div className="border-t border-slate-200 px-5 pb-6 pt-5 sm:px-6">
            <div className="overflow-hidden rounded-2xl border-2 border-slate-950 bg-white">
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">
                        Credit / Debit Card
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Pay securely using your
                        card
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[
                        "VISA",
                        "MC",
                        "AMEX",
                      ].map((card) => (
                        <span
                          key={card}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-600"
                        >
                          {card}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800">
                    <LockKeyhole className="h-4 w-4" />
                    Payment information is
                    encrypted
                  </div>
                </div>

                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked
                  readOnly
                  aria-label="Credit or debit card"
                  className="mt-1 h-4 w-4 accent-slate-950"
                />
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                  <p className="text-xs leading-5 text-slate-600">
                    You will review your order
                    before payment is submitted.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  setCurrentStep(2)
                }
                className={
                  secondaryButtonClass
                }
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={
                  continueToReview
                }
                className={
                  primaryButtonClass
                }
              >
                Review your order
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/* STEP 4: REVIEW */}
      <section
        className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
          currentStep === 4
            ? "border-slate-950/20 ring-1 ring-slate-950/5"
            : "border-slate-200"
        }`}
      >
        <button
          type="button"
          onClick={
            continueToReview
          }
          className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left sm:px-6"
        >
          <div className="flex min-w-0 gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                currentStep === 4
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <PackageCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Step 4
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                Review order
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Confirm your details before
                placing the order.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {currentStep === 4
              ? "Active"
              : "Open"}
          </span>
        </button>

        {currentStep === 4 ? (
          <div className="border-t border-slate-200 px-5 pb-6 pt-5 sm:px-6">
            <div className="grid gap-4">
              <ReviewCard
                icon={UserRound}
                title="Contact"
                onEdit={() =>
                  setCurrentStep(1)
                }
              >
                <p className="font-bold text-slate-950">
                  {contact.firstName}{" "}
                  {contact.lastName}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {contact.email}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {contact.phone}
                </p>
              </ReviewCard>

              <ReviewCard
                icon={MapPin}
                title="Shipping address"
                onEdit={() =>
                  setCurrentStep(2)
                }
              >
                <p className="font-bold text-slate-950">
                  {address.street}
                  {address.apartment
                    ? `, ${address.apartment}`
                    : ""}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {address.city},{" "}
                  {address.state}{" "}
                  {address.zip}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {address.country}
                </p>
              </ReviewCard>

              <ReviewCard
                icon={CreditCard}
                title="Payment"
                onEdit={() =>
                  setCurrentStep(3)
                }
              >
                <p className="font-bold text-slate-950">
                  Credit / Debit Card
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <LockKeyhole className="h-4 w-4" />
                  Secure payment
                </p>
              </ReviewCard>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <p className="text-sm font-bold text-emerald-950">
                    Ready for final
                    confirmation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    Review your order
                    summary and total before
                    placing the order.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  setCurrentStep(3)
                }
                className={
                  secondaryButtonClass
                }
              >
                <ArrowLeft className="h-4 w-4" />
                Back to payment
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

type ReviewCardProps = {
  icon: typeof UserRound;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
};

function ReviewCard({
  icon: Icon,
  title,
  onEdit,
  children,
}: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {title}
            </p>

            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm font-bold text-slate-700 transition hover:text-slate-950"
        >
          Edit
        </button>
      </div>
    </div>
  );
}