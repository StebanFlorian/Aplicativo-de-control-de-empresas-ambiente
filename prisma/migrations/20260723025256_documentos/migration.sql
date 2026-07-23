/*
  Warnings:

  - You are about to drop the column `archivoNombreOriginal` on the `reportes_rcd` table. All the data in the column will be lost.
  - You are about to drop the column `archivoUrl` on the `reportes_rcd` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reportes_rcd" DROP COLUMN "archivoNombreOriginal",
DROP COLUMN "archivoUrl";

-- CreateTable
CREATE TABLE "documentos" (
    "id" TEXT NOT NULL,
    "obraId" TEXT,
    "reporteId" TEXT,
    "archivoUrl" TEXT NOT NULL,
    "archivoNombreOriginal" TEXT NOT NULL,
    "descripcion" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "reportes_rcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
