"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireSession, isOwnerOrAdmin } from "@/lib/rbac";
import { obraSchema } from "@/lib/validators/obra.schema";
import {
  calcularMetasPeriodo,
  calcularPeriodicidad,
  calcularTamano,
  clasificarObra,
} from "@/lib/regulacion";

function derivarClasificacion(departamento: string, ciudad: string, area: number) {
  const clasificacion = clasificarObra(departamento, ciudad);
  const tamano = calcularTamano(area);
  const periodicidadReporte = calcularPeriodicidad(tamano);
  return { clasificacion, tamano, periodicidadReporte };
}

export async function crearObra(input: unknown): Promise<{ error?: string; obraId?: string }> {
  const session = await requireSession();

  const parsed = obraSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const { clasificacion, tamano, periodicidadReporte } = derivarClasificacion(
    data.departamento,
    data.ciudad,
    data.area,
  );

  try {
    const obra = await prisma.obra.create({
      data: {
        nombre: data.nombre,
        telefono: data.telefono,
        tipoVia: data.tipoVia,
        direccion: data.direccion,
        departamento: data.departamento,
        ciudad: data.ciudad,
        localidad: data.localidad,
        area: data.area,
        fechaInicio: data.fechaInicio,
        cantidadRcdProyectada: data.cantidadRcdProyectada,
        cantidadMaterialAUsar: data.cantidadMaterialAUsar,
        clasificacion,
        tamano,
        periodicidadReporte,
        lat: data.lat,
        lng: data.lng,
        centroDeTrabajoId: data.centroDeTrabajoId,
        userId: session.user.id,
      },
    });

    const metas = calcularMetasPeriodo(
      data.fechaInicio,
      data.cantidadRcdProyectada,
      periodicidadReporte,
    );
    await prisma.metaPeriodo.createMany({
      data: metas.map((m) => ({
        obraId: obra.id,
        periodoInicio: m.periodoInicio,
        periodoFin: m.periodoFin,
        cantidadEsperadaTon: m.cantidadEsperadaTon,
      })),
    });

    revalidatePath("/obras");
    return { obraId: obra.id };
  } catch (error) {
    console.error(error);
    return { error: "No se pudo crear la obra. Intenta de nuevo." };
  }
}

export async function actualizarObra(
  obraId: string,
  input: unknown,
): Promise<{ error?: string }> {
  const session = await requireSession();

  const existing = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!existing) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, existing.userId)) {
    return { error: "No tienes permiso para editar esta obra." };
  }

  const parsed = obraSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const { clasificacion, tamano, periodicidadReporte } = derivarClasificacion(
    data.departamento,
    data.ciudad,
    data.area,
  );

  const cadenciaCambio =
    tamano !== existing.tamano ||
    data.cantidadRcdProyectada !== Number(existing.cantidadRcdProyectada) ||
    data.fechaInicio.getTime() !== existing.fechaInicio.getTime();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.obra.update({
        where: { id: obraId },
        data: {
          nombre: data.nombre,
          telefono: data.telefono,
          tipoVia: data.tipoVia,
          direccion: data.direccion,
          departamento: data.departamento,
          ciudad: data.ciudad,
          localidad: data.localidad,
          area: data.area,
          fechaInicio: data.fechaInicio,
          cantidadRcdProyectada: data.cantidadRcdProyectada,
          cantidadMaterialAUsar: data.cantidadMaterialAUsar,
          clasificacion,
          tamano,
          periodicidadReporte,
          lat: data.lat,
          lng: data.lng,
          centroDeTrabajoId: data.centroDeTrabajoId ?? null,
        },
      });

      // Si cambió el tamaño/área, cantidad proyectada o fecha de inicio, se
      // regenera el calendario de metas (provisional) desde cero.
      if (cadenciaCambio) {
        await tx.metaPeriodo.deleteMany({ where: { obraId } });
        const metas = calcularMetasPeriodo(
          data.fechaInicio,
          data.cantidadRcdProyectada,
          periodicidadReporte,
        );
        await tx.metaPeriodo.createMany({
          data: metas.map((m) => ({
            obraId,
            periodoInicio: m.periodoInicio,
            periodoFin: m.periodoFin,
            cantidadEsperadaTon: m.cantidadEsperadaTon,
          })),
        });
      }
    });

    revalidatePath("/obras");
    revalidatePath(`/obras/${obraId}`);
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo actualizar la obra. Intenta de nuevo." };
  }
}
