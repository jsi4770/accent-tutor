import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

import { api } from '@/api/client';

WebBrowser.maybeCompleteAuthSession();

// Google's Web-application OAuth clients require the client secret for the
// code -> token exchange even with PKCE, so the app only gets the
// authorization code + PKCE verifier here; the actual exchange (and issuing
// our own session token) happens server-side in POST /auth/google.
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export function useGoogleAuth(onToken: (token: string) => void) {
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success' && request?.codeVerifier) {
      api
        .loginWithGoogle(response.params.code, request.codeVerifier, redirectUri)
        .then(({ token }) => onToken(token));
    }
  }, [response]);

  return { promptAsync, ready: !!request };
}
