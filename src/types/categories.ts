// Tipos para el sistema de categorías y productos

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // Para subcategorías
  level: number; // 0 = categoría principal, 1 = subcategoría, etc.
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  supplierId: string;
  description: string;
  
  // Container specifications
  containerType: "20GP" | "40HQ" | "40HC";
  unitsPerContainer: number;
  moq: number; // Minimum Order Quantity (containers)
  
  // Pricing
  unitPrice: number;
  pricePerContainer: number;
  currency: "USD" | "EUR";
  incoterm: "FOB ZLC" | "CIF" | "EXW";
  
  // Physical specifications
  grossWeight: number;
  netWeight: number;
  volume: number;
  packagingType: string;
  
  // Stock and availability
  stockContainers: number;
  isNegotiable: boolean;
  allowsCustomOrders: boolean;
  
  // Production timeline
  productionTime: number; // days
  packagingTime: number; // days
  
  // Status and visibility
  status: "active" | "draft" | "sold_out" | "inactive";
  isPublished: boolean;
  
  // SEO and discoverability
  images: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  tags?: string[];
  
  // Analytics
  totalViews: number;
  totalInquiries: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface VolumeDiscount {
  id: string;
  productId: string;
  minQuantity: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: Date;
}

// Request/Response types for API
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}

export interface CreateProductRequest {
  name: string;
  code: string;
  categoryId: string;
  description: string;
  containerType: "20GP" | "40HQ" | "40HC";
  unitsPerContainer: number;
  grossWeight: number;
  netWeight: number;
  volume: number;
  packagingType: string;
  pricePerContainer: number;
  unitPrice: number;
  currency: "USD" | "EUR";
  incoterm: "FOB ZLC" | "CIF" | "EXW";
  productionTime: number;
  packagingTime: number;
  moq: number;
  stockContainers: number;
  isNegotiable?: boolean;
  allowsCustomOrders?: boolean;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  status?: "active" | "draft" | "sold_out" | "inactive";
  isPublished?: boolean;
}

export interface CategoryWithSubcategories extends Category {
  subcategories: Category[];
}

export interface ProductWithCategory extends Product {
  category: Category;
  supplier: {
    id: string;
    companyName: string;
    isVerified: boolean;
    location: string;
  };
  volumeDiscounts: VolumeDiscount[];
}

export interface CategoriesResponse {
  success: boolean;
  categories: CategoryWithSubcategories[];
  message?: string;
}

export interface ProductsResponse {
  success: boolean;
  products: ProductWithCategory[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  product?: ProductWithCategory;
  message?: string;
}

export interface CategoryResponse {
  success: boolean;
  category?: CategoryWithSubcategories;
  message?: string;
}

// Filter types for product search
export interface ProductFilters {
  categoryId?: string;
  searchQuery?: string;
  containerType?: string;
  priceMin?: number;
  priceMax?: number;
  supplierVerified?: boolean;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}
