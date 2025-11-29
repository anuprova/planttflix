// src/lib/types.ts
export interface Plant {
  $id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  description?: string;
  careInstructions?: string;
  image?: string; // URL
  isAvailable?: boolean;
  createdAt?: string;
}

export interface Category {
  $id: string;
  name: string;
  slug?: string;
  image?: string;
}
