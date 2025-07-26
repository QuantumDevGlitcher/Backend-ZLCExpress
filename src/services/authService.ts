import { User, UserLogin, LoginResponse } from '../types';

// Mock database con usuarios empresariales verificados
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@zlcexpress.com',
    password: 'admin123',
    
    // Información de la empresa
    companyName: 'ZLC Express Admin',
    taxId: 'ZLC-2024-001',
    operationCountry: 'Colombia',
    industry: 'Logistics',
    
    // Contacto principal
    contactName: 'Administrador Sistema',
    contactPosition: 'CEO',
    contactPhone: '+57 300 123 4567',
    
    // Dirección fiscal
    fiscalAddress: 'Carrera 7 #123-45, Oficina 301',
    country: 'Colombia',
    state: 'Bogotá D.C.',
    city: 'Bogotá',
    postalCode: '110111',
    
    // Estado del usuario
    isVerified: true,
    verificationStatus: 'verified',
    userType: 'both',
    
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 2,
    email: 'importadora@empresa.com',
    password: 'importadora123',
    
    // Información de la empresa
    companyName: 'Importadora Global S.A.S',
    taxId: '900123456-7',
    operationCountry: 'Colombia',
    industry: 'Import/Export',
    
    // Contacto principal
    contactName: 'Carlos Mendoza',
    contactPosition: 'Gerente de Compras',
    contactPhone: '+57 310 987 6543',
    
    // Dirección fiscal
    fiscalAddress: 'Avenida El Dorado #45-67, Piso 8',
    country: 'Colombia',
    state: 'Bogotá D.C.',
    city: 'Bogotá',
    postalCode: '110221',
    
    // Estado del usuario
    isVerified: true,
    verificationStatus: 'verified',
    userType: 'buyer',
    
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date()
  },
  {
    id: 3,
    email: 'juanci123z@gmail.com',
    password: 'password123',
    
    // Información de la empresa (basado en el formulario)
    companyName: 'Importadora',
    taxId: '2342324',
    operationCountry: 'Brasil',
    industry: 'Automotriz',
    
    // Contacto principal
    contactName: 'Juan Mock Moreno',
    contactPosition: 'Gerente',
    contactPhone: '+50763952673',
    
    // Dirección fiscal
    fiscalAddress: 'Villa grecia sector 4',
    country: 'Panamá',
    state: 'Panamá',
    city: 'Ciudad de Panamá',
    postalCode: '507',
    
    // Estado del usuario
    isVerified: true,
    verificationStatus: 'verified',
    userType: 'buyer',
    
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date()
  },
  // === USUARIOS DEL FRONTEND ===
  {
    id: 4,
    email: 'comprador@demo.com',
    password: 'demo123',
    
    companyName: 'Demo Compradora S.A.',
    taxId: 'DEMO-001',
    operationCountry: 'Colombia',
    industry: 'Retail',
    
    contactName: 'Comprador Demo',
    contactPosition: 'Gerente de Compras',
    contactPhone: '+57 300 111 2222',
    
    fiscalAddress: 'Calle Demo 123',
    country: 'Colombia',
    state: 'Bogotá',
    city: 'Bogotá',
    postalCode: '111111',
    
    isVerified: true,
    verificationStatus: 'verified',
    userType: 'buyer',
    
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 5,
    email: 'comprador.pendiente@demo.com',
    password: 'demo123',
    
    companyName: 'Demo Pendiente S.A.',
    taxId: 'DEMO-002',
    operationCountry: 'Colombia',
    industry: 'Manufacturing',
    
    contactName: 'Comprador Pendiente',
    contactPosition: 'Director',
    contactPhone: '+57 300 333 4444',
    
    fiscalAddress: 'Avenida Pendiente 456',
    country: 'Colombia',
    state: 'Medellín',
    city: 'Medellín',
    postalCode: '222222',
    
    isVerified: false,
    verificationStatus: 'pending',
    userType: 'buyer',
    
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date()
  },
  {
    id: 6,
    email: 'proveedor@demo.com',
    password: 'demo123',
    
    companyName: 'Demo Proveedores Ltda.',
    taxId: 'DEMO-003',
    operationCountry: 'Colombia',
    industry: 'Supply Chain',
    
    contactName: 'Proveedor Demo',
    contactPosition: 'CEO',
    contactPhone: '+57 300 555 6666',
    
    fiscalAddress: 'Zona Industrial 789',
    country: 'Colombia',
    state: 'Cali',
    city: 'Cali',
    postalCode: '333333',
    
    isVerified: true,
    verificationStatus: 'verified',
    userType: 'supplier',
    
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  },
  {
    id: 7,
    email: 'proveedor.pendiente@demo.com',
    password: 'demo123',
    
    companyName: 'Proveedor Pendiente S.A.S.',
    taxId: 'DEMO-004',
    operationCountry: 'Colombia',
    industry: 'Technology',
    
    contactName: 'Proveedor Pendiente',
    contactPosition: 'Gerente General',
    contactPhone: '+57 300 777 8888',
    
    fiscalAddress: 'Tech Park 101',
    country: 'Colombia',
    state: 'Barranquilla',
    city: 'Barranquilla',
    postalCode: '444444',
    
    isVerified: false,
    verificationStatus: 'pending',
    userType: 'supplier',
    
    createdAt: new Date('2024-07-22'),
    updatedAt: new Date()
  },
  {
    id: 8,
    email: 'proveedor.rechazado@demo.com',
    password: 'demo123',
    
    companyName: 'Proveedor Rechazado Ltda.',
    taxId: 'DEMO-005',
    operationCountry: 'Colombia',
    industry: 'Services',
    
    contactName: 'Proveedor Rechazado',
    contactPosition: 'Director',
    contactPhone: '+57 300 999 0000',
    
    fiscalAddress: 'Rechazado Street 202',
    country: 'Colombia',
    state: 'Cartagena',
    city: 'Cartagena',
    postalCode: '555555',
    
    isVerified: false,
    verificationStatus: 'rejected',
    userType: 'supplier',
    
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date()
  }
];

export class AuthService {
  static async login(credentials: UserLogin): Promise<LoginResponse> {
    try {
      // Simular delay de consulta a base de datos
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = mockUsers.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
             u.password === credentials.password
      );

      if (!user) {
        return {
          success: false,
          message: 'Credenciales inválidas. Verifique su email y contraseña.'
        };
      }

      // Manejar diferentes estados de verificación
      if (user.verificationStatus === 'pending') {
        return {
          success: false,
          message: 'Su cuenta empresarial está en proceso de verificación. Este proceso puede tomar de 1-3 días hábiles.',
          user: {
            id: user.id,
            email: user.email,
            companyName: user.companyName,
            taxId: user.taxId,
            operationCountry: user.operationCountry,
            industry: user.industry,
            contactName: user.contactName,
            contactPosition: user.contactPosition,
            contactPhone: user.contactPhone,
            fiscalAddress: user.fiscalAddress,
            country: user.country,
            state: user.state,
            city: user.city,
            postalCode: user.postalCode,
            isVerified: user.isVerified,
            verificationStatus: user.verificationStatus,
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        };
      }

      if (user.verificationStatus === 'rejected') {
        return {
          success: false,
          message: 'Su solicitud de verificación ha sido rechazada. Por favor contacte soporte para más información.',
          user: {
            id: user.id,
            email: user.email,
            companyName: user.companyName,
            taxId: user.taxId,
            operationCountry: user.operationCountry,
            industry: user.industry,
            contactName: user.contactName,
            contactPosition: user.contactPosition,
            contactPhone: user.contactPhone,
            fiscalAddress: user.fiscalAddress,
            country: user.country,
            state: user.state,
            city: user.city,
            postalCode: user.postalCode,
            isVerified: user.isVerified,
            verificationStatus: user.verificationStatus,
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        };
      }

      // Usuario verificado - login exitoso
      if (user.verificationStatus === 'verified') {
        // Simular token JWT
        const token = `jwt-token-${user.id}-${Date.now()}`;

        const { password, ...userWithoutPassword } = user;

        return {
          success: true,
          message: 'Inicio de sesión exitoso',
          user: userWithoutPassword,
          token
        };
      }

      // Estado desconocido
      return {
        success: false,
        message: 'Estado de cuenta no válido. Contacte al administrador.'
      };

    } catch (error: any) {
      console.error('Error en AuthService.login:', error);
      return {
        success: false,
        message: 'Error interno del servidor. Intente nuevamente.'
      };
    }
  }

  static async getProfile(userId: number): Promise<Omit<User, 'password'> | null> {
    try {
      // Simular delay de consulta a base de datos
      await new Promise(resolve => setTimeout(resolve, 200));

      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      return null;
    }
  }

  static async validateToken(token: string): Promise<number | null> {
    try {
      // Simular validación de token JWT
      // En una implementación real, aquí decodificarías y validarías el JWT
      const parts = token.split('-');
      if (parts.length >= 3 && parts[0] === 'jwt' && parts[1] === 'token') {
        const userId = parseInt(parts[2]);
        const user = mockUsers.find(u => u.id === userId);
        return user && user.isVerified ? userId : null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Método para obtener lista de usuarios (solo para admin)
  static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return mockUsers.map(({ password, ...user }) => user);
  }
}
