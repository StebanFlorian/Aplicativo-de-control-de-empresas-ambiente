import { Prisma } from "@/generated/prisma/client";

// El adaptador de driver `pg` (Prisma 7) anida el/los campo(s) del constraint
// violado bajo meta.driverAdapterError.cause.constraint.fields en vez del
// clásico meta.target plano; soportamos ambas formas.
export function getUniqueConstraintFields(error: unknown): string[] | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return null;
  }

  const meta = error.meta as
    | {
        target?: string[];
        driverAdapterError?: {
          cause?: { constraint?: { fields?: string[] } };
        };
      }
    | undefined;

  if (meta?.target?.length) return meta.target;

  const nestedFields = meta?.driverAdapterError?.cause?.constraint?.fields;
  if (nestedFields?.length) {
    return nestedFields.map((f) => f.replaceAll('"', ""));
  }

  return null;
}
