import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-90">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-3">
            <div className="relative">
              {/* Custom Chat on Laptop Logo */}
              <svg 
                className="size-10 text-primary animate-pulse" 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Laptop base */}
                <rect x="8" y="28" width="24" height="2" rx="1" fill="currentColor" opacity="0.7"/>
                
                {/* Laptop screen */}
                <rect x="6" y="8" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                
                {/* Screen content - chat interface */}
                <rect x="8" y="10" width="24" height="16" rx="1" fill="currentColor" opacity="0.1"/>
                
                {/* Chat bubbles */}
                <circle cx="12" cy="14" r="1.5" fill="currentColor" opacity="0.8"/>
                <circle cx="16" cy="14" r="1.5" fill="currentColor" opacity="0.8"/>
                <circle cx="20" cy="14" r="1.5" fill="currentColor" opacity="0.8"/>
                
                {/* Message lines */}
                <rect x="10" y="17" width="8" height="1" rx="0.5" fill="currentColor" opacity="0.6"/>
                <rect x="10" y="19" width="6" height="1" rx="0.5" fill="currentColor" opacity="0.6"/>
                <rect x="10" y="21" width="10" height="1" rx="0.5" fill="currentColor" opacity="0.6"/>
                
                {/* Reply bubble */}
                <rect x="22" y="18" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.4"/>
                
                {/* Typing indicator */}
                <circle cx="12" cy="25" r="0.8" fill="currentColor" opacity="0.5" className="animate-pulse"/>
                <circle cx="15" cy="25" r="0.8" fill="currentColor" opacity="0.5" className="animate-pulse"/>
                <circle cx="18" cy="25" r="0.8" fill="currentColor" opacity="0.5" className="animate-pulse"/>
              </svg>
            </div>
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 tracking-wider">
              Bytestream
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">Welcome Back</h2>
                  <p className="text-sm opacity-70 text-cyan-200">
                    Sign in to your account to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text text-cyan-300">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full bg-base-200/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text text-cyan-300">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full bg-base-200/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 border-0 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-cyan-200">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300">
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
