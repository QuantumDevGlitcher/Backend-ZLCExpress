import { Request, Response } from 'express';
import { databaseService } from '../services/prismaService';

// ================================================================
// CONTROLADOR DE ÓRDENES CON PRISMA
// ================================================================

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { 
      buyerId, 
      supplierId, 
      status,
      page = 1,
      limit = 50
    } = req.query;

    // Construir filtros
    const filters: any = {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };
    
    if (buyerId) {
      filters.buyerId = parseInt(buyerId as string);
    }
    
    if (status) {
      filters.status = status as string;
    }

    // Para supplierId, necesitamos usar un enfoque diferente ya que está en orderDetails
    if (supplierId) {
      filters.supplierId = parseInt(supplierId as string);
    }

    // Obtener órdenes con filtros
    const result = await databaseService.getOrders(filters);

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('❌ Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await databaseService.getOrderById(parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('❌ Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { buyerId, orderDetails, shippingAddress, notes } = req.body;
    
    // Validaciones básicas
    if (!buyerId || !orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'buyerId y orderDetails son requeridos'
      });
    }

    // Validar que cada orderDetail tenga los campos requeridos
    for (const detail of orderDetails) {
      if (!detail.productId || !detail.supplierId || !detail.quantity || !detail.unitPrice) {
        return res.status(400).json({
          success: false,
          message: 'Cada orderDetail debe tener productId, supplierId, quantity y unitPrice'
        });
      }
    }

    // Preparar datos de la orden
    const orderData = {
      buyerId: parseInt(buyerId),
      orderDetails: orderDetails.map((detail: any) => ({
        productId: parseInt(detail.productId),
        supplierId: parseInt(detail.supplierId),
        quantity: parseInt(detail.quantity),
        unitPrice: parseFloat(detail.unitPrice),
        specifications: detail.specifications
      })),
      shippingAddress,
      notes
    };

    const newOrder = await databaseService.createOrder(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: newOrder
    });
  } catch (error: any) {
    console.error('❌ Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Validar status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }
    
    const updatedOrder = await databaseService.updateOrderStatus(
      parseInt(id),
      status,
      notes
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente',
      data: updatedOrder
    });
  } catch (error: any) {
    console.error('❌ Error al actualizar orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role = 'buyer', page = 1, limit = 20 } = req.query;
    
    const result = await databaseService.getOrdersByUser(
      parseInt(userId),
      role as 'buyer' | 'supplier',
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('❌ Error al obtener órdenes del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const cancelledOrder = await databaseService.cancelOrder(
      parseInt(id),
      reason
    );
    
    if (!cancelledOrder) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: cancelledOrder
    });
  } catch (error: any) {
    console.error('❌ Error al cancelar orden:', error);
    
    if (error.message.includes('no puede ser cancelada')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
