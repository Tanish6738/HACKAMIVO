import React from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'signin' or 'signup'
  const navigate = useNavigate();
  const { user } = useClerk();

  React.useEffect(() => {
    if (user && user.isSignedIn) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-md">
        {mode === 'signup' ? (
          <SignUp routing="hash" afterSignUpUrl="/dashboard" />
        ) : (
          <SignIn routing="hash" afterSignInUrl="/dashboard" />
        )}
      </div>
    </div>
  );
};

export default Login;
