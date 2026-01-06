import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } = useAuth0();
  const [loginError, setLoginError] = useState(false);

  if (isLoading) {
    return <span className="text-sm font-thin">Loading...</span>;
  }

  const handleLogin = async () => {
    try {
      setLoginError(false);
      await loginWithRedirect();
    } catch (err) {
      setLoginError(true);
    }
  };

  if (error || loginError) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-thin text-red-500">Sign in failed, try again</span>
        <button
          onClick={handleLogin}
          className="relative bg-yellow-500 hover:opacity-50 rounded-3xl px-3 py-1 text-white text-xs font-thin"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <>
          <span className="text-sm font-thin">
            Logged in, <span className="font-semibold">{user?.name || user?.email}</span>
          </span>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="relative bg-red-500 hover:opacity-50 rounded-3xl px-4 py-1.5 text-white text-sm font-thin after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-4 after:bottom-1 after:transition-all after:duration-300 hover:after:w-11"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="relative bg-blue-500 hover:opacity-50 rounded-3xl px-4 py-1.5 text-white text-sm font-thin after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:left-4 after:bottom-1 after:transition-all after:duration-300 hover:after:w-9"
        >
          Login
        </button>
      )}
    </div>
  );
}

export default AuthButtons;
