export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "প্রাসঙ্গিকতা (Relevance)",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "ট্রেন্ডিং (Trending)",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  {
    title: "সাম্প্রতিক পণ্য (Latest)",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "দাম: কম থেকে বেশি (Price: Low to High)",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "দাম: বেশি থেকে কম (Price: High to Low)",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const DEFAULT_OPTION = "Default Title";

export const BANGLADESH_DIVISIONS = [
  { id: "dhaka", nameBn: "ঢাকা বিভাগ", isDhaka: true },
  { id: "chattogram", nameBn: "চট্টগ্রাম বিভাগ", isDhaka: false },
  { id: "rajshahi", nameBn: "রাজশাহী বিভাগ", isDhaka: false },
  { id: "khulna", nameBn: "খুলনা বিভাগ", isDhaka: false },
  { id: "barishal", nameBn: "বরিশাল বিভাগ", isDhaka: false },
  { id: "sylhet", nameBn: "সিলেট বিভাগ", isDhaka: false },
  { id: "rangpur", nameBn: "রংপুর বিভাগ", isDhaka: false },
  { id: "mymensingh", nameBn: "ময়মনসিংহ বিভাগ", isDhaka: false },
] as const;

export type DivisionId = (typeof BANGLADESH_DIVISIONS)[number]["id"];
