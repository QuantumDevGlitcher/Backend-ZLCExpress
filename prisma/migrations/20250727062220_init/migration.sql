-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('buyer', 'supplier', 'both');

-- CreateEnum
CREATE TYPE "auth_action" AS ENUM ('login', 'logout', 'failed_login', 'token_refresh', 'password_change');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'expired');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(50) NOT NULL,
    "operation_country" VARCHAR(100) NOT NULL,
    "industry" VARCHAR(100) NOT NULL,
    "contact_name" VARCHAR(255) NOT NULL,
    "contact_position" VARCHAR(100) NOT NULL,
    "contact_phone" VARCHAR(20) NOT NULL,
    "fiscal_address" TEXT NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" "verification_status" NOT NULL DEFAULT 'pending',
    "user_type" "user_type" NOT NULL DEFAULT 'buyer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" "auth_action" NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "min_quantity" INTEGER NOT NULL,
    "max_quantity" INTEGER,
    "unit" VARCHAR(50) NOT NULL,
    "incoterm" VARCHAR(20) NOT NULL,
    "origin_country" VARCHAR(100) NOT NULL,
    "images" VARCHAR(255)[],
    "specifications" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "container_type" VARCHAR(10) NOT NULL DEFAULT '40GP',
    "units_per_container" INTEGER NOT NULL DEFAULT 0,
    "moq" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "price_per_container" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gross_weight" INTEGER NOT NULL DEFAULT 0,
    "net_weight" INTEGER NOT NULL DEFAULT 0,
    "volume" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "packaging_type" VARCHAR(255),
    "stock_containers" INTEGER NOT NULL DEFAULT 0,
    "is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "allows_custom_orders" BOOLEAN NOT NULL DEFAULT false,
    "production_time" INTEGER NOT NULL DEFAULT 0,
    "packaging_time" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_inquiries" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "payment_terms" TEXT,
    "delivery_terms" TEXT,
    "notes" TEXT,
    "expires_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "specifications" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_verification_status_idx" ON "users"("verification_status");

-- CreateIndex
CREATE INDEX "users_is_verified_idx" ON "users"("is_verified");

-- CreateIndex
CREATE INDEX "users_user_type_idx" ON "users"("user_type");

-- CreateIndex
CREATE INDEX "users_tax_id_idx" ON "users"("tax_id");

-- CreateIndex
CREATE INDEX "users_company_name_idx" ON "users"("company_name");

-- CreateIndex
CREATE INDEX "users_operation_country_idx" ON "users"("operation_country");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_sessions_token_hash_idx" ON "user_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "user_sessions_is_active_idx" ON "user_sessions"("is_active");

-- CreateIndex
CREATE INDEX "auth_logs_user_id_idx" ON "auth_logs"("user_id");

-- CreateIndex
CREATE INDEX "auth_logs_action_idx" ON "auth_logs"("action");

-- CreateIndex
CREATE INDEX "auth_logs_created_at_idx" ON "auth_logs"("created_at");

-- CreateIndex
CREATE INDEX "auth_logs_success_idx" ON "auth_logs"("success");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_is_active_idx" ON "categories"("is_active");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE INDEX "products_title_idx" ON "products"("title");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_supplier_id_idx" ON "products"("supplier_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_price_per_container_idx" ON "products"("price_per_container");

-- CreateIndex
CREATE INDEX "products_container_type_idx" ON "products"("container_type");

-- CreateIndex
CREATE INDEX "products_moq_idx" ON "products"("moq");

-- CreateIndex
CREATE INDEX "products_stock_containers_idx" ON "products"("stock_containers");

-- CreateIndex
CREATE INDEX "products_origin_country_idx" ON "products"("origin_country");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_order_number_idx" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_buyer_id_idx" ON "orders"("buyer_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_totalAmount_idx" ON "orders"("totalAmount");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_expires_at_idx" ON "orders"("expires_at");

-- CreateIndex
CREATE INDEX "order_details_order_id_idx" ON "order_details"("order_id");

-- CreateIndex
CREATE INDEX "order_details_product_id_idx" ON "order_details"("product_id");

-- CreateIndex
CREATE INDEX "order_details_supplier_id_idx" ON "order_details"("supplier_id");

-- CreateIndex
CREATE INDEX "order_details_totalPrice_idx" ON "order_details"("totalPrice");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_logs" ADD CONSTRAINT "auth_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
