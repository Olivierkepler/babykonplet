export const CUSTOM_LINK_VALUE = "__custom__";

// Mirrors the real destinations used across the storefront
// (category pages, section anchors, and top-level routes) so
// admins pick a link that's guaranteed to exist rather than
// hand-typing a path that might not match a real route.
export const linkOptions = [
  {
    group: "Category pages",
    options: [
      { value: "/products?category=women", label: "Women" },
      { value: "/products?category=men", label: "Men" },
      { value: "/products?category=beauty", label: "Beauty" },
      { value: "/products?category=hair-care", label: "Hair Care" },
      { value: "/products?category=shoes", label: "Shoes" },
      { value: "/products?category=bags", label: "Bags" },
      { value: "/products?category=food-grocery", label: "Food & Grocery" },
      { value: "/products?category=home-essentials", label: "Home Essentials" },
      { value: "/products?category=kitchen", label: "Kitchen" },
      { value: "/products?category=cleaning", label: "Cleaning" },
      { value: "/products?category=wigs", label: "Wigs" },
      { value: "/products?category=personal-care", label: "Personal Care" },
    ],
  },
  {
    group: "Section pages",
    options: [
      { value: "/beauty-and-hair-care", label: "Beauty & Hair Care" },
      { value: "/fashion-finds", label: "Fashion Finds" },
      { value: "/food-and-grocery", label: "Food & Grocery (section)" },
      { value: "/home-essentials", label: "Home Essentials (section)" },
    ],
  },
  {
    group: "Storefront",
    options: [
      { value: "/products", label: "All products" },
      { value: "/products?section=discover", label: "Discover DJADOR" },
    ],
  },
];

export const allKnownLinkValues = new Set(
  linkOptions.flatMap((group) => group.options.map((o) => o.value))
);