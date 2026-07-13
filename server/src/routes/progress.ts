import { Router } from "express";
import { getUser } from "../data/store";
import { progressHistory, reportsByAccent } from "../data/mockData";
import { ACCENTS } from "../types";
import type { Accent, ProgressReport } from "../types";

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

router.get("/report", (req, res) => {
  const user = getUser();
  const accent = (req.query.accent as Accent) ?? user.accent;
  if (!ACCENTS.includes(accent)) {
    res.status(400).json({ error: `Invalid accent. Expected one of ${ACCENTS.join(", ")}` });
    return;
  }
  const base = reportsByAccent[accent];
  const report: ProgressReport = {
    storyHeadline: base.storyHeadline.replace("{nickname}", user.nickname),
    city: base.city,
    accentSyncRate: base.accentSyncRate,
    cumulativeGaugePercent: base.cumulativeGaugePercent,
    standardAccuracy: base.standardAccuracy,
    prosodyScore: base.prosodyScore,
    streakDays: 3,
    totalMinutes: progressHistory.reduce((a, i) => a + i.minutes, 0),
    nextChallenge: base.nextChallenge,
  };
  res.json(report);
});

export default router;
