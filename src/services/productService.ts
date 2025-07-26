import { Product } from '../types';

// Mock database con productos compatibles con el frontend
const mockProducts: any[] = [
  {
    id: "prod-1",
    name: 'Camisetas 100% Algodón Premium',
    code: 'TEE-001',
    categoryId: 'cat_clothing',
    supplierId: 'supplier_1',
    description: 'Lote premium de 5000 camisetas 100% algodón de alta calidad. Incluye una mezcla cuidadosamente seleccionada de tallas desde S hasta XL en una variedad de colores modernos y atemporales.',
    containerType: '20GP',
    unitsPerContainer: 5000,
    moq: 1,
    unitPrice: 2.50,
    pricePerContainer: 12500,
    currency: 'USD',
    incoterm: 'FOB ZLC',
    grossWeight: 12000,
    netWeight: 10000,
    volume: 28,
    packagingType: 'Cajas de cartón',
    stockContainers: 25,
    isNegotiable: true,
    allowsCustomOrders: true,
    productionTime: 18,
    packagingTime: 3,
    status: 'active',
    isPublished: true,
    images: ['/api/placeholder/400/300'],
    colors: ['Blanco', 'Negro', 'Gris', 'Azul marino'],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['100% Algodón'],
    tags: ['ropa', 'casual', 'básicos'],
    totalViews: 1250,
    totalInquiries: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
    supplier: {
      id: 'supplier_1',
      companyName: 'Textiles Premium SA',
      isVerified: true,
      location: 'Guangzhou, China'
    }
  },
  {
    id: "prod-2",
    name: 'Blusas de manga larga casuales',
    code: 'BLU-002',
    categoryId: 'cat_clothing',
    supplierId: 'supplier_2',
    description: '4500 blusas algodón premium de manga larga, diseño casual elegante. Perfectas para distribuidores que buscan prendas versátiles y de calidad. Incluye variedad de tallas y colores populares.',
    containerType: '20GP',
    unitsPerContainer: 4500,
    moq: 1,
    unitPrice: 4.00,
    pricePerContainer: 18000,
    currency: 'USD',
    incoterm: 'CIF',
    grossWeight: 15000,
    netWeight: 13500,
    volume: 30,
    packagingType: 'Bolsas individuales',
    stockContainers: 15,
    isNegotiable: false,
    allowsCustomOrders: true,
    productionTime: 22,
    packagingTime: 4,
    status: 'active',
    isPublished: true,
    images: ['/api/placeholder/400/300'],
    colors: ['Blanco', 'Beige', 'Rosa', 'Azul claro'],
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['95% Algodón', '5% Elastano'],
    tags: ['ropa', 'mujer', 'casual'],
    totalViews: 980,
    totalInquiries: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
    supplier: {
      id: 'supplier_2',
      companyName: 'Fashion World Ltd',
      isVerified: true,
      location: 'Shenzhen, China'
    }
  },
  {
    id: "prod-3",
    name: 'Pantalones deportivos unisex',
    code: 'PAN-003',
    categoryId: 'cat_clothing',
    supplierId: 'supplier_1',
    description: 'Lote de 3000 pantalones deportivos unisex de alta calidad. Material transpirable y resistente, ideales para actividades deportivas y uso casual.',
    containerType: '20GP',
    unitsPerContainer: 3000,
    moq: 1,
    unitPrice: 8.50,
    pricePerContainer: 25500,
    currency: 'USD',
    incoterm: 'FOB ZLC',
    grossWeight: 18000,
    netWeight: 16500,
    volume: 32,
    packagingType: 'Cajas de cartón',
    stockContainers: 8,
    isNegotiable: true,
    allowsCustomOrders: false,
    productionTime: 25,
    packagingTime: 5,
    status: 'active',
    isPublished: true,
    images: ['/api/placeholder/400/300'],
    colors: ['Negro', 'Gris', 'Azul marino', 'Verde militar'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    materials: ['80% Poliéster', '20% Algodón'],
    tags: ['ropa', 'deportiva', 'unisex'],
    totalViews: 756,
    totalInquiries: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
    supplier: {
      id: 'supplier_1',
      companyName: 'Textiles Premium SA',
      isVerified: true,
      location: 'Guangzhou, China'
    }
  }
];

export class ProductService {
  static async getAllProducts(): Promise<any[]> {
    // Simular delay de base de datos
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
  }

  static async getProductById(id: string): Promise<any | null> {
    // Simular delay de base de datos
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockProducts.find(product => product.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<any[]> {
    // Simular delay de base de datos
    await new Promise(resolve => setTimeout(resolve, 75));
    return mockProducts.filter(
      product => product.categoryId === category
    );
  }

  static async updateStock(productId: string, quantity: number): Promise<void> {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      product.stockContainers -= quantity;
      product.updatedAt = new Date();
    }
  }
}
