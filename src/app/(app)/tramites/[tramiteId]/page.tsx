import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Gavel } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentosSection } from "@/components/documentos/DocumentosSection";
import { EstadoTramiteSelect } from "@/components/tramites/EstadoTramiteSelect";
import { eliminarDocumento, subirDocumentosTramite } from "@/lib/actions/documento.actions";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";

export default async function TramiteDetailPage({
  params,
}: {
  params: Promise<{ tramiteId: string }>;
}) {
  const { tramiteId } = await params;
  const session = await requireSession();

  const tramite = await prisma.tramiteAmbiental.findUnique({
    where: { id: tramiteId },
    include: {
      obra: { select: { id: true, nombre: true, userId: true } },
      documentos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!tramite || !isOwnerOrAdmin(session, tramite.obra.userId)) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{tramite.nombre}</h1>
          <Link
            href={`/obras/${tramite.obra.id}`}
            className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:underline"
          >
            <Building2 className="size-3.5" />
            {tramite.obra.nombre}
          </Link>
        </div>
        <EstadoTramiteSelect tramiteId={tramite.id} estadoActual={tramite.estado} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gavel className="size-4 text-primary" />
            Detalle del trámite
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Entidad</p>
            <p className="font-medium">{tramite.entidad ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fecha de radicado</p>
            <p className="font-medium">
              {tramite.fechaRadicado ? formatter.format(tramite.fechaRadicado) : "—"}
            </p>
          </div>
          {tramite.observaciones && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Observaciones</p>
              <p className="font-medium">{tramite.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DocumentosSection
            documentos={tramite.documentos}
            onUpload={subirDocumentosTramite.bind(null, tramite.id)}
            onDelete={eliminarDocumento}
            titulo="Soportes del trámite"
          />
        </CardContent>
      </Card>
    </div>
  );
}
