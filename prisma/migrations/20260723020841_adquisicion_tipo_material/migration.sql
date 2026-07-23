/*
  Warnings:

  - Added the required column `rcdCatalogItemId` to the `adquisiciones_material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adquisiciones_material" ADD COLUMN     "rcdCatalogItemId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "adquisiciones_material" ADD CONSTRAINT "adquisiciones_material_rcdCatalogItemId_fkey" FOREIGN KEY ("rcdCatalogItemId") REFERENCES "rcd_catalog_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
