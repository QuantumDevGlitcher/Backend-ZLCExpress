"use strict";
// Tipos para el sistema de RFQ (Request for Quotation)
Object.defineProperty(exports, "__esModule", { value: true });
exports.INCOTERM_DESCRIPTIONS = exports.INCOTERMS = exports.CONTAINER_TYPES = exports.RFQ_PRIORITY = exports.RFQ_STATUS = void 0;
// Constantes para el sistema RFQ
exports.RFQ_STATUS = {
    PENDING: 'pending',
    QUOTED: 'quoted',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
};
exports.RFQ_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};
exports.CONTAINER_TYPES = {
    '20GP': '20GP',
    '40GP': '40GP',
    '40HC': '40HC',
    '45HC': '45HC'
};
exports.INCOTERMS = {
    EXW: 'EXW',
    FOB: 'FOB',
    CIF: 'CIF',
    CFR: 'CFR',
    DDP: 'DDP',
    DAP: 'DAP'
};
exports.INCOTERM_DESCRIPTIONS = {
    EXW: 'Ex Works - El vendedor entrega cuando pone la mercancía a disposición del comprador en sus instalaciones',
    FOB: 'Free on Board - El vendedor entrega la mercancía a bordo del buque designado por el comprador',
    CIF: 'Cost, Insurance & Freight - El vendedor paga flete y seguro hasta el puerto de destino',
    CFR: 'Cost and Freight - El vendedor paga el flete hasta el puerto de destino',
    DDP: 'Delivered Duty Paid - El vendedor entrega la mercancía en el lugar convenido, con todos los gastos pagados',
    DAP: 'Delivered at Place - El vendedor entrega cuando la mercancía se pone a disposición en el lugar convenido'
};
