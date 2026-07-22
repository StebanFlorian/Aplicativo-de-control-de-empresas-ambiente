-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('NIT', 'CC');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "tipoVia" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "localidad" INTEGER,
    "telefono" TEXT NOT NULL,
    "telefono2" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'USUARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_numeroDocumento_key" ON "users"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "users_correo_key" ON "users"("correo");
