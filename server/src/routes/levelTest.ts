import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { getUser } from "../data/store";
import type { LevelTestResult } from "../types";

const router = Router();

const submitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        type: z.enum(["listening", "speaking"]),
        response: z.string(),
      }),
    )
    .optional(),
  skipped: z.boolean().optional(),
});

router.post("/submit", validateBody(submitSchema), (req, res) => {
  const user = getUser();
  const skipped = req.body.skipped ?? false;
  const answered = req.body.answers?.length ?? 0;
  const score = skipped ? 50 : Math.min(95, 55 + answered * 5);

  const result: LevelTestResult = {
    level: score >= 80 ? "Advanced (B2+)" : score >= 60 ? "Intermediate (B1)" : "Beginner (A2)",
    score,
    recommendedAccent: user.accent,
    summary: skipped
      ? "테스트를 건너뛰어 기본 난이도(B1)와 선택한 악센트로 시작합니다."
      : `총 ${answered}문항 기준 추정 레벨입니다. 발음보다 억양 싱크로율 향상 여지가 큽니다.`,
  };
  res.json(result);
});

export default router;
