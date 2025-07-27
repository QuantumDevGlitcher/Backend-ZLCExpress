"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightValidationMiddleware = void 0;
class FreightValidationMiddleware {
    /**
     * Sanitizar entrada de datos
     */
    static sanitizeInput(req, res, next) {
        if (req.body) {
            // Limpiar strings de caracteres peligrosos
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].trim();
                    // Remover caracteres peligrosos para SQL injection
                    req.body[key] = req.body[key].replace(/[<>'"&]/g, '');
                }
            });
        }
        next();
    }
    /**
     * Validar request de cálculo de freight
     */
    static validateFreightCalculation(req, res, next) {
        const { origin, destination, containerType, containerQuantity, estimatedDate, incoterm } = req.body;
        const errors = [];
        // Validar origen
        if (!origin || origin.length < 3) {
            errors.push('Puerto de origen debe tener al menos 3 caracteres');
        }
        // Validar destino
        if (!destination || destination.length < 3) {
            errors.push('Puerto de destino debe tener al menos 3 caracteres');
        }
        // Validar que origen y destino sean diferentes
        if (origin && destination && origin.toLowerCase() === destination.toLowerCase()) {
            errors.push('Puerto de origen y destino deben ser diferentes');
        }
        // Validar tipo de contenedor
        const validContainerTypes = ['20GP', '40GP', '40HC', '45HC'];
        if (!containerType || !validContainerTypes.includes(containerType)) {
            errors.push(`Tipo de contenedor debe ser uno de: ${validContainerTypes.join(', ')}`);
        }
        // Validar cantidad de contenedores
        if (!containerQuantity || containerQuantity <= 0 || containerQuantity > 50) {
            errors.push('Cantidad de contenedores debe ser entre 1 y 50');
        }
        // Validar fecha estimada
        if (!estimatedDate) {
            errors.push('Fecha estimada es requerida');
        }
        else {
            const date = new Date(estimatedDate);
            const today = new Date();
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1); // Un año en el futuro
            if (isNaN(date.getTime())) {
                errors.push('Fecha estimada tiene formato inválido');
            }
            else if (date <= today) {
                errors.push('Fecha estimada debe ser en el futuro');
            }
            else if (date > maxDate) {
                errors.push('Fecha estimada no puede ser más de un año en el futuro');
            }
        }
        // Validar incoterm
        const validIncoterms = ['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP'];
        if (!incoterm || !validIncoterms.includes(incoterm)) {
            errors.push(`Incoterm debe ser uno de: ${validIncoterms.join(', ')}`);
        }
        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors
            });
            return;
        }
        next();
    }
    /**
     * Validar parámetros de consulta
     */
    static validateQueryParams(req, res, next) {
        const { id, userId } = req.params;
        const errors = [];
        // Validar ID si está presente
        if (id && (id.length < 3 || id.length > 100)) {
            errors.push('ID debe tener entre 3 y 100 caracteres');
        }
        // Validar User ID si está presente
        if (userId && (userId.length < 3 || userId.length > 100)) {
            errors.push('User ID debe tener entre 3 y 100 caracteres');
        }
        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Parámetros inválidos',
                errors: errors
            });
            return;
        }
        next();
    }
    /**
     * Validar actualización de estado
     */
    static validateStatusUpdate(req, res, next) {
        const { status } = req.body;
        const validStatuses = ['draft', 'calculated', 'confirmed', 'expired'];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`,
                error: 'INVALID_STATUS'
            });
            return;
        }
        next();
    }
    /**
     * Validar confirmación de freight quote
     */
    static validateConfirmation(req, res, next) {
        const { rfqId } = req.body;
        const errors = [];
        if (!rfqId || rfqId.length < 3) {
            errors.push('RFQ ID es requerido y debe tener al menos 3 caracteres');
        }
        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors
            });
            return;
        }
        next();
    }
    /**
     * Rate limiting para cálculos de freight
     */
    static rateLimitFreightCalculations(req, res, next) {
        // Implementar rate limiting simple
        const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minuto
        const maxRequests = 10; // máximo 10 requests por minuto
        // En un entorno real, esto debería usar Redis o una base de datos
        // Por ahora usar un Map simple en memoria
        if (!req.app.locals.rateLimitStore) {
            req.app.locals.rateLimitStore = new Map();
        }
        const store = req.app.locals.rateLimitStore;
        const clientKey = `freight_calc_${clientIP}`;
        const clientData = store.get(clientKey) || { count: 0, resetTime: now + windowMs };
        if (now > clientData.resetTime) {
            // Reset window
            clientData.count = 1;
            clientData.resetTime = now + windowMs;
        }
        else {
            clientData.count++;
        }
        store.set(clientKey, clientData);
        if (clientData.count > maxRequests) {
            res.status(429).json({
                success: false,
                message: 'Demasiadas solicitudes. Intente nuevamente en un minuto.',
                error: 'RATE_LIMIT_EXCEEDED'
            });
            return;
        }
        next();
    }
    /**
     * Logging de operaciones de freight
     */
    static logFreightOperation(req, res, next) {
        const timestamp = new Date().toISOString();
        const operation = req.method + ' ' + req.originalUrl;
        const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
        console.log(`[${timestamp}] FREIGHT: ${operation} from ${clientIP}`);
        // En un entorno real, esto se enviaría a un sistema de logging
        next();
    }
}
exports.FreightValidationMiddleware = FreightValidationMiddleware;
