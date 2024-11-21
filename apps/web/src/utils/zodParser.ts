import { NextRequest } from "next/server";
import { ZodSchema } from "zod";

export async function zodParser<T extends ZodSchema>(schema: T, req: NextRequest): Promise<Zod.infer<T>> {
  const { data, error } = schema.safeParse(await req.json());
  if (error) {
    const allErrors = error?.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    throw allErrors;
  }

  return data;
}