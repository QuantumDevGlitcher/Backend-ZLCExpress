import { Category, CategoryWithSubcategories, Product, ProductWithCategory, VolumeDiscount } from '../types/categories';

// Mock database con categorías
const mockCategories: Category[] = [
  // Categorías principales (level 0)
  {
    id: "cat-1",
    name: "Ropa",
    slug: "ropa",
    description: "Textiles y confección de alta calidad",
    level: 0,
    icon: "👕",
    isActive: true,
    sortOrder: 1,
    productCount: 85,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "cat-2",
    name: "Calzado",
    slug: "calzado",
    description: "Zapatos, botas y calzado deportivo",
    level: 0,
    icon: "👟",
    isActive: true,
    sortOrder: 2,
    productCount: 42,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "cat-3",
    name: "Electrónicos",
    slug: "electronicos",
    description: "Dispositivos electrónicos y accesorios",
    level: 0,
    icon: "📱",
    isActive: true,
    sortOrder: 3,
    productCount: 67,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "cat-4",
    name: "Hogar y Jardín",
    slug: "hogar-jardin",
    description: "Artículos para el hogar y jardinería",
    level: 0,
    icon: "🏠",
    isActive: true,
    sortOrder: 4,
    productCount: 38,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "cat-5",
    name: "Automotriz",
    slug: "automotriz",
    description: "Repuestos y accesorios automotrices",
    level: 0,
    icon: "🚗",
    isActive: true,
    sortOrder: 5,
    productCount: 23,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },

  // Subcategorías de Ropa (level 1)
  {
    id: "subcat-1-1",
    name: "Ropa de Hombre",
    slug: "ropa-hombre",
    description: "Vestimenta masculina",
    parentId: "cat-1",
    level: 1,
    isActive: true,
    sortOrder: 1,
    productCount: 32,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "subcat-1-2",
    name: "Ropa de Mujer",
    slug: "ropa-mujer",
    description: "Vestimenta femenina",
    parentId: "cat-1",
    level: 1,
    isActive: true,
    sortOrder: 2,
    productCount: 45,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "subcat-1-3",
    name: "Ropa Infantil",
    slug: "ropa-infantil",
    description: "Vestimenta para niños",
    parentId: "cat-1",
    level: 1,
    isActive: true,
    sortOrder: 3,
    productCount: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },

  // Subcategorías de Calzado (level 1)
  {
    id: "subcat-2-1",
    name: "Zapatos Deportivos",
    slug: "zapatos-deportivos",
    description: "Calzado para deportes y actividades",
    parentId: "cat-2",
    level: 1,
    isActive: true,
    sortOrder: 1,
    productCount: 18,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "subcat-2-2",
    name: "Zapatos Formales",
    slug: "zapatos-formales",
    description: "Calzado elegante para ocasiones especiales",
    parentId: "cat-2",
    level: 1,
    isActive: true,
    sortOrder: 2,
    productCount: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: "subcat-2-3",
    name: "Zapatos Casuales",
    slug: "zapatos-casuales",
    description: "Calzado cómodo para el día a día",
    parentId: "cat-2",
    level: 1,
    isActive: true,
    sortOrder: 3,
    productCount: 9,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Mock database con productos
const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Camisetas 100% Algodón Premium",
    code: "CAM-ALG-20GP-0500",
    categoryId: "subcat-1-1", // Ropa de Hombre
    supplierId: "2", // importadora@empresa.com
    description: "Lote premium de 5000 camisetas 100% algodón de alta calidad. Incluye una mezcla cuidadosamente seleccionada de tallas desde S hasta XL en una variedad de colores modernos y atemporales. Perfectas para distribuidores que buscan productos de calidad superior con excelente relación precio-valor.",
    
    containerType: "20GP",
    unitsPerContainer: 5000,
    moq: 1,
    
    unitPrice: 2.5,
    pricePerContainer: 12500,
    currency: "USD",
    incoterm: "FOB ZLC",
    
    grossWeight: 2400,
    netWeight: 2000,
    volume: 28.5,
    packagingType: "Cajas de cartón en paletas",
    
    stockContainers: 8,
    isNegotiable: true,
    allowsCustomOrders: true,
    
    productionTime: 20,
    packagingTime: 5,
    
    status: "active",
    isPublished: true,
    
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&h=400&fit=crop"
    ],
    colors: ["Blanco", "Negro", "Gris", "Azul Marino", "Rojo"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    materials: ["100% Algodón Peinado 180gsm"],
    tags: ["camisetas", "algodón", "premium", "casual"],
    
    totalViews: 245,
    totalInquiries: 12,
    
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: "prod-2",
    name: "Blusas de manga larga casuales",
    code: "BLU-CAS-20GP-4500",
    categoryId: "subcat-1-2", // Ropa de Mujer
    supplierId: "4", // comprador@demo.com (actuando como supplier para demo)
    description: "4500 blusas algodón premium de manga larga, diseño casual elegante. Perfectas para distribuidores que buscan prendas versátiles y de calidad. Incluye variedad de tallas y colores populares.",
    
    containerType: "20GP",
    unitsPerContainer: 4500,
    moq: 1,
    
    unitPrice: 4.0,
    pricePerContainer: 18000,
    currency: "USD",
    incoterm: "CIF",
    
    grossWeight: 2200,
    netWeight: 1800,
    volume: 26.0,
    packagingType: "Cajas individuales en paletas",
    
    stockContainers: 5,
    isNegotiable: false,
    allowsCustomOrders: true,
    
    productionTime: 18,
    packagingTime: 3,
    
    status: "active",
    isPublished: true,
    
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
    ],
    colors: ["Blanco", "Negro", "Rosa", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: ["Algodón blend"],
    tags: ["blusas", "casual", "manga larga", "mujer"],
    
    totalViews: 189,
    totalInquiries: 8,
    
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: "prod-3",
    name: "Jeans Denim Calidad Premium",
    code: "JEA-DEN-40HQ-0300",
    categoryId: "subcat-1-1", // Ropa de Hombre
    supplierId: "5", // proveedor@demo.com
    description: "3000 jeans denim premium, tallas 28-42, cortes clásicos y modernos. Fabricados con denim de alta calidad, perfectos para distribuidores de moda masculina.",
    
    containerType: "40HQ",
    unitsPerContainer: 3000,
    moq: 1,
    
    unitPrice: 8.75,
    pricePerContainer: 26250,
    currency: "USD",
    incoterm: "FOB ZLC",
    
    grossWeight: 4200,
    netWeight: 3800,
    volume: 65.0,
    packagingType: "Bolsas individuales en cajas",
    
    stockContainers: 5,
    isNegotiable: true,
    allowsCustomOrders: false,
    
    productionTime: 25,
    packagingTime: 3,
    
    status: "active",
    isPublished: true,
    
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop"
    ],
    colors: ["Azul clásico", "Negro", "Gris oscuro"],
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    materials: ["Denim 100% algodón"],
    tags: ["jeans", "denim", "premium", "hombre"],
    
    totalViews: 189,
    totalInquiries: 8,
    
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: "prod-4",
    name: "Zapatos Deportivos Mixtos",
    code: "ZAP-DEP-40HC-0250",
    categoryId: "subcat-2-1", // Zapatos Deportivos
    supplierId: "6", // proveedor@demo.com
    description: "2500 pares zapatos deportivos mixtos, tallas 35-45, colores variados. Perfectos para retailers que buscan calzado deportivo de calidad a precio competitivo.",
    
    containerType: "40HC",
    unitsPerContainer: 2500,
    moq: 1,
    
    unitPrice: 15.0,
    pricePerContainer: 37500,
    currency: "USD",
    incoterm: "FOB ZLC",
    
    grossWeight: 5200,
    netWeight: 4800,
    volume: 62.0,
    packagingType: "Cajas individuales apiladas",
    
    stockContainers: 0,
    isNegotiable: false,
    allowsCustomOrders: true,
    
    productionTime: 30,
    packagingTime: 7,
    
    status: "sold_out",
    isPublished: true,
    
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop"
    ],
    colors: ["Blanco", "Negro", "Azul", "Rojo", "Gris"],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    materials: ["Cuero sintético", "Mesh transpirable"],
    tags: ["zapatos", "deportivos", "running", "mixto"],
    
    totalViews: 320,
    totalInquiries: 15,
    
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: "prod-5",
    name: "Accesorios de Moda Variados",
    code: "ACC-MOD-20GP-1000",
    categoryId: "subcat-1-2", // Ropa de Mujer
    supplierId: "2", // importadora@empresa.com
    description: "Lote mixto de 1000 unidades: bolsos, carteras, cinturones, bufandas. Perfecto para retailers que buscan variedad en accesorios femeninos.",
    
    containerType: "20GP",
    unitsPerContainer: 1000,
    moq: 2,
    
    unitPrice: 4.5,
    pricePerContainer: 4500,
    currency: "USD",
    incoterm: "FOB ZLC",
    
    grossWeight: 1800,
    netWeight: 1500,
    volume: 25.0,
    packagingType: "Cajas mixtas organizadas",
    
    stockContainers: 12,
    isNegotiable: true,
    allowsCustomOrders: true,
    
    productionTime: 15,
    packagingTime: 3,
    
    status: "active",
    isPublished: false, // En borrador
    
    images: [],
    colors: ["Varios"],
    materials: ["Cuero sintético", "Textiles", "Metal"],
    tags: ["accesorios", "moda", "mixto", "mujer"],
    
    totalViews: 0,
    totalInquiries: 0,
    
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
];

// Mock database con descuentos por volumen
const mockVolumeDiscounts: VolumeDiscount[] = [
  // Descuentos para Camisetas Premium
  { id: "vd-1", productId: "prod-1", minQuantity: 2, discountPercentage: 5, isActive: true, createdAt: new Date('2024-01-15') },
  { id: "vd-2", productId: "prod-1", minQuantity: 5, discountPercentage: 10, isActive: true, createdAt: new Date('2024-01-15') },
  { id: "vd-3", productId: "prod-1", minQuantity: 10, discountPercentage: 15, isActive: true, createdAt: new Date('2024-01-15') },
  
  // Descuentos para Jeans Premium
  { id: "vd-4", productId: "prod-3", minQuantity: 2, discountPercentage: 7, isActive: true, createdAt: new Date('2024-01-10') },
  { id: "vd-5", productId: "prod-3", minQuantity: 4, discountPercentage: 12, isActive: true, createdAt: new Date('2024-01-10') },
  
  // Descuentos para Zapatos Deportivos
  { id: "vd-6", productId: "prod-4", minQuantity: 2, discountPercentage: 8, isActive: true, createdAt: new Date('2024-01-05') },
  { id: "vd-7", productId: "prod-4", minQuantity: 3, discountPercentage: 15, isActive: true, createdAt: new Date('2024-01-05') },
  
  // Descuentos para Accesorios
  { id: "vd-8", productId: "prod-5", minQuantity: 3, discountPercentage: 10, isActive: true, createdAt: new Date('2024-01-25') },
  { id: "vd-9", productId: "prod-5", minQuantity: 6, discountPercentage: 18, isActive: true, createdAt: new Date('2024-01-25') }
];

export class CategoryService {
  static async getAllCategories(): Promise<CategoryWithSubcategories[]> {
    try {
      // Simular delay de base de datos
      await new Promise(resolve => setTimeout(resolve, 200));

      // Agrupar categorías principales con sus subcategorías
      const mainCategories = mockCategories.filter(cat => cat.level === 0);
      
      const categoriesWithSubs = mainCategories.map(mainCat => ({
        ...mainCat,
        subcategories: mockCategories.filter(cat => cat.parentId === mainCat.id)
      }));

      return categoriesWithSubs;
    } catch (error) {
      console.error('Error en CategoryService.getAllCategories:', error);
      throw error;
    }
  }

  static async getCategoryById(id: string): Promise<CategoryWithSubcategories | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));

      const category = mockCategories.find(cat => cat.id === id);
      if (!category) return null;

      const subcategories = mockCategories.filter(cat => cat.parentId === id);
      
      return {
        ...category,
        subcategories
      };
    } catch (error) {
      console.error('Error en CategoryService.getCategoryById:', error);
      return null;
    }
  }

  static async getCategoryBySlug(slug: string): Promise<CategoryWithSubcategories | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));

      const category = mockCategories.find(cat => cat.slug === slug);
      if (!category) return null;

      const subcategories = mockCategories.filter(cat => cat.parentId === category.id);
      
      return {
        ...category,
        subcategories
      };
    } catch (error) {
      console.error('Error en CategoryService.getCategoryBySlug:', error);
      return null;
    }
  }
}

export class ProductService {
  static async getAllProducts(filters: {
    categoryId?: string;
    searchQuery?: string;
    containerType?: string;
    priceMin?: number;
    priceMax?: number;
    supplierVerified?: boolean;
    inStock?: boolean;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ products: ProductWithCategory[]; total: number }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let filteredProducts = [...mockProducts];

      // Filtro por categoría
      if (filters.categoryId) {
        filteredProducts = filteredProducts.filter(product => {
          const category = mockCategories.find(cat => cat.id === product.categoryId);
          return product.categoryId === filters.categoryId || 
                 (category && category.parentId === filters.categoryId);
        });
      }

      // Filtro por búsqueda
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Filtro por tipo de contenedor
      if (filters.containerType) {
        filteredProducts = filteredProducts.filter(product => 
          product.containerType === filters.containerType
        );
      }

      // Filtro por rango de precios
      if (filters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.pricePerContainer >= filters.priceMin!
        );
      }
      if (filters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.pricePerContainer <= filters.priceMax!
        );
      }

      // Filtro por stock disponible
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => 
          product.stockContainers > 0
        );
      }

      // Filtro por estado
      if (filters.status) {
        filteredProducts = filteredProducts.filter(product => 
          product.status === filters.status
        );
      }

      // Solo productos publicados para compradores
      filteredProducts = filteredProducts.filter(product => product.isPublished);

      // Ordenamiento
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any = a[filters.sortBy as keyof Product];
          let bValue: any = b[filters.sortBy as keyof Product];

          if (filters.sortBy === 'popularity') {
            aValue = a.totalViews + a.totalInquiries;
            bValue = b.totalViews + b.totalInquiries;
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      // Enriquecer productos con información adicional
      const enrichedProducts = await Promise.all(
        paginatedProducts.map(async (product) => {
          const category = mockCategories.find(cat => cat.id === product.categoryId);
          const volumeDiscounts = mockVolumeDiscounts.filter(vd => vd.productId === product.id);
          
          // Mock supplier data (en producción vendría de AuthService)
          const supplierData = {
            id: product.supplierId,
            companyName: product.supplierId === "2" ? "Importadora Global S.A.S" : 
                         product.supplierId === "4" ? "Demo Compradora S.A." :
                         product.supplierId === "5" ? "Demo Proveedores Ltda." :
                         product.supplierId === "6" ? "Demo Proveedores Ltda." :
                         "Proveedor Desconocido",
            isVerified: true,
            location: "Zona Libre de Colón"
          };

          return {
            ...product,
            category: category!,
            supplier: supplierData,
            volumeDiscounts
          };
        })
      );

      return {
        products: enrichedProducts,
        total: filteredProducts.length
      };
    } catch (error) {
      console.error('Error en ProductService.getAllProducts:', error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<ProductWithCategory | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const product = mockProducts.find(prod => prod.id === id);
      if (!product) return null;

      const category = mockCategories.find(cat => cat.id === product.categoryId);
      const volumeDiscounts = mockVolumeDiscounts.filter(vd => vd.productId === product.id);
      
      // Mock supplier data
      const supplierData = {
        id: product.supplierId,
        companyName: product.supplierId === "2" ? "Importadora Global S.A.S" : 
                     product.supplierId === "4" ? "Demo Compradora S.A." :
                     product.supplierId === "5" ? "Demo Proveedores Ltda." :
                     product.supplierId === "6" ? "Demo Proveedores Ltda." :
                     "Proveedor Desconocido",
        isVerified: true,
        location: "Zona Libre de Colón"
      };

      // Incrementar contador de vistas
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        mockProducts[productIndex].totalViews++;
        mockProducts[productIndex].updatedAt = new Date();
      }

      return {
        ...product,
        category: category!,
        supplier: supplierData,
        volumeDiscounts
      };
    } catch (error) {
      console.error('Error en ProductService.getProductById:', error);
      return null;
    }
  }

  static async getProductsByCategory(categoryId: string, filters: any = {}): Promise<{ products: ProductWithCategory[]; total: number }> {
    return this.getAllProducts({ ...filters, categoryId });
  }

  static async searchProducts(query: string, filters: any = {}): Promise<{ products: ProductWithCategory[]; total: number }> {
    return this.getAllProducts({ ...filters, searchQuery: query });
  }

  // Métodos para suppliers
  static async getProductsBySupplierId(supplierId: string): Promise<Product[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockProducts.filter(product => product.supplierId === supplierId);
    } catch (error) {
      console.error('Error en ProductService.getProductsBySupplierId:', error);
      throw error;
    }
  }

  static async updateProductStock(productId: string, newStock: number): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) return false;

      mockProducts[productIndex].stockContainers = newStock;
      mockProducts[productIndex].status = newStock > 0 ? 'active' : 'sold_out';
      mockProducts[productIndex].updatedAt = new Date();

      return true;
    } catch (error) {
      console.error('Error en ProductService.updateProductStock:', error);
      return false;
    }
  }
}
