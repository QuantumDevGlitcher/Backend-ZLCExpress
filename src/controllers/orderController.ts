import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

// Interface para filtros de orden
interface OrderFilters {
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = "1"; // Mock
    const orders = await OrderService.getOrdersByUserId(userId);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(parseInt(id));
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = "1"; // Mock
    const { shippingAddress, paymentMethod } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({
        error: 'Dirección de envío es requerida'
      });
    }

    // El OrderService.createOrder espera (cartId, userId, orderData)
    // Como no tenemos cartId aquí, vamos a usar un cartId mock o crear uno diferente
    const cartId = "1"; // Mock cartId
    const orderData = { 
      shippingAddress,
      // paymentMethod no está en la interfaz OrderData del servicio
    };
    
    const order = await OrderService.createOrder(cartId, userId, orderData);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        error: 'Status es requerido'
      });
    }

    const order = await OrderService.updateOrderStatus(parseInt(id), status);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
