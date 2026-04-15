import { Router } from "express";
import { asyncHandler } from "@/middleware/async-handler";
import { quoteQuerySchema } from "@/schemas/quote.schema";
import { QuoteService } from "@/services/quote.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = quoteQuerySchema.parse(req.query);
    const result = await QuoteService.getQuote(query);
    res.json(result);
  }),
);

export const quoteRouter = router;
