import { Router } from "express";
import { getUser } from "../data/store";
import { progressHistory } from "../data/mockData";
import type { ProgressReport } from "../types";

const router = Router();

router.get("/history", (req, res) => {
  const type = req.query.type as "pronunciation" | "expression" | undefined;
  const items = type ? progressHistory.filter((i) => i.type === type) : progressHistory;
  res.json({
    streakDays: 3,
    totalMinutes: progressHistory.reduce((a, i) => a + i.minutes, 0),
    items,
  });
});

router.get("/report", (_req, res) => {
  const user = getUser();
  const report: ProgressReport = {
    storyHeadline: `${user.nickname} 님은 지금 '런던 출근 3일 차', 영국인 싱크로율 58%`,
    city: "London",
    accentSyncRate: 58,
    cumulativeGaugePercent: 62,
    standardAccuracy: 81,
    prosodyScore: 58,
    streakDays: 3,
    totalMinutes: progressHistory.reduce((a, i) => a + i.minutes, 0),
    nextChallenge: "기본기 다지며 다시 도전하기 (런던 튜브 타기 상황극)",
  };
  res.json(report);
});

export default router;
