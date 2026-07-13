import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { AccentCode } from '@/constants/theme';

type SessionState = {
  accent: AccentCode;
  setAccent: (accent: AccentCode) => void;
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [accent, setAccent] = useState<AccentCode>('en-UK');
  // In-memory only (no persistence layer yet) — resets on reload, same as `accent`.
  const [token, setToken] = useState<string | null>(null);
  const value = useMemo(
    () => ({ accent, setAccent, token, signIn: setToken, signOut: () => setToken(null) }),
    [accent, token],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
