export type EstadoObra = "AL_DIA" | "ATRASADO" | "SIN_METAS";

interface MetaPeriodoLike {
  periodoInicio: Date;
  periodoFin: Date;
}

interface ReporteLike {
  periodoInicio: Date;
  periodoFin: Date;
  estado: "BORRADOR" | "ENVIADO";
}

function seSolapan(a: MetaPeriodoLike, b: ReporteLike) {
  return a.periodoInicio <= b.periodoFin && a.periodoFin >= b.periodoInicio;
}

// Una obra está "atrasada" si tiene al menos un periodo de meta ya vencido
// (periodoFin en el pasado) sin un reporte ENVIADO que lo cubra.
export function calcularEstadoObra(
  metas: MetaPeriodoLike[],
  reportes: ReporteLike[],
  ahora: Date = new Date(),
): EstadoObra {
  if (metas.length === 0) return "SIN_METAS";

  const periodosVencidos = metas.filter((m) => m.periodoFin < ahora);
  if (periodosVencidos.length === 0) return "AL_DIA";

  const reportesEnviados = reportes.filter((r) => r.estado === "ENVIADO");
  const algunSinCubrir = periodosVencidos.some(
    (periodo) => !reportesEnviados.some((r) => seSolapan(periodo, r)),
  );

  return algunSinCubrir ? "ATRASADO" : "AL_DIA";
}
