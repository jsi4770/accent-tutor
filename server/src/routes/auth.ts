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

const googleSchema = z.object({
  code: z.string().min(1),
  codeVerifier: z.string().min(1),
  redirectUri: z.string().min(1),
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

// Decode a JWT's payload without verifying the signature — safe here because
// the token came straight from Google's token endpoint over a direct
// server-to-server HTTPS call, not from the client.
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const payload = jwt.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

router.post("/google", validateBody(googleSchema), async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not configured on the server" });
    return;
  }

  const { code, codeVerifier, redirectUri } = req.body;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const detail = await tokenRes.text();
    res.status(401).json({ error: "Google token exchange failed", detail });
    return;
  }

  const { id_token } = (await tokenRes.json()) as { id_token: string };
  const claims = decodeJwtPayload(id_token);
  const email = claims.email as string;
  const name = (claims.name as string) ?? getUser().nickname;

  const user = getUser();
  const response: AuthResponse = {
    token: fakeToken(email),
    user: { id: user.id, email, nickname: name },
  };
  res.json(response);
});

export default router;
