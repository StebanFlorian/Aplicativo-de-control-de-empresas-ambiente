import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
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

  console.log(
    `Admin creado. Login: ${adminNumeroDocumento} / Contraseña: ${adminPassword}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
