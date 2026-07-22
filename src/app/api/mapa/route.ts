import { NextRequest, NextResponse } from "next/server";

import { calcularEstadoObra } from "@/lib/estado-reporte";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const centro = request.nextUrl.searchParams.get("centro") ?? undefined;

  const obras = await prisma.obra.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
      ...(centro ? { centroDeTrabajoId: centro } : {}),
    },
    include: {
      metas: true,
      reportes: { select: { periodoInicio: true, periodoFin: true, estado: true } },
      centroDeTrabajo: { select: { nombre: true } },
    },
  });

  const pines = obras.map((obra) => ({
    id: obra.id,
    nombre: obra.nombre,
    lat: Number(obra.lat),
    lng: Number(obra.lng),
    clasificacion: obra.clasificacion,
    tamano: obra.tamano,
    centroDeTrabajo: obra.centroDeTrabajo?.nombre ?? null,
    estado: calcularEstadoObra(obra.metas, obra.reportes),
  }));

  return NextResponse.json(pines);
}
