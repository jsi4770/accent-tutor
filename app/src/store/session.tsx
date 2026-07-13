import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { AccentCode } from '@/constants/theme';

type SessionState = {
  accent: AccentCode;
  setAccent: (accent: AccentCode) => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [accent, setAccent] = useState<AccentCode>('en-UK');
  const value = useMemo(() => ({ accent, setAccent }), [accent]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
