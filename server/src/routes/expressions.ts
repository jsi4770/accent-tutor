import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { getExpressionRecommendationProvider } from "../services/ExpressionRecommendationProvider";
import { expressionComparisons } from "../data/mockData";
import { ACCENTS } from "../types";
import type { Accent } from "../types";

const router = Router();
const provider = getExpressionRecommendationProvider();

const recommendSchema = z.object({
  transcript: z.string().min(1),
  targetAccent: z.enum(ACCENTS as [string, ...string[]]),
});

router.post("/recommend", validateBody(recommendSchema), async (req, res) => {
  const result = await provider.recommend(req.body);
  res.json(result);
});

router.get("/by-accent", (req, res) => {
  const accent = req.query.accent as Accent | undefined;
  if (accent && !ACCENTS.includes(accent)) {
    res.status(400).json({ error: `Invalid accent. Expected one of ${ACCENTS.join(", ")}` });
    return;
  }
  if (!accent) {
    res.json({ comparisons: expressionComparisons });
    return;
  }
  const comparisons = expressionComparisons.map((c) => ({
    meaning: c.meaning,
    highlight: c.variants.find((v) => v.accent === accent) ?? null,
    variants: c.variants,
  }));
  res.json({ accent, comparisons });
});

export default router;
