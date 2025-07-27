// ================================================================
// CONFIGURACIÓN DE BASE DE DATOS - ZLCExpress Backend
// ================================================================
// Archivo: database/config/database.ts
// Descripción: Configuración y conexión a MySQL para el sistema de usuarios

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// ================================================================
// CONFIGURACIÓN DE CONEXIÓN
// ================================================================

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
  reconnect: boolean;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'zlc_app',
  password: process.env.DB_PASSWORD || 'secure_password_here',
  database: process.env.DB_NAME || 'zlcexpress',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'),
  timeout: parseInt(process.env.DB_TIMEOUT || '60000'),
  reconnect: true
};

// ================================================================
// POOL DE CONEXIONES
// ================================================================

export const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: config.connectionLimit,
  queueLimit: 0,
  acquireTimeout: config.acquireTimeout,
  timeout: config.timeout,
  reconnect: config.reconnect,
  charset: 'utf8mb4',
  timezone: '+00:00', // UTC
  dateStrings: false,
  multipleStatements: false // Seguridad: prevenir SQL injection
});

// ================================================================
// TIPOS DE DATOS
// ================================================================

export interface DatabaseUser {
  id: number;
  email: string;
  password: string;
  company_name: string;
  tax_id: string;
  operation_country: string;
  industry: string;
  contact_name: string;
  contact_position: string;
  contact_phone: string;
  fiscal_address: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  is_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  user_type: 'buyer' | 'supplier' | 'both';
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  last_used_at: Date;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
}

export interface AuthLog {
  id: number;
  user_id?: number;
  action: 'login' | 'logout' | 'failed_login' | 'token_refresh' | 'password_change';
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  created_at: Date;
}

// ================================================================
// FUNCIONES DE BASE DE DATOS
// ================================================================

export class DatabaseService {
  
  // ----------------------------------------------------------------
  // USUARIOS
  // ----------------------------------------------------------------
  
  /**
   * Buscar usuario por email
   */
  static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      
      return rows.length > 0 ? rows[0] as DatabaseUser : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Buscar usuario por ID
   */
  static async findUserById(id: number): Promise<DatabaseUser | null> {
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      
      return rows.length > 0 ? rows[0] as DatabaseUser : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Crear nuevo usuario
   */
  static async createUser(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser> {
    try {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO users (
          email, password, company_name, tax_id, operation_country, industry,
          contact_name, contact_position, contact_phone, fiscal_address,
          country, state, city, postal_code, is_verified, verification_status, user_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email, hashedPassword, userData.company_name, userData.tax_id,
          userData.operation_country, userData.industry, userData.contact_name,
          userData.contact_position, userData.contact_phone, userData.fiscal_address,
          userData.country, userData.state, userData.city, userData.postal_code,
          userData.is_verified, userData.verification_status, userData.user_type
        ]
      );

      const newUser = await this.findUserById(result.insertId);
      if (!newUser) {
        throw new Error('Failed to retrieve created user');
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Database error while creating user');
    }
  }

  /**
   * Actualizar usuario
   */
  static async updateUser(id: number, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    try {
      // Si se actualiza la contraseña, hashearla
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 12);
      }

      const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
      const values = fields.map(field => updates[field as keyof DatabaseUser]);
      
      if (fields.length === 0) {
        return await this.findUserById(id);
      }

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      
      await pool.execute(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, id]
      );

      return await this.findUserById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Database error while updating user');
    }
  }

  /**
   * Verificar contraseña
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // ----------------------------------------------------------------
  // SESIONES
  // ----------------------------------------------------------------

  /**
   * Crear sesión
   */
  static async createSession(sessionData: Omit<UserSession, 'id' | 'created_at' | 'last_used_at'>): Promise<UserSession> {
    try {
      const [result] = await pool.execute<mysql.ResultSetHeader>(
        `INSERT INTO user_sessions (
          user_id, token_hash, expires_at, ip_address, user_agent, is_active
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          sessionData.user_id, sessionData.token_hash, sessionData.expires_at,
          sessionData.ip_address, sessionData.user_agent, sessionData.is_active
        ]
      );

      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM user_sessions WHERE id = ?',
        [result.insertId]
      );

      return rows[0] as UserSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Database error while creating session');
    }
  }

  /**
   * Encontrar sesión por token hash
   */
  static async findSessionByTokenHash(tokenHash: string): Promise<UserSession | null> {
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM user_sessions WHERE token_hash = ? AND is_active = TRUE AND expires_at > NOW() LIMIT 1',
        [tokenHash]
      );
      
      return rows.length > 0 ? rows[0] as UserSession : null;
    } catch (error) {
      console.error('Error finding session:', error);
      throw new Error('Database error while finding session');
    }
  }

  /**
   * Invalidar sesión
   */
  static async invalidateSession(tokenHash: string): Promise<boolean> {
    try {
      const [result] = await pool.execute<mysql.ResultSetHeader>(
        'UPDATE user_sessions SET is_active = FALSE WHERE token_hash = ?',
        [tokenHash]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error invalidating session:', error);
      throw new Error('Database error while invalidating session');
    }
  }

  /**
   * Limpiar sesiones expiradas
   */
  static async cleanExpiredSessions(): Promise<number> {
    try {
      const [result] = await pool.execute<mysql.ResultSetHeader>(
        'DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE'
      );
      
      return result.affectedRows;
    } catch (error) {
      console.error('Error cleaning expired sessions:', error);
      throw new Error('Database error while cleaning sessions');
    }
  }

  // ----------------------------------------------------------------
  // LOGS DE AUDITORÍA
  // ----------------------------------------------------------------

  /**
   * Crear log de auditoría
   */
  static async createAuthLog(logData: Omit<AuthLog, 'id' | 'created_at'>): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO auth_logs (
          user_id, action, ip_address, user_agent, success, error_message
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          logData.user_id, logData.action, logData.ip_address,
          logData.user_agent, logData.success, logData.error_message
        ]
      );
    } catch (error) {
      console.error('Error creating auth log:', error);
      // No lanzar error para evitar interrumpir el flujo principal
    }
  }

  // ----------------------------------------------------------------
  // UTILIDADES
  // ----------------------------------------------------------------

  /**
   * Probar conexión a la base de datos
   */
  static async testConnection(): Promise<boolean> {
    try {
      const [rows] = await pool.execute('SELECT 1 as test');
      return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  static async getUserStats(): Promise<any> {
    try {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        `SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users,
          COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_users,
          COUNT(CASE WHEN user_type = 'buyer' THEN 1 END) as buyers,
          COUNT(CASE WHEN user_type = 'supplier' THEN 1 END) as suppliers,
          COUNT(CASE WHEN user_type = 'both' THEN 1 END) as both_types
        FROM users`
      );
      
      return rows[0];
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw new Error('Database error while getting user stats');
    }
  }

  /**
   * Cerrar todas las conexiones
   */
  static async closeConnections(): Promise<void> {
    try {
      await pool.end();
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }
}

// ================================================================
// MANEJO DE EVENTOS DE LA CONEXIÓN
// ================================================================

pool.on('connection', (connection) => {
  console.log('✅ Nueva conexión establecida con ID:', connection.threadId);
});

pool.on('error', (error) => {
  console.error('❌ Error en el pool de conexiones:', error);
  if (error.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Intentando reconectar...');
  }
});

// ================================================================
// EXPORTAR POOL Y CONFIGURACIÓN
// ================================================================

export { config };
export default pool;
