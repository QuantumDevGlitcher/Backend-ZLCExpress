-- CreateEnum
CREATE TYPE "quote_status" AS ENUM ('pending', 'draft', 'sent', 'quoted', 'counter_offer', 'accepted', 'rejected', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "quotes" (
    "id" SERIAL NOT NULL,
    "quote_number" VARCHAR(50) NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "product_title" VARCHAR(255) NOT NULL,
    "container_quantity" INTEGER NOT NULL,
    "container_type" VARCHAR(20) NOT NULL,
    "status" "quote_status" NOT NULL DEFAULT 'pending',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "unit_price" DECIMAL(12,2),
    "total_price" DECIMAL(12,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "incoterm" VARCHAR(10),
    "payment_terms" TEXT,
    "delivery_terms" TEXT,
    "lead_time" INTEGER,
    "minimum_order_qty" INTEGER,
    "logistics_comments" TEXT,
    "special_requirements" TEXT,
    "supplier_comments" TEXT,
    "request_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_deadline" TIMESTAMP(3),
    "quoted_at" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "freight_quote_id" INTEGER,
    "estimated_value" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "item_description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "specifications" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_responses" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "response_type" VARCHAR(20) NOT NULL,
    "unit_price" DECIMAL(12,2),
    "total_price" DECIMAL(12,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "delivery_time" INTEGER,
    "payment_terms" TEXT,
    "validity_period" INTEGER,
    "minimum_order_qty" INTEGER,
    "supplier_comments" TEXT,
    "technical_specs" TEXT,
    "special_conditions" TEXT,
    "rejection_reason" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'submitted',
    "is_counter_offer" BOOLEAN NOT NULL DEFAULT false,
    "response_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_documents" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "uploaded_by" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quote_number_key" ON "quotes"("quote_number");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_freight_quote_id_key" ON "quotes"("freight_quote_id");

-- CreateIndex
CREATE INDEX "quotes_quote_number_idx" ON "quotes"("quote_number");

-- CreateIndex
CREATE INDEX "quotes_buyer_id_idx" ON "quotes"("buyer_id");

-- CreateIndex
CREATE INDEX "quotes_supplier_id_idx" ON "quotes"("supplier_id");

-- CreateIndex
CREATE INDEX "quotes_product_id_idx" ON "quotes"("product_id");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_request_date_idx" ON "quotes"("request_date");

-- CreateIndex
CREATE INDEX "quotes_valid_until_idx" ON "quotes"("valid_until");

-- CreateIndex
CREATE INDEX "quotes_total_price_idx" ON "quotes"("total_price");

-- CreateIndex
CREATE INDEX "quote_items_quote_id_idx" ON "quote_items"("quote_id");

-- CreateIndex
CREATE INDEX "quote_items_product_id_idx" ON "quote_items"("product_id");

-- CreateIndex
CREATE INDEX "quote_responses_quote_id_idx" ON "quote_responses"("quote_id");

-- CreateIndex
CREATE INDEX "quote_responses_supplier_id_idx" ON "quote_responses"("supplier_id");

-- CreateIndex
CREATE INDEX "quote_responses_response_type_idx" ON "quote_responses"("response_type");

-- CreateIndex
CREATE INDEX "quote_responses_status_idx" ON "quote_responses"("status");

-- CreateIndex
CREATE INDEX "quote_responses_response_date_idx" ON "quote_responses"("response_date");

-- CreateIndex
CREATE INDEX "quote_documents_quote_id_idx" ON "quote_documents"("quote_id");

-- CreateIndex
CREATE INDEX "quote_documents_document_type_idx" ON "quote_documents"("document_type");

-- CreateIndex
CREATE INDEX "quote_documents_uploaded_by_idx" ON "quote_documents"("uploaded_by");

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_freight_quote_id_fkey" FOREIGN KEY ("freight_quote_id") REFERENCES "shipping_quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_responses" ADD CONSTRAINT "quote_responses_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_responses" ADD CONSTRAINT "quote_responses_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_documents" ADD CONSTRAINT "quote_documents_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_documents" ADD CONSTRAINT "quote_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
