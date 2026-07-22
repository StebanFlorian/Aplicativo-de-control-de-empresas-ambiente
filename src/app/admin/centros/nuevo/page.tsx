import { CentroDeTrabajoForm } from "@/components/forms/CentroDeTrabajoForm";
import { crearCentro } from "@/lib/actions/centro.actions";

export default function NuevoCentroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Nuevo centro de trabajo</h1>
      <div className="mt-6">
        <CentroDeTrabajoForm onSubmit={crearCentro} />
      </div>
    </div>
  );
}
