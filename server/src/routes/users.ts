import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { getUser, updateUser, getSettings, updateSettings } from "../data/store";
import { ACCENTS, LEARNING_GOALS } from "../types";

const router = Router();

const accentSchema = z.object({
  accent: z.enum(ACCENTS as [string, ...string[]]),
});

const goalSchema = z.object({
  goal: z.enum(LEARNING_GOALS as [string, ...string[]]),
  dailyMinutes: z.number().int().min(5).max(240),
});

const profileSchema = z.object({
  nickname: z.string().min(1).optional(),
  level: z.string().min(1).optional(),
});

const settingsSchema = z.object({
  notificationsEnabled: z.boolean().optional(),
  dailyReminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  soundEffects: z.boolean().optional(),
  language: z.enum(["ko", "en"]).optional(),
});

router.get("/me/accent", (_req, res) => {
  res.json({ accent: getUser().accent });
});

router.put("/me/accent", validateBody(accentSchema), (req, res) => {
  const user = updateUser({ accent: req.body.accent });
  res.json({ accent: user.accent });
});

router.put("/me/goal", validateBody(goalSchema), (req, res) => {
  const user = updateUser({ goal: req.body.goal, dailyMinutes: req.body.dailyMinutes });
  res.json({ goal: user.goal, dailyMinutes: user.dailyMinutes });
});

router.get("/me/profile", (_req, res) => {
  const u = getUser();
  res.json({
    id: u.id,
    nickname: u.nickname,
    level: u.level,
    accent: u.accent,
    goal: u.goal,
    dailyMinutes: u.dailyMinutes,
    badges: ["첫 발화", "3일 연속", "표현 마스터 Lv.1"],
    cumulativeMinutes: 420,
  });
});

router.put("/me/profile", validateBody(profileSchema), (req, res) => {
  const u = updateUser(req.body);
  res.json({ id: u.id, nickname: u.nickname, level: u.level });
});

router.get("/me/settings", (_req, res) => {
  res.json(getSettings());
});

router.put("/me/settings", validateBody(settingsSchema), (req, res) => {
  res.json(updateSettings(req.body));
});

export default router;
