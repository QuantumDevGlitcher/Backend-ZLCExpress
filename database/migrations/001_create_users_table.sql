-- ================================================================
-- MIGRACIÓN DE BASE DE DATOS: Sistema de Usuarios - ZLCExpress
-- ================================================================
-- Archivo: 001_create_users_table.sql
-- Descripción: Crea la tabla de usuarios empresariales y datos iniciales
-- Fecha: 2025-07-26
-- Versión: 1.0

-- Crear base de datos si no existe
-- CREATE DATABASE IF NOT EXISTS zlcexpress;
-- USE zlcexpress;

-- ================================================================
-- TABLA PRINCIPAL: users
-- ================================================================

CREATE TABLE IF NOT EXISTS users (
    -- Clave primaria
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Credenciales de acceso
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Información de la empresa
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) NOT NULL,
    operation_country VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    
    -- Contacto principal
    contact_name VARCHAR(255) NOT NULL,
    contact_position VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    
    -- Dirección fiscal
    fiscal_address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    
    -- Estado del usuario
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    user_type ENUM('buyer', 'supplier', 'both') DEFAULT 'buyer',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_email (email),
    INDEX idx_verification_status (verification_status),
    INDEX idx_is_verified (is_verified),
    INDEX idx_user_type (user_type),
    INDEX idx_tax_id (tax_id),
    INDEX idx_company_name (company_name),
    INDEX idx_operation_country (operation_country),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA DE SESIONES (para JWT y control de sesiones)
-- ================================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA DE LOGS DE AUDITORÍA
-- ================================================================

CREATE TABLE IF NOT EXISTS auth_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action ENUM('login', 'logout', 'failed_login', 'token_refresh', 'password_change') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key (nullable para failed logins)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DATOS INICIALES DE PRUEBA
-- ================================================================

-- Insertar usuarios de prueba (las contraseñas deberán ser hasheadas en producción)
INSERT INTO users (
    email, password, company_name, tax_id, operation_country, industry,
    contact_name, contact_position, contact_phone, fiscal_address,
    country, state, city, postal_code, is_verified, verification_status, user_type
) VALUES 
(
    'admin@zlcexpress.com',
    'admin123', -- En producción: bcrypt hash
    'ZLC Express Admin',
    'ZLC-2024-001',
    'Colombia',
    'Logistics',
    'Administrador Sistema',
    'CEO',
    '+57 300 123 4567',
    'Carrera 7 #123-45, Oficina 301',
    'Colombia',
    'Bogotá D.C.',
    'Bogotá',
    '110111',
    TRUE,
    'verified',
    'both'
),
(
    'importadora@empresa.com',
    'importadora123', -- En producción: bcrypt hash
    'Importadora Global S.A.S',
    'IMP-2024-002',
    'Colombia',
    'Import/Export',
    'María González',
    'Gerente de Compras',
    '+57 310 987 6543',
    'Avenida El Dorado #45-67, Torre B, Piso 12',
    'Colombia',
    'Bogotá D.C.',
    'Bogotá',
    '110221',
    TRUE,
    'verified',
    'buyer'
),
(
    'juanci123z@gmail.com',
    'password123', -- En producción: bcrypt hash
    'Importadora JC',
    '2342324',
    'Colombia',
    'Commercial',
    'Juan Carlos',
    'Director General',
    '+57 320 456 7890',
    'Calle 26 #13-19, Oficina 502',
    'Colombia',
    'Bogotá D.C.',
    'Bogotá',
    '110311',
    TRUE,
    'verified',
    'buyer'
),
(
    'supplier@textiles.com',
    'supplier123', -- En producción: bcrypt hash
    'Textiles Premium SA',
    'TEXT-2024-003',
    'China',
    'Textiles',
    'Li Wei',
    'Sales Manager',
    '+86 138 0013 8000',
    'No. 123 Guangzhou Road, Tianhe District',
    'China',
    'Guangdong',
    'Guangzhou',
    '510000',
    TRUE,
    'verified',
    'supplier'
),
(
    'demo@pending.com',
    'demo123', -- En producción: bcrypt hash
    'Empresa Pendiente SAS',
    'PEND-2024-004',
    'Colombia',
    'Various',
    'Demo User',
    'Manager',
    '+57 301 111 2222',
    'Carrera 15 #85-32',
    'Colombia',
    'Bogotá D.C.',
    'Bogotá',
    '110411',
    FALSE,
    'pending',
    'buyer'
);

-- ================================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ================================================================

-- Procedimiento para limpiar sesiones expiradas
DELIMITER //
CREATE PROCEDURE CleanExpiredSessions()
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = FALSE;
    
    SELECT ROW_COUNT() as sessions_cleaned;
END //
DELIMITER ;

-- Procedimiento para obtener estadísticas de usuarios
DELIMITER //
CREATE PROCEDURE GetUserStats()
BEGIN
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
        COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_users,
        COUNT(CASE WHEN user_type = 'buyer' THEN 1 END) as buyers,
        COUNT(CASE WHEN user_type = 'supplier' THEN 1 END) as suppliers,
        COUNT(CASE WHEN user_type = 'both' THEN 1 END) as both_types,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_last_30_days
    FROM users;
END //
DELIMITER ;

-- ================================================================
-- VISTAS ÚTILES
-- ================================================================

-- Vista de usuarios activos verificados
CREATE VIEW active_users AS
SELECT 
    id, email, company_name, tax_id, operation_country, industry,
    contact_name, contact_position, contact_phone, user_type,
    created_at, updated_at
FROM users 
WHERE is_verified = TRUE AND verification_status = 'verified';

-- Vista de estadísticas por país
CREATE VIEW users_by_country AS
SELECT 
    operation_country as country,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
    COUNT(CASE WHEN user_type = 'buyer' THEN 1 END) as buyers,
    COUNT(CASE WHEN user_type = 'supplier' THEN 1 END) as suppliers
FROM users 
GROUP BY operation_country
ORDER BY total_users DESC;

-- ================================================================
-- TRIGGERS PARA AUDITORÍA
-- ================================================================

-- Trigger para log de cambios en usuarios
DELIMITER //
CREATE TRIGGER user_update_log 
AFTER UPDATE ON users 
FOR EACH ROW 
BEGIN
    IF OLD.verification_status != NEW.verification_status THEN
        INSERT INTO auth_logs (user_id, action, success, error_message) 
        VALUES (NEW.id, 'verification_change', TRUE, 
                CONCAT('Status changed from ', OLD.verification_status, ' to ', NEW.verification_status));
    END IF;
END //
DELIMITER ;

-- ================================================================
-- EVENTOS PROGRAMADOS
-- ================================================================

-- Evento para limpiar sesiones expiradas cada hora
CREATE EVENT IF NOT EXISTS cleanup_sessions
ON SCHEDULE EVERY 1 HOUR
DO
    CALL CleanExpiredSessions();

-- ================================================================
-- PERMISOS Y SEGURIDAD
-- ================================================================

-- Crear usuario específico para la aplicación (ejecutar como root)
-- CREATE USER 'zlc_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON zlcexpress.users TO 'zlc_app'@'localhost';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON zlcexpress.user_sessions TO 'zlc_app'@'localhost';
-- GRANT SELECT, INSERT ON zlcexpress.auth_logs TO 'zlc_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ================================================================
-- VERIFICACIÓN DE LA INSTALACIÓN
-- ================================================================

-- Mostrar resumen de la instalación
SELECT 
    'Instalación completada exitosamente' as status,
    COUNT(*) as users_created,
    NOW() as installation_time
FROM users;

-- Verificar que los índices se crearon correctamente
SHOW INDEX FROM users;

-- ================================================================
-- NOTAS IMPORTANTES
-- ================================================================

/*
NOTAS PARA PRODUCCIÓN:

1. SEGURIDAD:
   - Cambiar todas las contraseñas por hashes bcrypt
   - Configurar SSL/TLS para conexiones
   - Implementar rate limiting en la aplicación
   - Configurar firewall de base de datos

2. PERFORMANCE:
   - Considerar particionamiento si se esperan muchos usuarios
   - Configurar pool de conexiones apropiado
   - Monitorear queries lentas

3. BACKUP:
   - Configurar backups automáticos diarios
   - Probar restauración periódicamente
   - Replicación para alta disponibilidad

4. MONITOREO:
   - Configurar alertas para fallos de login excesivos
   - Monitorear crecimiento de tablas de logs
   - Alertas para usuarios no verificados por mucho tiempo

5. MANTENIMIENTO:
   - Ejecutar CleanExpiredSessions() regularmente
   - Archivar logs antiguos (> 1 año)
   - Revisar usuarios inactivos periódicamente

6. MIGRACIÓN DESDE SISTEMA ACTUAL:
   - Actualizar authService.ts para usar BD real
   - Implementar bcrypt para passwords
   - Reemplazar JWT mock por JWT real con secret
   - Configurar variables de entorno para DB
*/
