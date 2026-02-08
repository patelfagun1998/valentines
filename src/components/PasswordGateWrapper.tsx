import { useState, useEffect } from 'react';
import { PasswordGate } from './PasswordGate';

const AUTH_KEY = 'valentines_authenticated';

export function PasswordGateWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleSuccess = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  };

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={handleSuccess} />;
  }

  return <>{children}</>;
}
