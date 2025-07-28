import pool from '../../db';

export interface NewProduct {
  title: string;
  description?: string;
  category_id: number;
  price: number;
  moq: number;
  unit: string;
  incoterm: string;
  origin_country: string;
  images?: string[];
  specifications?: any;
  container_type: string;
  units_per_container: number;
  unit_price: number;
  price_per_container: number;
  gross_weight: number;
  net_weight: number;
  volume: number;
  packaging_type?: string;
  production_time: number;
  stock_containers: number;
  is_negotiable: boolean;
}

export class ProductPgService {
  static async createProduct(supplierId: number, data: NewProduct) {
    const query = `INSERT INTO products (
      title, description, category_id, supplier_id, price, moq, unit, incoterm,
      origin_country, images, specifications, container_type, units_per_container,
      unit_price, price_per_container, gross_weight, net_weight, volume,
      packaging_type, production_time, stock_containers, is_negotiable
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
    ) RETURNING *`;

    const values = [
      data.title,
      data.description || null,
      data.category_id,
      supplierId,
      data.price,
      data.moq,
      data.unit,
      data.incoterm,
      data.origin_country,
      data.images || [],
      data.specifications || null,
      data.container_type,
      data.units_per_container,
      data.unit_price,
      data.price_per_container,
      data.gross_weight,
      data.net_weight,
      data.volume,
      data.packaging_type || null,
      data.production_time,
      data.stock_containers,
      data.is_negotiable,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getProductsByCategory(categoryId: number) {
    const query = 'SELECT * FROM products WHERE category_id = $1 AND is_active = true';
    const { rows } = await pool.query(query, [categoryId]);
    return rows;
  }
}
