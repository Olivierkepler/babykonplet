export type FilterOption = {
    name: string;
    value: string;
    count: number;
  };
  
  export type StorefrontSubcategory = {
    name: string;
    value: string;
  };
  
  export type StorefrontCategory = {
    name: string;
    value: string;
    subcategories: StorefrontSubcategory[];
  };
  
  /**
   * Shared category structure used by the customer storefront.
   */
  export const STOREFRONT_CATEGORIES: StorefrontCategory[] = [
    {
      name: "Women",
      value: "women",
      subcategories: [
        { name: "Dresses", value: "dresses" },
        { name: "Skirts", value: "skirts" },
        { name: "Tops", value: "tops" },
        { name: "Pants", value: "pants" },
        { name: "Jeans", value: "jeans" },
        { name: "Bras", value: "bras" },
        { name: "Lingerie", value: "lingerie" },
        { name: "Jackets", value: "jackets" },
        { name: "Ethnic Wear", value: "ethnic-wear" },
      ],
    },
    {
      name: "Men",
      value: "men",
      subcategories: [
        { name: "Shirts", value: "shirts" },
        { name: "T-Shirts", value: "t-shirts" },
        { name: "Pants", value: "pants" },
        { name: "Jeans", value: "jeans" },
        { name: "Jackets", value: "jackets" },
        { name: "Suits", value: "suits" },
        { name: "Ethnic Wear", value: "ethnic-wear" },
      ],
    },
    {
      name: "Beauty",
      value: "beauty",
      subcategories: [
        { name: "Makeup", value: "makeup" },
        { name: "Skincare", value: "skincare" },
        { name: "Fragrance", value: "fragrance" },
        { name: "Nail Care", value: "nail-care" },
      ],
    },
    {
      name: "Hair Care",
      value: "hair-care",
      subcategories: [
        { name: "Shampoo", value: "shampoo" },
        { name: "Conditioner", value: "conditioner" },
        { name: "Hair Oil", value: "hair-oil" },
        { name: "Hair Styling", value: "hair-styling" },
        { name: "Hair Treatment", value: "hair-treatment" },
      ],
    },
    {
      name: "Shoes",
      value: "shoes",
      subcategories: [
        { name: "Sneakers", value: "sneakers" },
        { name: "Running Shoes", value: "running-shoes" },
        { name: "Sandals", value: "sandals" },
        { name: "Heels", value: "heels" },
        { name: "Boots", value: "boots" },
      ],
    },
    {
      name: "Bags",
      value: "bags",
      subcategories: [
        { name: "Handbags", value: "handbags" },
        { name: "Shoulder Bags", value: "shoulder-bags" },
        { name: "Backpacks", value: "backpacks" },
        { name: "Travel Bags", value: "travel-bags" },
        { name: "Wallets", value: "wallets" },
      ],
    },
    {
      name: "Food & Grocery",
      value: "food-and-grocery",
      subcategories: [
        { name: "Snacks", value: "snacks" },
        { name: "Cookies", value: "cookies" },
        { name: "Drinks", value: "drinks" },
        { name: "Rice & Grains", value: "rice-and-grains" },
        { name: "Lentils", value: "lentils" },
      ],
    },
    {
      name: "Home Essentials",
      value: "home-essentials",
      subcategories: [
        { name: "Home Decor", value: "home-decor" },
        { name: "Storage", value: "storage" },
        { name: "Bathroom", value: "bathroom" },
        { name: "Bedroom", value: "bedroom" },
      ],
    },
    {
      name: "Kitchen",
      value: "kitchen",
      subcategories: [
        { name: "Cookware", value: "cookware" },
        { name: "Bakeware", value: "bakeware" },
        { name: "Kitchen Tools", value: "kitchen-tools" },
        { name: "Dining", value: "dining" },
        { name: "Food Storage", value: "food-storage" },
      ],
    },
    {
      name: "Cleaning",
      value: "cleaning",
      subcategories: [
        { name: "Laundry", value: "laundry" },
        {
          name: "Surface Cleaners",
          value: "surface-cleaners",
        },
        { name: "Dishwashing", value: "dishwashing" },
        {
          name: "Cleaning Tools",
          value: "cleaning-tools",
        },
      ],
    },
    {
      name: "Wigs",
      value: "wigs",
      subcategories: [
        {
          name: "Human Hair Wigs",
          value: "human-hair-wigs",
        },
        {
          name: "Synthetic Wigs",
          value: "synthetic-wigs",
        },
        {
          name: "Lace Front Wigs",
          value: "lace-front-wigs",
        },
        { name: "Short Wigs", value: "short-wigs" },
        { name: "Long Wigs", value: "long-wigs" },
      ],
    },
    {
      name: "Personal Care",
      value: "personal-care",
      subcategories: [
        { name: "Body Care", value: "body-care" },
        { name: "Deodorant", value: "deodorant" },
        { name: "Oral Care", value: "oral-care" },
        {
          name: "Feminine Care",
          value: "feminine-care",
        },
        {
          name: "Men's Grooming",
          value: "mens-grooming",
        },
      ],
    },
  ];
  
  export function normalizeStorefrontValue(
    value?: string | null,
  ): string {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  
  export function formatStorefrontLabel(
    value: string,
  ): string {
    return value
      .replace(/-/g, " ")
      .replace(/\band\b/g, "&")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }
  
  const CATEGORY_ALIASES: Record<string, string> = {
    women: "women",
    woman: "women",
    womens: "women",
    "womens-fashion": "women",
    "fashion-finds": "women",
    cuties: "women",
  
    men: "men",
    man: "men",
    mens: "men",
    "mens-fashion": "men",
  
    beauty: "beauty",
    "beauty-and-hair": "beauty",
    "beauty-and-hair-care": "beauty",
  
    hair: "hair-care",
    "hair-care": "hair-care",
    "readymate-hair": "hair-care",
  
    shoe: "shoes",
    shoes: "shoes",
    sneaker: "shoes",
    sneakers: "shoes",
  
    bag: "bags",
    bags: "bags",
    handbag: "bags",
    handbags: "bags",
    "shoulder-bag": "bags",
    "shoulder-bags": "bags",
  
    food: "food-and-grocery",
    grocery: "food-and-grocery",
    groceries: "food-and-grocery",
    "food-and-grocery": "food-and-grocery",
    cookie: "food-and-grocery",
    cookies: "food-and-grocery",
    reeses: "food-and-grocery",
    lentil: "food-and-grocery",
    lentils: "food-and-grocery",
    fritos: "food-and-grocery",
  
    home: "home-essentials",
    "home-essentials": "home-essentials",
  
    kitchen: "kitchen",
    cleaning: "cleaning",
  
    wig: "wigs",
    wigs: "wigs",
  
    "personal-care": "personal-care",
  };
  
  export function resolveStorefrontCategory(
    rawCategory?: string | null,
  ): string | null {
    const normalizedCategory =
      normalizeStorefrontValue(rawCategory);
  
    if (!normalizedCategory) {
      return null;
    }
  
    return CATEGORY_ALIASES[normalizedCategory] ?? null;
  }
  
  export function getStorefrontCategory(
    categoryValue?: string | null,
  ): StorefrontCategory | undefined {
    const normalizedValue =
      normalizeStorefrontValue(categoryValue);
  
    return STOREFRONT_CATEGORIES.find(
      (category) =>
        category.value === normalizedValue,
    );
  }
  
  const SUBCATEGORY_ALIASES: Record<string, string> = {
    // Women
    dress: "dresses",
    dresses: "dresses",
    gown: "dresses",
    gowns: "dresses",
    "ball-gown": "dresses",
    "ball-gowns": "dresses",
    "princess-dress": "dresses",
    "princess-dresses": "dresses",
  
    skirt: "skirts",
    skirts: "skirts",
    skrit: "skirts",
    skrits: "skirts",
  
    top: "tops",
    tops: "tops",
    blouse: "tops",
    blouses: "tops",
  
    pant: "pants",
    pants: "pants",
    trouser: "pants",
    trousers: "pants",
  
    jean: "jeans",
    jeans: "jeans",
  
    bra: "bras",
    bras: "bras",
  
    lingerie: "lingerie",
  
    jacket: "jackets",
    jackets: "jackets",
    coat: "jackets",
    coats: "jackets",
  
    ethnic: "ethnic-wear",
    "ethnic-wear": "ethnic-wear",
  
    // Men
    shirt: "shirts",
    shirts: "shirts",
  
    tshirt: "t-shirts",
    tshirts: "t-shirts",
    "t-shirt": "t-shirts",
    "t-shirts": "t-shirts",
  
    suit: "suits",
    suits: "suits",
  
    // Beauty
    makeup: "makeup",
    cosmetics: "makeup",
  
    skincare: "skincare",
    "skin-care": "skincare",
  
    perfume: "fragrance",
    perfumes: "fragrance",
    fragrance: "fragrance",
    fragrances: "fragrance",
  
    "nail-care": "nail-care",
    nails: "nail-care",
  
    // Hair Care
    shampoo: "shampoo",
    shampoos: "shampoo",
  
    conditioner: "conditioner",
    conditioners: "conditioner",
  
    "hair-oil": "hair-oil",
    "hair-oils": "hair-oil",
  
    "hair-styling": "hair-styling",
    styling: "hair-styling",
  
    "hair-treatment": "hair-treatment",
    "hair-treatments": "hair-treatment",
  
    // Shoes
    sneaker: "sneakers",
    sneakers: "sneakers",
  
    "running-shoe": "running-shoes",
    "running-shoes": "running-shoes",
  
    sandal: "sandals",
    sandals: "sandals",
  
    heel: "heels",
    heels: "heels",
  
    boot: "boots",
    boots: "boots",
  
    // Bags
    handbag: "handbags",
    handbags: "handbags",
  
    "shoulder-bag": "shoulder-bags",
    "shoulder-bags": "shoulder-bags",
  
    backpack: "backpacks",
    backpacks: "backpacks",
  
    "travel-bag": "travel-bags",
    "travel-bags": "travel-bags",
  
    wallet: "wallets",
    wallets: "wallets",
  
    // Food
    snack: "snacks",
    snacks: "snacks",
  
    cookie: "cookies",
    cookies: "cookies",
  
    drink: "drinks",
    drinks: "drinks",
    beverage: "drinks",
    beverages: "drinks",
  
    rice: "rice-and-grains",
    grain: "rice-and-grains",
    grains: "rice-and-grains",
    "rice-and-grains": "rice-and-grains",
  
    lentil: "lentils",
    lentils: "lentils",
  
    // Home
    decor: "home-decor",
    "home-decor": "home-decor",
  
    storage: "storage",
    bathroom: "bathroom",
    bedroom: "bedroom",
  
    // Kitchen
    cookware: "cookware",
    bakeware: "bakeware",
  
    "kitchen-tool": "kitchen-tools",
    "kitchen-tools": "kitchen-tools",
  
    dining: "dining",
    "food-storage": "food-storage",
  
    // Cleaning
    laundry: "laundry",
  
    "surface-cleaner": "surface-cleaners",
    "surface-cleaners": "surface-cleaners",
  
    dishwashing: "dishwashing",
    dishwasher: "dishwashing",
  
    "cleaning-tool": "cleaning-tools",
    "cleaning-tools": "cleaning-tools",
  
    // Wigs
    "human-hair-wig": "human-hair-wigs",
    "human-hair-wigs": "human-hair-wigs",
  
    "synthetic-wig": "synthetic-wigs",
    "synthetic-wigs": "synthetic-wigs",
  
    "lace-front-wig": "lace-front-wigs",
    "lace-front-wigs": "lace-front-wigs",
  
    "short-wig": "short-wigs",
    "short-wigs": "short-wigs",
  
    "long-wig": "long-wigs",
    "long-wigs": "long-wigs",
  
    // Personal Care
    "body-care": "body-care",
  
    deodorant: "deodorant",
    deodorants: "deodorant",
  
    "oral-care": "oral-care",
    "feminine-care": "feminine-care",
  
    "mens-grooming": "mens-grooming",
    "men-s-grooming": "mens-grooming",
  };
  
  /**
   * This export is required by:
   * src/app/products/page.tsx
   */
  export function resolveStorefrontSubcategory(
    rawSubcategory?: string | null,
  ): string | null {
    const normalizedValue =
      normalizeStorefrontValue(rawSubcategory);
  
    if (!normalizedValue) {
      return null;
    }
  
    const exactMatch =
      SUBCATEGORY_ALIASES[normalizedValue];
  
    if (exactMatch) {
      return exactMatch;
    }
  
    const aliases = Object.entries(
      SUBCATEGORY_ALIASES,
    ).sort(
      ([firstAlias], [secondAlias]) =>
        secondAlias.length - firstAlias.length,
    );
  
    for (const [alias, officialValue] of aliases) {
      if (
        normalizedValue === alias ||
        normalizedValue.startsWith(`${alias}-`) ||
        normalizedValue.endsWith(`-${alias}`) ||
        normalizedValue.includes(`-${alias}-`)
      ) {
        return officialValue;
      }
    }
  
    return normalizedValue;
  }
  
  const BRAND_ALIASES: Record<
    string,
    {
      name: string;
      value: string;
    }
  > = {
    "saint-lauren": {
      name: "Saint Laurent",
      value: "saint-laurent",
    },
    "saint-laurent": {
      name: "Saint Laurent",
      value: "saint-laurent",
    },
    "louis-vuitton": {
      name: "Louis Vuitton",
      value: "louis-vuitton",
    },
    "celestia-couture": {
      name: "Celestia Couture",
      value: "celestia-couture",
    },
    "elegance-couture": {
      name: "Elegance Couture",
      value: "elegance-couture",
    },
    "coconuts-by-matisse": {
      name: "Coconuts by Matisse",
      value: "coconuts-by-matisse",
    },
    "fashion-nova": {
      name: "Fashion Nova",
      value: "fashion-nova",
    },
    nike: {
      name: "Nike",
      value: "nike",
    },
    puma: {
      name: "Puma",
      value: "puma",
    },
    gucci: {
      name: "Gucci",
      value: "gucci",
    },
    zara: {
      name: "Zara",
      value: "zara",
    },
    axe: {
      name: "Axe",
      value: "axe",
    },
    apple: {
      name: "Apple",
      value: "apple",
    },
  };
  
  const HIDDEN_BRAND_VALUES = new Set([
    "here",
    "jksbdkwjbds",
    "kjwbkjwbnd",
    "sdsds",
    "sdsdsd",
    "small",
    "store",
  ]);
  
  export function normalizeStorefrontBrand(
    rawBrand?: string | null,
  ): {
    name: string;
    value: string;
  } | null {
    const value =
      normalizeStorefrontValue(rawBrand);
  
    if (
      !value ||
      HIDDEN_BRAND_VALUES.has(value)
    ) {
      return null;
    }
  
    const alias = BRAND_ALIASES[value];
  
    if (alias) {
      return alias;
    }
  
    return {
      name: formatStorefrontLabel(value),
      value,
    };
  }