import { RFQRequest, RFQResponse, RFQNotification, RFQ_STATUS } from '../types/rfq';

/**
 * Simulador de Base de Datos para RFQ
 * En producción, esto se reemplazaría con una base de datos real como MongoDB, PostgreSQL, etc.
 */

export interface DatabaseSchema {
  rfqs: RFQRequest[];
  notifications: RFQNotification[];
  products: ProductInfo[];
  suppliers: SupplierInfo[];
}

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  supplierName: string;
  containerType: string;
  moq: number;
  unitPrice: number;
  currency: string;
  category: string;
  stockContainers: number;
  imageUrl?: string;
}

export interface SupplierInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  verified: boolean;
  rating: number;
  totalRFQs: number;
  averageResponseTime: number; // horas
}

// Base de datos en memoria (simulada)
const database: DatabaseSchema = {
  rfqs: [],
  notifications: [],
  products: [
    {
      id: '1',
      name: 'Blusas de manga larga casuales',
      description: '4500 blusas algodón premium de manga larga, diseño casual elegante. Perfectas para distribuidores que buscan prendas versátiles y de calidad. Incluye variedad de tallas y colores populares.',
      supplierId: '1',
      supplierName: 'Demo Compradora S.A.',
      containerType: '20GP',
      moq: 1,
      unitPrice: 18000,
      currency: 'USD',
      category: 'Textiles',
      stockContainers: 25,
      imageUrl: '/api/placeholder/400/300'
    },
    {
      id: '2',
      name: 'Electrónicos Smart TV 55"',
      description: 'Smart TV LED 4K Ultra HD de 55 pulgadas con sistema Android TV integrado.',
      supplierId: '2',
      supplierName: 'TechSupply Global Ltd.',
      containerType: '40GP',
      moq: 2,
      unitPrice: 450000,
      currency: 'USD',
      category: 'Electrónicos',
      stockContainers: 15
    },
    {
      id: '3',
      name: 'Equipos de Construcción',
      description: 'Herramientas y equipos para construcción de alta calidad.',
      supplierId: '3',
      supplierName: 'BuildPro Industries',
      containerType: '40HC',
      moq: 1,
      unitPrice: 85000,
      currency: 'USD',
      category: 'Construcción',
      stockContainers: 8
    },
    {
      id: '4',
      name: 'Maquinaria Industrial',
      description: 'Equipos de manufactura y maquinaria pesada para industria.',
      supplierId: '4',
      supplierName: 'Industrial Solutions Inc.',
      containerType: '40HC',
      moq: 1,
      unitPrice: 120000,
      currency: 'USD',
      category: 'Maquinaria',
      stockContainers: 5
    },
    {
      id: '5',
      name: 'Productos Químicos',
      description: 'Químicos industriales y materias primas especializadas.',
      supplierId: '5',
      supplierName: 'ChemTrade Global',
      containerType: '20GP',
      moq: 2,
      unitPrice: 65000,
      currency: 'USD',
      category: 'Químicos',
      stockContainers: 12
    },
    {
      id: '6',
      name: 'Textiles Premium',
      description: 'Telas y materiales textiles de alta calidad para manufactura.',
      supplierId: '6',
      supplierName: 'Textile Masters Ltd.',
      containerType: '40GP',
      moq: 1,
      unitPrice: 35000,
      currency: 'USD',
      category: 'Textiles',
      stockContainers: 20
    },
    {
      id: '7',
      name: 'Electrónicos Avanzados',
      description: 'Componentes electrónicos y dispositivos tecnológicos avanzados.',
      supplierId: '3',
      supplierName: 'Shenzhen Electronics Ltd',
      containerType: '40GP',
      moq: 1,
      unitPrice: 176700,
      currency: 'USD',
      category: 'Electrónicos',
      stockContainers: 10
    }
  ],
  suppliers: [
    {
      id: '1',
      name: 'Demo Compradora S.A.',
      email: 'ventas@democompradora.com',
      phone: '+57 300 123 4567',
      country: 'Colombia',
      verified: true,
      rating: 4.8,
      totalRFQs: 156,
      averageResponseTime: 18
    },
    {
      id: '2',
      name: 'TechSupply Global Ltd.',
      email: 'rfq@techsupply.com',
      phone: '+86 138 0013 8000',
      country: 'China',
      verified: true,
      rating: 4.6,
      totalRFQs: 203,
      averageResponseTime: 24
    },
    {
      id: '3',
      name: 'Shenzhen Electronics Ltd',
      email: 'quotes@shenzhen-electronics.com',
      phone: '+86 755 1234 5678',
      country: 'China',
      verified: true,
      rating: 4.7,
      totalRFQs: 312,
      averageResponseTime: 16
    },
    {
      id: '4',
      name: 'Industrial Solutions Inc.',
      email: 'sales@industrial-solutions.com',
      phone: '+1 555 123 4567',
      country: 'USA',
      verified: true,
      rating: 4.8,
      totalRFQs: 145,
      averageResponseTime: 20
    },
    {
      id: '5',
      name: 'ChemTrade Global',
      email: 'rfq@chemtrade.com',
      phone: '+49 30 1234 5678',
      country: 'Germany',
      verified: true,
      rating: 4.9,
      totalRFQs: 98,
      averageResponseTime: 14
    },
    {
      id: '6',
      name: 'Textile Masters Ltd.',
      email: 'quotes@textile-masters.com',
      phone: '+91 22 1234 5678',
      country: 'India',
      verified: true,
      rating: 4.6,
      totalRFQs: 267,
      averageResponseTime: 22
    }
  ]
};

// Contadores para IDs únicos
let nextRFQId = 1;
let nextNotificationId = 1;

export class DatabaseService {
  
  /**
   * Obtener todos los productos (para debugging)
   */
  static async getAllProducts(): Promise<ProductInfo[]> {
    return database.products;
  }

  /**
   * Obtener información de producto por ID
   */
  static async getProductById(productId: string | number): Promise<ProductInfo | null> {
    // Convertir a string para manejar tanto IDs numéricos como de texto
    const searchId = String(productId);
    
    console.log('🔍 DatabaseService: Buscando producto con ID:', searchId, '(original:', productId, ')');
    console.log('🗄️ DatabaseService: Productos disponibles:', database.products.map(p => ({ id: p.id, name: p.name })));
    
    const product = database.products.find(product => product.id === searchId) || null;
    console.log('📦 DatabaseService: Producto encontrado:', product);
    
    return product;
  }

  /**
   * Obtener información de proveedor por ID
   */
  static async getSupplierById(supplierId: string | number): Promise<SupplierInfo | null> {
    // Convertir a string para manejar tanto IDs numéricos como de texto
    const searchId = String(supplierId);
    
    console.log('🔍 DatabaseService: Buscando proveedor con ID:', searchId, '(original:', supplierId, ')');
    console.log('🗄️ DatabaseService: Proveedores disponibles:', database.suppliers.map(s => ({ id: s.id, name: s.name })));
    
    const supplier = database.suppliers.find(supplier => supplier.id === searchId) || null;
    console.log('🏭 DatabaseService: Proveedor encontrado:', supplier);
    
    return supplier;
  }

  /**
   * Crear una nueva RFQ en la base de datos
   */
  static async createRFQ(rfqData: Omit<RFQRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<RFQRequest> {
    const rfqId = `RFQ-${Date.now()}-${nextRFQId++}`;
    
    const newRFQ: RFQRequest = {
      ...rfqData,
      id: rfqId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('💾 DatabaseService.createRFQ: Guardando nueva RFQ:', newRFQ);
    database.rfqs.push(newRFQ);
    console.log('💾 DatabaseService.createRFQ: Total RFQs después de guardar:', database.rfqs.length);
    console.log('💾 DatabaseService.createRFQ: Última RFQ guardada:', database.rfqs[database.rfqs.length - 1]);
    
    // Actualizar estadísticas del proveedor
    const supplier = await this.getSupplierById(newRFQ.supplierId);
    if (supplier) {
      supplier.totalRFQs += 1;
    }

    return newRFQ;
  }

  /**
   * Obtener RFQ por ID
   */
  static async getRFQById(rfqId: string): Promise<RFQRequest | null> {
    return database.rfqs.find(rfq => rfq.id === rfqId) || null;
  }

  /**
   * Obtener todas las RFQs
   */
  static async getAllRFQs(): Promise<RFQRequest[]> {
    return [...database.rfqs];
  }

  /**
   * Actualizar RFQ
   */
  static async updateRFQ(rfqId: string, updates: Partial<RFQRequest>): Promise<RFQRequest | null> {
    const rfqIndex = database.rfqs.findIndex(rfq => rfq.id === rfqId);
    
    if (rfqIndex === -1) {
      return null;
    }

    const updatedRFQ: RFQRequest = {
      ...database.rfqs[rfqIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    database.rfqs[rfqIndex] = updatedRFQ;
    return updatedRFQ;
  }

  /**
   * Eliminar RFQ
   */
  static async deleteRFQ(rfqId: string): Promise<boolean> {
    const initialLength = database.rfqs.length;
    database.rfqs = database.rfqs.filter(rfq => rfq.id !== rfqId);
    return database.rfqs.length < initialLength;
  }

  /**
   * Crear notificación
   */
  static async createNotification(notificationData: Omit<RFQNotification, 'id' | 'createdAt'>): Promise<RFQNotification> {
    const notification: RFQNotification = {
      ...notificationData,
      id: `NOTIF-${nextNotificationId++}`,
      createdAt: new Date().toISOString()
    };

    database.notifications.push(notification);
    return notification;
  }

  /**
   * Obtener notificaciones por usuario
   */
  static async getNotificationsByUser(userId: string, userType: 'supplier' | 'buyer'): Promise<RFQNotification[]> {
    return database.notifications
      .filter(notification => 
        notification.recipientId === userId && 
        notification.recipientType === userType
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Marcar notificación como leída
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notification = database.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      return true;
    }
    return false;
  }

  /**
   * Obtener estadísticas de la base de datos
   */
  static async getDatabaseStats(): Promise<{
    totalRFQs: number;
    totalProducts: number;
    totalSuppliers: number;
    totalNotifications: number;
    pendingRFQs: number;
    quotedRFQs: number;
    acceptedRFQs: number;
    rejectedRFQs: number;
    expiredRFQs: number;
  }> {
    return {
      totalRFQs: database.rfqs.length,
      totalProducts: database.products.length,
      totalSuppliers: database.suppliers.length,
      totalNotifications: database.notifications.length,
      pendingRFQs: database.rfqs.filter(rfq => rfq.status === RFQ_STATUS.PENDING).length,
      quotedRFQs: database.rfqs.filter(rfq => rfq.status === RFQ_STATUS.QUOTED).length,
      acceptedRFQs: database.rfqs.filter(rfq => rfq.status === RFQ_STATUS.ACCEPTED).length,
      rejectedRFQs: database.rfqs.filter(rfq => rfq.status === RFQ_STATUS.REJECTED).length,
      expiredRFQs: database.rfqs.filter(rfq => rfq.status === RFQ_STATUS.EXPIRED).length
    };
  }

  /**
   * Buscar RFQs por criterios múltiples
   */
  static async searchRFQs(criteria: {
    status?: string[];
    supplierId?: string;
    productId?: string;
    requesterId?: string;
    dateFrom?: string;
    dateTo?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<RFQRequest[]> {
    console.log('🔍 DatabaseService.searchRFQs: Criterios de búsqueda:', criteria);
    console.log('🔍 DatabaseService.searchRFQs: Total RFQs en base de datos:', database.rfqs.length);
    console.log('🔍 DatabaseService.searchRFQs: RFQs existentes:', database.rfqs.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
    
    let results = [...database.rfqs];

    if (criteria.status) {
      console.log('🔍 Filtrando por status:', criteria.status);
      results = results.filter(rfq => criteria.status!.includes(rfq.status));
      console.log('🔍 Después de filtrar por status:', results.length);
    }

    if (criteria.supplierId) {
      console.log('🔍 Filtrando por supplierId:', criteria.supplierId);
      results = results.filter(rfq => rfq.supplierId === criteria.supplierId);
      console.log('🔍 Después de filtrar por supplierId:', results.length);
    }

    if (criteria.productId) {
      console.log('🔍 Filtrando por productId:', criteria.productId);
      results = results.filter(rfq => rfq.productId === criteria.productId);
      console.log('🔍 Después de filtrar por productId:', results.length);
    }

    if (criteria.requesterId) {
      console.log('🔍 Filtrando por requesterId:', criteria.requesterId);
      console.log('🔍 RFQs antes del filtro:', results.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
      results = results.filter(rfq => rfq.requesterId === criteria.requesterId);
      console.log('🔍 Después de filtrar por requesterId:', results.length);
      console.log('🔍 RFQs que pasaron el filtro:', results.map(rfq => ({ id: rfq.id, requesterId: rfq.requesterId })));
    }

    if (criteria.dateFrom) {
      const fromDate = new Date(criteria.dateFrom);
      results = results.filter(rfq => new Date(rfq.requestDate) >= fromDate);
    }

    if (criteria.dateTo) {
      const toDate = new Date(criteria.dateTo);
      results = results.filter(rfq => new Date(rfq.requestDate) <= toDate);
    }

    if (criteria.minValue !== undefined) {
      results = results.filter(rfq => (rfq.estimatedValue || 0) >= criteria.minValue!);
    }

    if (criteria.maxValue !== undefined) {
      results = results.filter(rfq => (rfq.estimatedValue || 0) <= criteria.maxValue!);
    }

    return results;
  }

  /**
   * Obtener todos los proveedores
   */
  static async getAllSuppliers(): Promise<SupplierInfo[]> {
    return [...database.suppliers];
  }

  /**
   * Limpiar base de datos (para testing)
   */
  static async clearDatabase(): Promise<void> {
    database.rfqs = [];
    database.notifications = [];
    nextRFQId = 1;
    nextNotificationId = 1;
  }

  /**
   * Obtener datos de la base de datos para backup
   */
  static async exportDatabase(): Promise<DatabaseSchema> {
    return {
      rfqs: [...database.rfqs],
      notifications: [...database.notifications],
      products: [...database.products],
      suppliers: [...database.suppliers]
    };
  }

  /**
   * Restaurar base de datos desde backup
   */
  static async importDatabase(data: Partial<DatabaseSchema>): Promise<void> {
    if (data.rfqs) database.rfqs = [...data.rfqs];
    if (data.notifications) database.notifications = [...data.notifications];
    if (data.products) database.products = [...data.products];
    if (data.suppliers) database.suppliers = [...data.suppliers];
  }
}
