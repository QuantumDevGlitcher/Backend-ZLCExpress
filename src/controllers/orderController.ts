import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

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
    const userId = "1"; // Mock
    const order = await OrderService.getOrderById(parseInt(id), userId);
    
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
    
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        error: 'Dirección de envío y método de pago son requeridos'
      });
    }

    const order = await OrderService.createOrder(userId, { shippingAddress, paymentMethod });
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
