import { Request, Response, NextFunction } from 'express';
import { RFQCreateRequest } from '../types/rfq';

// Tipos de validación
interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class RFQValidationMiddleware {
  
  /**
   * Validar datos de creación de RFQ
   */
  static validateCreateRFQ(req: Request, res: Response, next: NextFunction): void {
    const errors: ValidationError[] = [];
    const data: RFQCreateRequest = req.body;

    // Validar productId
    if (!data.productId || typeof data.productId !== 'string' || data.productId.trim() === '') {
      errors.push({
        field: 'productId',
        message: 'El ID del producto es requerido y debe ser una cadena válida',
        value: data.productId
      });
    }

    // Validar requesterName
    if (!data.requesterName || typeof data.requesterName !== 'string' || data.requesterName.trim() === '') {
      errors.push({
        field: 'requesterName',
        message: 'El nombre del solicitante es requerido',
        value: data.requesterName
      });
    }

    // Validar requesterEmail
    if (!data.requesterEmail || typeof data.requesterEmail !== 'string') {
      errors.push({
        field: 'requesterEmail',
        message: 'El email del solicitante es requerido',
        value: data.requesterEmail
      });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.requesterEmail)) {
        errors.push({
          field: 'requesterEmail',
          message: 'El email debe tener un formato válido',
          value: data.requesterEmail
        });
      }
    }

    // Validar containerQuantity
    if (!data.containerQuantity || typeof data.containerQuantity !== 'number' || data.containerQuantity <= 0) {
      errors.push({
        field: 'containerQuantity',
        message: 'La cantidad de contenedores debe ser un número mayor a 0',
        value: data.containerQuantity
      });
    }

    // Validar containerType
    const validContainerTypes = ['20GP', '40GP', '40HC', '45HC'];
    if (!data.containerType || !validContainerTypes.includes(data.containerType)) {
      errors.push({
        field: 'containerType',
        message: `El tipo de contenedor debe ser uno de: ${validContainerTypes.join(', ')}`,
        value: data.containerType
      });
    }

    // Validar incoterm
    const validIncoterms = ['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP'];
    if (!data.incoterm || !validIncoterms.includes(data.incoterm)) {
      errors.push({
        field: 'incoterm',
        message: `El incoterm debe ser uno de: ${validIncoterms.join(', ')}`,
        value: data.incoterm
      });
    }

    // Validar tentativeDeliveryDate
    if (!data.tentativeDeliveryDate) {
      errors.push({
        field: 'tentativeDeliveryDate',
        message: 'La fecha tentativa de entrega es requerida',
        value: data.tentativeDeliveryDate
      });
    } else {
      const deliveryDate = new Date(data.tentativeDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates
      
      if (isNaN(deliveryDate.getTime())) {
        errors.push({
          field: 'tentativeDeliveryDate',
          message: 'La fecha de entrega debe tener un formato válido (YYYY-MM-DD)',
          value: data.tentativeDeliveryDate
        });
      } else if (deliveryDate <= today) {
        errors.push({
          field: 'tentativeDeliveryDate',
          message: 'La fecha de entrega debe ser en el futuro',
          value: data.tentativeDeliveryDate
        });
      }
    }

    // Validar teléfono si se proporciona
    if (data.requesterPhone && typeof data.requesterPhone === 'string') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(data.requesterPhone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push({
          field: 'requesterPhone',
          message: 'El teléfono debe tener un formato válido',
          value: data.requesterPhone
        });
      }
    }

    // Validar prioridad si se proporciona
    if (data.priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(data.priority)) {
        errors.push({
          field: 'priority',
          message: `La prioridad debe ser una de: ${validPriorities.join(', ')}`,
          value: data.priority
        });
      }
    }

    // Si hay errores, devolver respuesta de error
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Errores de validación en los datos proporcionados',
        errors: errors,
        error: 'VALIDATION_ERROR'
      });
      return;
    }

    next();
  }

  /**
   * Validar parámetros de consulta para filtros
   */
  static validateQueryFilters(req: Request, res: Response, next: NextFunction): void {
    const errors: ValidationError[] = [];

    // Validar formato de fechas si se proporcionan
    if (req.query.dateFrom) {
      const dateFrom = new Date(req.query.dateFrom as string);
      if (isNaN(dateFrom.getTime())) {
        errors.push({
          field: 'dateFrom',
          message: 'La fecha desde debe tener un formato válido (YYYY-MM-DD)',
          value: req.query.dateFrom
        });
      }
    }

    if (req.query.dateTo) {
      const dateTo = new Date(req.query.dateTo as string);
      if (isNaN(dateTo.getTime())) {
        errors.push({
          field: 'dateTo',
          message: 'La fecha hasta debe tener un formato válido (YYYY-MM-DD)',
          value: req.query.dateTo
        });
      }
    }

    // Validar valores numéricos
    if (req.query.minValue) {
      const minValue = parseFloat(req.query.minValue as string);
      if (isNaN(minValue) || minValue < 0) {
        errors.push({
          field: 'minValue',
          message: 'El valor mínimo debe ser un número válido mayor o igual a 0',
          value: req.query.minValue
        });
      }
    }

    if (req.query.maxValue) {
      const maxValue = parseFloat(req.query.maxValue as string);
      if (isNaN(maxValue) || maxValue < 0) {
        errors.push({
          field: 'maxValue',
          message: 'El valor máximo debe ser un número válido mayor o igual a 0',
          value: req.query.maxValue
        });
      }
    }

    // Validar estados si se proporcionan
    if (req.query.status) {
      const validStatuses = ['pending', 'quoted', 'accepted', 'rejected', 'expired'];
      const statuses = (req.query.status as string).split(',');
      const invalidStatuses = statuses.filter(status => !validStatuses.includes(status.trim()));
      
      if (invalidStatuses.length > 0) {
        errors.push({
          field: 'status',
          message: `Estados inválidos: ${invalidStatuses.join(', ')}. Estados válidos: ${validStatuses.join(', ')}`,
          value: req.query.status
        });
      }
    }

    // Validar prioridades si se proporcionan
    if (req.query.priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      const priorities = (req.query.priority as string).split(',');
      const invalidPriorities = priorities.filter(priority => !validPriorities.includes(priority.trim()));
      
      if (invalidPriorities.length > 0) {
        errors.push({
          field: 'priority',
          message: `Prioridades inválidas: ${invalidPriorities.join(', ')}. Prioridades válidas: ${validPriorities.join(', ')}`,
          value: req.query.priority
        });
      }
    }

    // Si hay errores, devolver respuesta de error
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Errores de validación en los parámetros de consulta',
        errors: errors,
        error: 'QUERY_VALIDATION_ERROR'
      });
      return;
    }

    next();
  }

  /**
   * Validar datos de respuesta de RFQ
   */
  static validateRFQResponse(req: Request, res: Response, next: NextFunction): void {
    const errors: ValidationError[] = [];
    const data = req.body;

    // Validar supplierId
    if (!data.supplierId || typeof data.supplierId !== 'string') {
      errors.push({
        field: 'supplierId',
        message: 'El ID del proveedor es requerido',
        value: data.supplierId
      });
    }

    // Validar unitPrice
    if (!data.unitPrice || typeof data.unitPrice !== 'number' || data.unitPrice <= 0) {
      errors.push({
        field: 'unitPrice',
        message: 'El precio unitario debe ser un número mayor a 0',
        value: data.unitPrice
      });
    }

    // Validar totalPrice
    if (!data.totalPrice || typeof data.totalPrice !== 'number' || data.totalPrice <= 0) {
      errors.push({
        field: 'totalPrice',
        message: 'El precio total debe ser un número mayor a 0',
        value: data.totalPrice
      });
    }

    // Validar currency
    if (!data.currency || typeof data.currency !== 'string') {
      errors.push({
        field: 'currency',
        message: 'La moneda es requerida',
        value: data.currency
      });
    }

    // Validar deliveryTime
    if (!data.deliveryTime || typeof data.deliveryTime !== 'number' || data.deliveryTime <= 0) {
      errors.push({
        field: 'deliveryTime',
        message: 'El tiempo de entrega debe ser un número mayor a 0 (en días)',
        value: data.deliveryTime
      });
    }

    // Validar deliveryTerms
    if (!data.deliveryTerms || typeof data.deliveryTerms !== 'string') {
      errors.push({
        field: 'deliveryTerms',
        message: 'Los términos de entrega son requeridos',
        value: data.deliveryTerms
      });
    }

    // Validar paymentTerms
    if (!data.paymentTerms || typeof data.paymentTerms !== 'string') {
      errors.push({
        field: 'paymentTerms',
        message: 'Los términos de pago son requeridos',
        value: data.paymentTerms
      });
    }

    // Validar validityPeriod
    if (data.validityPeriod !== undefined && (typeof data.validityPeriod !== 'number' || data.validityPeriod <= 0)) {
      errors.push({
        field: 'validityPeriod',
        message: 'El período de validez debe ser un número mayor a 0 (en días)',
        value: data.validityPeriod
      });
    }

    // Validar minimumOrderQuantity
    if (data.minimumOrderQuantity !== undefined && (typeof data.minimumOrderQuantity !== 'number' || data.minimumOrderQuantity <= 0)) {
      errors.push({
        field: 'minimumOrderQuantity',
        message: 'La cantidad mínima de orden debe ser un número mayor a 0',
        value: data.minimumOrderQuantity
      });
    }

    // Si hay errores, devolver respuesta de error
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Errores de validación en la respuesta de RFQ',
        errors: errors,
        error: 'RFQ_RESPONSE_VALIDATION_ERROR'
      });
      return;
    }

    next();
  }

  /**
   * Sanitizar datos de entrada
   */
  static sanitizeInput(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
      // Sanitizar strings removiendo espacios extra y caracteres peligrosos
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim().replace(/[<>\"']/g, '');
        }
      });
    }

    next();
  }
}
