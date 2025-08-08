import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: signupMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-90">
        {/* SIGNUP FORM - LEFT SIDE */}
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

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">Create an Account</h2>
                  <p className="text-sm opacity-70 text-cyan-200">
                    Join Bytestream and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* FULLNAME */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-cyan-300">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full bg-base-200/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-cyan-300">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full bg-base-200/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  {/* PASSWORD */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-cyan-300">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full bg-base-200/50 border-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1 text-cyan-200">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight text-cyan-200">
                        I agree to the{" "}
                        <span className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300">terms of service</span> and{" "}
                        <span className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 border-0 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-cyan-200">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-purple-600/20 items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-500/10 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="max-w-md p-8 relative z-10">
            <img src="/i.png" alt="Language connection illustration" className="w-full h-full drop-shadow-2xl" />
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-80 text-sm">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
