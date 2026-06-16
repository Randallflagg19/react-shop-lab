export type ProductCategory = {
  id: number;
  name: string;
  image: string;
  slug: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ProductCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
};
