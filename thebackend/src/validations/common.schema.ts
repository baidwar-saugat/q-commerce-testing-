import { z } from "zod";

export const coordsSchema = z.object({
  body: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});
