-- CreateEnum
CREATE TYPE "NivelCatalogoRcd" AS ENUM ('GRUPO', 'ITEM');

-- CreateEnum
CREATE TYPE "TipoTratamiento" AS ENUM ('DISPOSICION_FINAL', 'REUTILIZACION', 'RECICLAJE', 'OTROS');

-- CreateEnum
CREATE TYPE "TipoFormularioReporte" AS ENUM ('FORM_3_1', 'FORM_3_2', 'OBRA_DISTRITAL_MENOR', 'OBRA_NACIONAL');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('BORRADOR', 'ENVIADO');

-- CreateTable
CREATE TABLE "rcd_catalog_items" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "NivelCatalogoRcd" NOT NULL,
    "requiereTratamiento" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,

    CONSTRAINT "rcd_catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes_rcd" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "tipoFormulario" "TipoFormularioReporte" NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'BORRADOR',
    "fechaEnvio" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportes_rcd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adquisiciones_material" (
    "id" TEXT NOT NULL,
    "reporteId" TEXT NOT NULL,
    "cantidadTon" DECIMAL(65,30) NOT NULL,
    "proveedor" TEXT NOT NULL,

    CONSTRAINT "adquisiciones_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporte_rcd_items" (
    "id" TEXT NOT NULL,
    "reporteId" TEXT NOT NULL,
    "rcdCatalogItemId" TEXT NOT NULL,
    "cantidadTon" DECIMAL(65,30) NOT NULL,
    "tratamiento" "TipoTratamiento",
    "lugarDisposicionFinal" TEXT,

    CONSTRAINT "reporte_rcd_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reporte_rcd_items_reporteId_rcdCatalogItemId_key" ON "reporte_rcd_items"("reporteId", "rcdCatalogItemId");

-- AddForeignKey
ALTER TABLE "rcd_catalog_items" ADD CONSTRAINT "rcd_catalog_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "rcd_catalog_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_rcd" ADD CONSTRAINT "reportes_rcd_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adquisiciones_material" ADD CONSTRAINT "adquisiciones_material_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "reportes_rcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_rcd_items" ADD CONSTRAINT "reporte_rcd_items_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "reportes_rcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporte_rcd_items" ADD CONSTRAINT "reporte_rcd_items_rcdCatalogItemId_fkey" FOREIGN KEY ("rcdCatalogItemId") REFERENCES "rcd_catalog_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
