import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { databaseService } from './services/prismaService';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    const dbHealth = await databaseService.healthCheck();
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'ZLCExpress Backend is running',
      database: dbHealth ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Service unavailable',
      database: 'Error',
      timestamp: new Date().toISOString()
    });
  }
});

// Database health check específico
app.get('/health/database', async (req, res) => {
  try {
    const isHealthy = await databaseService.healthCheck();
    const stats = await databaseService.getUserStats();
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      message: isHealthy ? 'Database connected' : 'Database disconnected',
      stats: isHealthy ? stats : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint para estadísticas de usuarios
app.get('/debug/users', async (req, res) => {
  try {
    const stats = await databaseService.getUserStats();
    const countriesStats = await databaseService.getUsersByCountry();
    
    res.status(200).json({
      success: true,
      message: 'Estadísticas de usuarios',
      data: {
        stats,
        byCountry: countriesStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas de usuarios',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Test endpoint para verificar integración del login
app.get('/test/auth', async (req, res) => {
  try {
    // Probar login con usuario de prueba
    const testLogin = await databaseService.authenticateUser(
      { email: 'admin@zlcexpress.com', password: 'admin123' },
      { ipAddress: req.ip, userAgent: req.get('User-Agent') }
    );
    
    if (testLogin) {
      const { password: _, ...userWithoutPassword } = testLogin.user;
      res.json({
        success: true,
        message: '✅ Sistema de login integrado correctamente con PostgreSQL + Prisma',
        data: {
          user: userWithoutPassword,
          hasToken: !!testLogin.token,
          tokenType: 'JWT'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: '❌ Error en integración del login'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Error probando integración',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

export default app;