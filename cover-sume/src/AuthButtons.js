import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function AuthButtons() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, error } = useAuth0();
  const [loginError, setLoginError] = useState(false);

  if (isLoading) {
    return <span className="text-sm text-[#6f675e]">Loading</span>;
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
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#8f3d32]">Sign-in failed</span>
        <button type="button" onClick={handleLogin} className="btn btn-line px-3 py-1 text-sm">
          Try again
        </button>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="max-w-[180px] truncate text-sm text-[#5e574f]">
          {user?.name || user?.email}
        </span>
        <button
          type="button"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="text-sm text-[#5e574f] underline-offset-4 hover:text-[#1b1916] hover:underline"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={handleLogin} className="btn px-3 py-1.5 text-sm">
      Log in
    </button>
  );
}

export default AuthButtons;
