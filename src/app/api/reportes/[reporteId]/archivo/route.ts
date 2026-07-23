import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";

// Proxy autenticado para descargar el archivo adjunto de un reporte manual
// (el blob es privado, así que el navegador no puede pedirlo directamente).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reporteId: string }> },
) {
  const { reporteId } = await params;
  const session = await requireSession();

  const reporte = await prisma.reporteRCD.findUnique({
    where: { id: reporteId },
    include: { obra: true },
  });

  if (!reporte || !reporte.archivoUrl) {
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
  }
  if (!isOwnerOrAdmin(session, reporte.obra.userId)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const blob = await get(reporte.archivoUrl, { access: "private" });
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ error: "Archivo no disponible." }, { status: 404 });
  }

  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType,
      "Content-Disposition": `attachment; filename="${reporte.archivoNombreOriginal ?? "reporte"}"`,
    },
  });
}
