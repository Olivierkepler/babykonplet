-- Safe enum sync: preserve all rows; remap only obsolete labels.
-- Mapping:
--   Order.status: PENDING -> PENDING_PAYMENT, FULFILLED -> COMPLETED, FAILED -> CANCELLED
--   Order.paymentStatus / Payment.status: PAID -> CAPTURED (idempotent; other labels unchanged)

-- 1) Create ShipmentStatus (present in schema.prisma, missing in DB).
--    No tables use it yet; this only adds the type.
CREATE TYPE "ShipmentStatus" AS ENUM (
  'CREATED',
  'LABEL_CREATED',
  'PICKED_UP',
  'IN_TRANSIT',
  'ARRIVED_AT_HUB',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED'
);

-- 2) Rebuild OrderStatus to match schema.prisma.
--    Create the new type first (no row changes yet).
CREATE TYPE "OrderStatus_new" AS ENUM (
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'PACKING',
  'READY_TO_SHIP',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'RETURN_REQUESTED',
  'RETURNED',
  'REFUNDED'
);

-- 3) Drop the old default so the column type can change.
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

-- 4) Convert Order.status with explicit remaps for obsolete labels.
--    Existing PAID / CANCELLED / already-new labels pass through unchanged.
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus_new"
  USING (
    CASE status::text
      WHEN 'PENDING' THEN 'PENDING_PAYMENT'
      WHEN 'FULFILLED' THEN 'COMPLETED'
      WHEN 'FAILED' THEN 'CANCELLED'
      ELSE status::text
    END
  )::"OrderStatus_new";

-- 5) Replace old OrderStatus type with the new one.
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";

-- 6) Restore default to schema default PENDING_PAYMENT.
ALTER TABLE "Order"
  ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT'::"OrderStatus";

-- 7) Rebuild PaymentStatus to match schema.prisma.
CREATE TYPE "PaymentStatus_new" AS ENUM (
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED'
);

-- 8) Drop defaults on both columns that use PaymentStatus.
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;

-- 9) Convert Order.paymentStatus; remap obsolete PAID -> CAPTURED.
ALTER TABLE "Order"
  ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new"
  USING (
    CASE "paymentStatus"::text
      WHEN 'PAID' THEN 'CAPTURED'
      ELSE "paymentStatus"::text
    END
  )::"PaymentStatus_new";

-- 10) Convert Payment.status the same way.
ALTER TABLE "Payment"
  ALTER COLUMN "status" TYPE "PaymentStatus_new"
  USING (
    CASE status::text
      WHEN 'PAID' THEN 'CAPTURED'
      ELSE status::text
    END
  )::"PaymentStatus_new";

-- 11) Replace old PaymentStatus type with the new one.
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";

-- 12) Restore PaymentStatus defaults to PENDING.
ALTER TABLE "Order"
  ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING'::"PaymentStatus";
ALTER TABLE "Payment"
  ALTER COLUMN "status" SET DEFAULT 'PENDING'::"PaymentStatus";
