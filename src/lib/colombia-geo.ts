// Datos de referencia estáticos (Colombia). No cambian con frecuencia,
// por eso viven en código en vez de la base de datos.

export const TIPOS_VIA = [
  { value: "CL", label: "CL - Calle" },
  { value: "KR", label: "KR - Carrera" },
  { value: "DG", label: "DG - Diagonal" },
  { value: "TV", label: "TV - Transversal" },
  { value: "AV", label: "AV - Avenida" },
  { value: "AC", label: "AC - Avenida Calle" },
  { value: "AK", label: "AK - Avenida Carrera" },
  { value: "CQ", label: "CQ - Circular" },
  { value: "CV", label: "CV - Circunvalar" },
  { value: "MZ", label: "MZ - Manzana" },
  { value: "KM", label: "KM - Kilómetro" },
] as const;

// Localidades de Bogotá D.C. (1-19, según la hoja de cálculo — se excluye
// la localidad 20 Sumapaz porque el rango indicado es 1-19).
export const LOCALIDADES_BOGOTA = [
  { value: 1, label: "1 - Usaquén" },
  { value: 2, label: "2 - Chapinero" },
  { value: 3, label: "3 - Santa Fe" },
  { value: 4, label: "4 - San Cristóbal" },
  { value: 5, label: "5 - Usme" },
  { value: 6, label: "6 - Tunjuelito" },
  { value: 7, label: "7 - Bosa" },
  { value: 8, label: "8 - Kennedy" },
  { value: 9, label: "9 - Fontibón" },
  { value: 10, label: "10 - Engativá" },
  { value: 11, label: "11 - Suba" },
  { value: 12, label: "12 - Barrios Unidos" },
  { value: 13, label: "13 - Teusaquillo" },
  { value: 14, label: "14 - Los Mártires" },
  { value: 15, label: "15 - Antonio Nariño" },
  { value: 16, label: "16 - Puente Aranda" },
  { value: 17, label: "17 - La Candelaria" },
  { value: 18, label: "18 - Rafael Uribe Uribe" },
  { value: 19, label: "19 - Ciudad Bolívar" },
] as const;

export const BOGOTA_DEPARTAMENTO = "Bogotá D.C.";
export const BOGOTA_CIUDAD = "Bogotá D.C.";

// 32 departamentos de Colombia + Bogotá D.C. como distrito capital.
export const DEPARTAMENTOS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  BOGOTA_DEPARTAMENTO,
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
] as const;

// Ciudades/municipios de referencia por departamento. Para departamentos
// distintos a Bogotá se incluye la capital y algunos municipios principales;
// se puede ampliar según necesidad sin afectar el resto del modelo.
export const CIUDADES_POR_DEPARTAMENTO: Record<string, string[]> = {
  Amazonas: ["Leticia"],
  Antioquia: ["Medellín", "Envigado", "Itagüí", "Bello", "Rionegro"],
  Arauca: ["Arauca"],
  Atlántico: ["Barranquilla", "Soledad"],
  [BOGOTA_DEPARTAMENTO]: [BOGOTA_CIUDAD],
  Bolívar: ["Cartagena", "Magangué"],
  Boyacá: ["Tunja", "Duitama", "Sogamoso"],
  Caldas: ["Manizales"],
  Caquetá: ["Florencia"],
  Casanare: ["Yopal"],
  Cauca: ["Popayán"],
  Cesar: ["Valledupar"],
  Chocó: ["Quibdó"],
  Córdoba: ["Montería"],
  Cundinamarca: ["Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá"],
  Guainía: ["Inírida"],
  Guaviare: ["San José del Guaviare"],
  Huila: ["Neiva"],
  "La Guajira": ["Riohacha"],
  Magdalena: ["Santa Marta"],
  Meta: ["Villavicencio"],
  Nariño: ["Pasto"],
  "Norte de Santander": ["Cúcuta"],
  Putumayo: ["Mocoa"],
  Quindío: ["Armenia"],
  Risaralda: ["Pereira"],
  "San Andrés y Providencia": ["San Andrés"],
  Santander: ["Bucaramanga", "Floridablanca", "Girón"],
  Sucre: ["Sincelejo"],
  Tolima: ["Ibagué"],
  "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
  Vaupés: ["Mitú"],
  Vichada: ["Puerto Carreño"],
};

export function esBogota(departamento: string, ciudad: string) {
  return departamento === BOGOTA_DEPARTAMENTO && ciudad === BOGOTA_CIUDAD;
}
