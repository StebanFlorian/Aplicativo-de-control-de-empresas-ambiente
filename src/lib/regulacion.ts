import { esBogota } from "@/lib/colombia-geo";

export type Clasificacion = "DISTRITAL" | "NACIONAL";
export type Tamano = "MAYOR_2000" | "MENOR_2000";
export type Periodicidad = "MENSUAL" | "TRIMESTRAL";

const AREA_CORTE_M2 = 2000;

// Distrital = obra ubicada en Bogotá D.C.; cualquier otro departamento/ciudad = Nacional.
export function clasificarObra(departamento: string, ciudad: string): Clasificacion {
  return esBogota(departamento, ciudad) ? "DISTRITAL" : "NACIONAL";
}

export function calcularTamano(areaM2: number): Tamano {
  return areaM2 > AREA_CORTE_M2 ? "MAYOR_2000" : "MENOR_2000";
}

// PROVISIONAL: no hay una regla explícita en la hoja de cálculo que empareje
// el área con la periodicidad de reporte. Se asume mensual para obras >2000m²
// (las mismas para las que existe detalle completo del Formulario 3.1) y
// trimestral para el resto. Ajustar cuando el cliente confirme la regla real.
export function calcularPeriodicidad(tamano: Tamano): Periodicidad {
  return tamano === "MAYOR_2000" ? "MENSUAL" : "TRIMESTRAL";
}

export function textoNormativaAplicable(clasificacion: Clasificacion): string {
  if (clasificacion === "DISTRITAL") {
    return "Aplica el Decreto 507 de 2023, compilado en el Decreto 646 de 2025.";
  }
  return "Aplica la Ley 1257 de 2021.";
}

export function nombreFormularioReporte(clasificacion: Clasificacion, tamano: Tamano): string {
  if (clasificacion === "DISTRITAL" && tamano === "MAYOR_2000") return "Formulario 3.1";
  if (clasificacion === "DISTRITAL" && tamano === "MENOR_2000") return "Formulario 4 (próximamente)";
  if (clasificacion === "NACIONAL" && tamano === "MAYOR_2000") return "Formulario 5 (próximamente)";
  return "Formulario 6 (próximamente)";
}

// Formulario oficial que le correspondería a la obra según la hoja de
// cálculo. Se usa para clasificar los reportes "manuales" (formulario
// genérico o archivo adjunto) que cubren estos formularios mientras no
// tengan reglas de negocio propias (ver Milestone 7).
export function tipoFormularioParaObra(
  clasificacion: Clasificacion,
  tamano: Tamano,
): "FORM_3_1" | "OBRA_DISTRITAL_MENOR" | "OBRA_NACIONAL" {
  if (clasificacion === "DISTRITAL" && tamano === "MAYOR_2000") return "FORM_3_1";
  if (clasificacion === "DISTRITAL" && tamano === "MENOR_2000") return "OBRA_DISTRITAL_MENOR";
  return "OBRA_NACIONAL";
}

const NOMBRE_POR_TIPO_FORMULARIO: Record<string, string> = {
  FORM_3_1: "Formulario 3.1",
  FORM_3_2: "Formulario 3.2",
  OBRA_DISTRITAL_MENOR: "Formulario 4",
  OBRA_NACIONAL: "Formulario 5/6",
};

export function nombreFormularioPorTipo(tipoFormulario: string): string {
  return NOMBRE_POR_TIPO_FORMULARIO[tipoFormulario] ?? tipoFormulario;
}

export interface MetaPeriodoCalculada {
  periodoInicio: Date;
  periodoFin: Date;
  cantidadEsperadaTon: number;
}

// PROVISIONAL: sin fecha de fin de obra ni fórmula exacta de "metas" en la
// hoja de cálculo, se asume una ventana fija de 12 meses desde la fecha de
// inicio y se reparte linealmente la cantidad de RCD proyectada entre los
// periodos (mensuales o trimestrales) de esa ventana. Este cálculo debe
// tratarse como una estimación ajustable, no como un compromiso regulatorio.
export function calcularMetasPeriodo(
  fechaInicio: Date,
  cantidadRcdProyectada: number,
  periodicidad: Periodicidad,
): MetaPeriodoCalculada[] {
  const numPeriodos = periodicidad === "MENSUAL" ? 12 : 4;
  const mesesPorPeriodo = periodicidad === "MENSUAL" ? 1 : 3;
  const cantidadPorPeriodo = cantidadRcdProyectada / numPeriodos;

  const metas: MetaPeriodoCalculada[] = [];
  for (let i = 0; i < numPeriodos; i++) {
    const periodoInicio = new Date(fechaInicio);
    periodoInicio.setMonth(periodoInicio.getMonth() + i * mesesPorPeriodo);

    const periodoFin = new Date(fechaInicio);
    periodoFin.setMonth(periodoFin.getMonth() + (i + 1) * mesesPorPeriodo);
    periodoFin.setDate(periodoFin.getDate() - 1);

    metas.push({ periodoInicio, periodoFin, cantidadEsperadaTon: cantidadPorPeriodo });
  }
  return metas;
}
