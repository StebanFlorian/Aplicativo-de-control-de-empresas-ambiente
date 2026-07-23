"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReporteArchivoForm({
  onSubmit,
  successRedirect,
}: {
  onSubmit: (formData: FormData) => Promise<{ error?: string; reporteId?: string }>;
  successRedirect?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Reporte guardado correctamente.");
    if (successRedirect) router.push(successRedirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periodoInicio">Inicio del periodo</Label>
          <Input id="periodoInicio" name="periodoInicio" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodoFin">Fin del periodo</Label>
          <Input id="periodoFin" name="periodoFin" type="date" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="archivo">Archivo del reporte (PDF, Excel, máx. 15 MB)</Label>
        <Input
          id="archivo"
          name="archivo"
          type="file"
          accept=".pdf,.xls,.xlsx,.doc,.docx"
          required
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Subiendo..." : "Enviar reporte"}
      </Button>
    </form>
  );
}
