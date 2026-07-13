import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { getUser } from "../data/store";
import type { AuthResponse } from "../types";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  nickname: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Mock auth: accepts any credentials and returns a fake token.
// TODO(real-auth): 소셜 로그인(구글/네이버/카카오) + 자체 ID 로그인, 실제 JWT 발급/검증,
// ID/PW 찾기 플로우 구현. 시크릿은 process.env(JWT_SECRET 등)에서 읽는다.
function fakeToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ sub: email, ts: Date.now() })).toString("base64url");
  return `mock.${payload}.signature`;
}

router.post("/signup", validateBody(signupSchema), (req, res) => {
  const user = getUser();
  const response: AuthResponse = {
    token: fakeToken(req.body.email),
    user: { id: user.id, email: req.body.email, nickname: req.body.nickname ?? user.nickname },
  };
  res.status(201).json(response);
});

router.post("/login", validateBody(loginSchema), (req, res) => {
  const user = getUser();
  const response: AuthResponse = {
    token: fakeToken(req.body.email),
    user: { id: user.id, email: req.body.email, nickname: user.nickname },
  };
  res.json(response);
});

export default router;
