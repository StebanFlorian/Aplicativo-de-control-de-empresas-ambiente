import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";

// Proxy autenticado para descargar un documento (el blob es privado, así que
// el navegador no puede pedirlo directamente). Sirve tanto documentos de
// obra como evidencias de reporte.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentoId: string }> },
) {
  const { documentoId } = await params;
  const session = await requireSession();

  const documento = await prisma.documento.findUnique({
    where: { id: documentoId },
    include: { obra: true, reporte: { include: { obra: true } } },
  });
  if (!documento) {
    return NextResponse.json({ error: "Documento no encontrado." }, { status: 404 });
  }

  const obraDelDocumento = documento.obra ?? documento.reporte?.obra;
  if (!obraDelDocumento || !isOwnerOrAdmin(session, obraDelDocumento.userId)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const blob = await get(documento.archivoUrl, { access: "private" });
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ error: "Archivo no disponible." }, { status: 404 });
  }

  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType,
      "Content-Disposition": `attachment; filename="${documento.archivoNombreOriginal}"`,
    },
  });
}
