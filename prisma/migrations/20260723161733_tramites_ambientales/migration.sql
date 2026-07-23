-- CreateEnum
CREATE TYPE "EstadoTramite" AS ENUM ('PENDIENTE', 'RADICADO', 'EN_REVISION', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "documentos" ADD COLUMN     "tramiteId" TEXT;

-- CreateTable
CREATE TABLE "tramites_ambientales" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "entidad" TEXT,
    "estado" "EstadoTramite" NOT NULL DEFAULT 'PENDIENTE',
    "fechaRadicado" TIMESTAMP(3),
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tramites_ambientales_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_tramiteId_fkey" FOREIGN KEY ("tramiteId") REFERENCES "tramites_ambientales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tramites_ambientales" ADD CONSTRAINT "tramites_ambientales_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
