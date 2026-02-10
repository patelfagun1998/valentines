import { useState, useEffect } from 'react';
import { PasswordGate } from './PasswordGate';
import { MusicPlayer } from './MusicPlayer';

const AUTH_KEY = 'valentines_authenticated';

export function PasswordGateWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [startMusic, setStartMusic] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === 'true');
    // If already authenticated, start music immediately
    if (auth === 'true') {
      setStartMusic(true);
    }
  }, []);

  const handleSuccess = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleOpeningStart = () => {
    setStartMusic(true);
  };

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <PasswordGate onSuccess={handleSuccess} onOpeningStart={handleOpeningStart} />
        {startMusic && <MusicPlayer />}
      </>
    );
  }

  return (
    <>
      {startMusic && <MusicPlayer />}
      {children}
    </>
  );
}
