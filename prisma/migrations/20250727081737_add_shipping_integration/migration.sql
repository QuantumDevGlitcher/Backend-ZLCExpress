-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "container_type" VARCHAR(50),
ADD COLUMN     "destination_port" VARCHAR(255),
ADD COLUMN     "estimated_shipping_date" TIMESTAMP(3),
ADD COLUMN     "incoterm" VARCHAR(10),
ADD COLUMN     "origin_port" VARCHAR(255),
ADD COLUMN     "payment_method" VARCHAR(100),
ADD COLUMN     "shipping_address" TEXT,
ADD COLUMN     "shipping_carrier" VARCHAR(255),
ADD COLUMN     "shipping_cost" DECIMAL(10,2),
ADD COLUMN     "transit_time" INTEGER;

-- CreateTable
CREATE TABLE "shipping_quotes" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "origin_port" VARCHAR(255) NOT NULL,
    "destination_port" VARCHAR(255) NOT NULL,
    "container_type" VARCHAR(50) NOT NULL,
    "container_count" INTEGER NOT NULL DEFAULT 1,
    "carrier" VARCHAR(255) NOT NULL,
    "carrier_code" VARCHAR(50) NOT NULL,
    "service_type" VARCHAR(100) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "transit_time" INTEGER NOT NULL,
    "estimated_departure" TIMESTAMP(3) NOT NULL,
    "estimated_arrival" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "incoterm" VARCHAR(10) NOT NULL,
    "conditions" TEXT,
    "is_selected" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shipping_quotes_order_id_idx" ON "shipping_quotes"("order_id");

-- CreateIndex
CREATE INDEX "shipping_quotes_user_id_idx" ON "shipping_quotes"("user_id");

-- CreateIndex
CREATE INDEX "shipping_quotes_origin_port_idx" ON "shipping_quotes"("origin_port");

-- CreateIndex
CREATE INDEX "shipping_quotes_destination_port_idx" ON "shipping_quotes"("destination_port");

-- CreateIndex
CREATE INDEX "shipping_quotes_carrier_idx" ON "shipping_quotes"("carrier");

-- CreateIndex
CREATE INDEX "shipping_quotes_cost_idx" ON "shipping_quotes"("cost");

-- CreateIndex
CREATE INDEX "shipping_quotes_valid_until_idx" ON "shipping_quotes"("valid_until");

-- CreateIndex
CREATE INDEX "shipping_quotes_is_selected_idx" ON "shipping_quotes"("is_selected");

-- AddForeignKey
ALTER TABLE "shipping_quotes" ADD CONSTRAINT "shipping_quotes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_quotes" ADD CONSTRAINT "shipping_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
