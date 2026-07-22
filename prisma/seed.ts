import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { RCD_CATALOG, type RcdCatalogNodeSeed } from "../src/lib/rcd-catalog";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const adminNumeroDocumento = "1000000000";
  const adminPassword = "Admin123!";

  const existing = await prisma.user.findUnique({
    where: { numeroDocumento: adminNumeroDocumento },
  });

  if (existing) {
    console.log("Admin ya existe, no se vuelve a crear.");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      tipoDocumento: "CC",
      numeroDocumento: adminNumeroDocumento,
      passwordHash,
      correo: "admin@controlrcd.local",
      tipoVia: "CL",
      direccion: "CL 1 # 1-01",
      telefono: "3000000000",
      rol: "ADMIN",
    },
  });

  console.log(`Admin creado. Login: ${adminNumeroDocumento} / Contraseña: ${adminPassword}`);
}

async function seedNodo(nodo: RcdCatalogNodeSeed, parentId: string | null) {
  const esGrupo = !!nodo.hijos?.length;

  const registro = await prisma.rcdCatalogItem.upsert({
    where: { codigo: nodo.codigo },
    update: { nombre: nodo.nombre, nivel: esGrupo ? "GRUPO" : "ITEM", parentId },
    create: {
      codigo: nodo.codigo,
      nombre: nodo.nombre,
      nivel: esGrupo ? "GRUPO" : "ITEM",
      requiereTratamiento: !esGrupo,
      parentId,
    },
  });

  for (const hijo of nodo.hijos ?? []) {
    await seedNodo(hijo, registro.id);
  }
}

async function seedCatalogoRcd() {
  const count = await prisma.rcdCatalogItem.count();
  if (count > 0) {
    console.log("Catálogo RCD ya sembrado, no se vuelve a crear.");
    return;
  }

  for (const nodo of RCD_CATALOG) {
    await seedNodo(nodo, null);
  }
  console.log("Catálogo RCD sembrado.");
}

async function main() {
  await seedAdmin();
  await seedCatalogoRcd();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
