export type ProductCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type ProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  image_key: string;
  image_url: string;
  created_at: string;
  category: ProductCategoryRow | null;
};
