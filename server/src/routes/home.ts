import { Router } from "express";
import { getUser } from "../data/store";
import { situationCards } from "../data/mockData";
import { ACCENTS, LEARNING_GOALS } from "../types";
import type { Accent, LearningGoal } from "../types";

const router = Router();

router.get("/cards", (req, res) => {
  const user = getUser();
  const accent = (req.query.accent as Accent) ?? user.accent;
  const goal = (req.query.goal as LearningGoal) ?? user.goal;

  if (!ACCENTS.includes(accent)) {
    res.status(400).json({ error: `Invalid accent. Expected one of ${ACCENTS.join(", ")}` });
    return;
  }
  if (!LEARNING_GOALS.includes(goal)) {
    res.status(400).json({ error: `Invalid goal. Expected one of ${LEARNING_GOALS.join(", ")}` });
    return;
  }

  const accentCards = situationCards.filter((c) => c.accent === accent);
  const cards = accentCards.filter((c) => c.goal === goal);

  res.json({
    accent,
    goal,
    greeting: `${user.nickname} 님, 오늘도 ${accent} 리듬에 익숙해져 볼까요?`,
    todayCards: cards.length ? cards : accentCards,
  });
});

export default router;
