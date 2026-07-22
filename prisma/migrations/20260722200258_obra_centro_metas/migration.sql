-- CreateEnum
CREATE TYPE "ClasificacionObra" AS ENUM ('DISTRITAL', 'NACIONAL');

-- CreateEnum
CREATE TYPE "TamanoObra" AS ENUM ('MAYOR_2000', 'MENOR_2000');

-- CreateEnum
CREATE TYPE "PeriodicidadReporte" AS ENUM ('MENSUAL', 'TRIMESTRAL');

-- CreateTable
CREATE TABLE "centros_de_trabajo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centros_de_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "tipoVia" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "localidad" INTEGER,
    "area" DECIMAL(65,30) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "cantidadRcdProyectada" DECIMAL(65,30) NOT NULL,
    "cantidadMaterialAUsar" DECIMAL(65,30),
    "clasificacion" "ClasificacionObra" NOT NULL,
    "tamano" "TamanoObra" NOT NULL,
    "periodicidadReporte" "PeriodicidadReporte" NOT NULL,
    "lat" DECIMAL(65,30),
    "lng" DECIMAL(65,30),
    "centroDeTrabajoId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_periodo" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "cantidadEsperadaTon" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_periodo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_centroDeTrabajoId_fkey" FOREIGN KEY ("centroDeTrabajoId") REFERENCES "centros_de_trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas_periodo" ADD CONSTRAINT "metas_periodo_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
