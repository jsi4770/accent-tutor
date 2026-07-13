import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { getProsodyAnalysisProvider } from "../services/ProsodyAnalysisProvider";
import { ACCENTS } from "../types";

const router = Router();
const provider = getProsodyAnalysisProvider();

const analyzeSchema = z
  .object({
    targetAccent: z.enum(ACCENTS as [string, ...string[]]),
    transcript: z.string().optional(),
    // Mocked audio: base64 string stand-in. Real audio upload is out of scope here.
    audioBase64: z.string().optional(),
    noiseHint: z.boolean().optional(),
  })
  .refine((v) => v.transcript || v.audioBase64, {
    message: "Provide either transcript or audioBase64",
  });

router.post("/analyze", validateBody(analyzeSchema), async (req, res) => {
  const result = await provider.analyze(req.body);
  res.json(result);
});

export default router;
