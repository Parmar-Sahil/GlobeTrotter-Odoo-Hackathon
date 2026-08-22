import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z
      .string()
      .min(3, "Trip title must be at least 3 characters")
      .max(100, "Trip title cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budgetLimit: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().positive("Budget must be a positive amount").optional()
    ),
    currency: z.string().default("USD"),
    coverImage: z.string().url("Please enter a valid image URL").or(z.literal("")).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]).default("PRIVATE"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type CreateTripFormData = z.infer<typeof createTripSchema>;
