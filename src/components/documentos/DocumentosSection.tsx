"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DocumentoListado {
  id: string;
  archivoNombreOriginal: string;
  descripcion: string | null;
  createdAt: Date;
}

export function DocumentosSection({
  documentos,
  onUpload,
  onDelete,
  titulo = "Documentos",
}: {
  documentos: DocumentoListado[];
  onUpload: (formData: FormData) => Promise<{ error?: string }>;
  onDelete: (documentoId: string) => Promise<{ error?: string }>;
  titulo?: string;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setUploading(true);
    const result = await onUpload(formData);
    setUploading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Documento(s) subido(s) correctamente.");
    form.reset();
    router.refresh();
  }

  async function handleDelete(documentoId: string) {
    setDeletingId(documentoId);
    const result = await onDelete(documentoId);
    setDeletingId(null);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Documento eliminado.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">{titulo}</h2>

      {documentos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay documentos.</p>
      ) : (
        <ul className="space-y-2">
          {documentos.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-md border p-2.5 text-sm"
            >
              <a
                href={`/api/documentos/${doc.id}`}
                className="flex min-w-0 items-center gap-2 hover:underline"
              >
                <FileText className="size-4 shrink-0 text-primary" />
                <span className="truncate">{doc.archivoNombreOriginal}</span>
              </a>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                {doc.descripcion && <span className="hidden sm:inline">{doc.descripcion}</span>}
                <span>{formatter.format(doc.createdAt)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar documento"
                  disabled={deletingId === doc.id}
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="archivos">Agregar archivo(s)</Label>
          <Input id="archivos" name="archivos" type="file" multiple required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción (opcional)</Label>
          <Input id="descripcion" name="descripcion" placeholder="Ej: Fotos de excavación" />
        </div>
        <Button type="submit" disabled={uploading} className="gap-1.5">
          <Upload className="size-3.5" />
          {uploading ? "Subiendo..." : "Subir"}
        </Button>
      </form>
    </div>
  );
}
