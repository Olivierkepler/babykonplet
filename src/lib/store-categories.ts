export type StoreCategory = {
    label: string;
    slug: string;
    subCategories: string[];
  };
  
  export const STORE_CATEGORIES: StoreCategory[] = [
    {
      label: "Women",
      slug: "women",
      subCategories: [
        "Dresses",
        "Skirts",
        "Tops",
        "Pants",
        "Jeans",
        "Bras",
        "Lingerie",
        "Jackets",
        "Ethnic Wear",
      ],
    },
    {
      label: "Men",
      slug: "men",
      subCategories: [
        "Shirts",
        "T-Shirts",
        "Pants",
        "Jeans",
        "Shorts",
        "Jackets",
        "Suits",
      ],
    },
    {
      label: "Beauty",
      slug: "beauty",
      subCategories: [
        "Makeup",
        "Foundation",
        "Lipstick",
        "Perfume",
        "Skin Care",
      ],
    },
    {
      label: "Hair Care",
      slug: "hair-care",
      subCategories: [
        "Shampoo",
        "Conditioner",
        "Hair Oil",
        "Hair Mask",
        "Hair Serum",
      ],
    },
    {
      label: "Shoes",
      slug: "shoes",
      subCategories: [
        "Sneakers",
        "Boots",
        "Sandals",
        "Heels",
        "Sports Shoes",
      ],
    },
    {
      label: "Bags",
      slug: "bags",
      subCategories: [
        "Handbags",
        "Backpacks",
        "Travel Bags",
        "Wallets",
      ],
    },
    {
      label: "Food & Grocery",
      slug: "food-grocery",
      subCategories: [
        "Rice",
        "Snacks",
        "Beverages",
        "Spices",
      ],
    },
    {
      label: "Home Essentials",
      slug: "home-essentials",
      subCategories: [
        "Bedding",
        "Storage",
        "Decor",
        "Furniture",
      ],
    },
    {
      label: "Kitchen",
      slug: "kitchen",
      subCategories: [
        "Cookware",
        "Utensils",
        "Knives",
        "Storage",
      ],
    },
    {
      label: "Cleaning",
      slug: "cleaning",
      subCategories: [
        "Laundry",
        "Surface Cleaner",
        "Bathroom Cleaner",
      ],
    },
    {
      label: "Personal Care",
      slug: "personal-care",
      subCategories: [
        "Body Wash",
        "Soap",
        "Deodorant",
        "Oral Care",
      ],
    },
    {
      label: "Wigs",
      slug: "wigs",
      subCategories: [
        "Straight",
        "Curly",
        "Bob",
        "Lace Front",
      ],
    },
  ];
  
  export function getCategoryLabel(slug?: string | null) {
    const category = STORE_CATEGORIES.find(
      (item) => item.slug === slug
    );
  
    return category?.label || "Uncategorized";
  }