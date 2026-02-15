import { useState, useEffect } from 'react';
import { PasswordGate } from './PasswordGate';
import { MusicPlayer } from './MusicPlayer';

const AUTH_KEY = 'valentines_authenticated';
const PUBLIC_KEY = 'valentines_public';

type AuthMode = 'checking' | 'gate' | 'authenticated' | 'public';

export function PasswordGateWrapper({ children }: { children: React.ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthMode>('checking');
  const [startMusic, setStartMusic] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    const publicAccess = localStorage.getItem(PUBLIC_KEY);

    if (auth === 'true') {
      setAuthMode('authenticated');
      setStartMusic(true);
    } else if (publicAccess === 'true') {
      setAuthMode('public');
      setStartMusic(true);
    } else {
      setAuthMode('gate');
    }
  }, []);

  const handleSuccess = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.removeItem(PUBLIC_KEY);
    setAuthMode('authenticated');
  };

  const handlePublicAccess = () => {
    localStorage.setItem(PUBLIC_KEY, 'true');
    localStorage.removeItem(AUTH_KEY);
    setStartMusic(true);
    setAuthMode('public');
  };

  const handleOpeningStart = () => {
    setStartMusic(true);
  };

  // Show nothing while checking auth status
  if (authMode === 'checking') {
    return null;
  }

  if (authMode === 'gate') {
    return (
      <>
        <PasswordGate
          onSuccess={handleSuccess}
          onPublicAccess={handlePublicAccess}
          onOpeningStart={handleOpeningStart}
        />
        {startMusic && <MusicPlayer />}
      </>
    );
  }

  // HomePage reads isPublicMode from localStorage directly
  return (
    <>
      {startMusic && <MusicPlayer />}
      {children}
    </>
  );
}
