import React, { useEffect, useState } from 'react';
import { Mail, Lock, Key, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
const PasswordAttempt = () => {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.mail) {
          // Setting the default value as requested: username@creditbank.co.ke
          setCustomerId(`${user.mail}`);
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const redirectToPage = async() => {
     window.location.href =
      'https://cbstst.creditbank.co.ke:9556/CBLIVE/servlet/BrowserServlet';
  }

  const API_BASE = "https://testapidevops.creditbank.co.ke:3010/creditbank/api/v1";

  // Step 1: Request OTP
  const handleSendOTP = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/send/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId })
      });

      if (response.ok) {
        setStep(2);
      } else {
        setError("Failed to send OTP. Please check your Customer ID.");
      }
    } catch (err) {
      setError("Connection error. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };




  // Step 2: Validate OTP & Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');


    // if (newPassword.length < 6 || newPassword.length > 8) {
    //   setError("Password must be between 6 and 8 characters.");
    //   return;
    // }

    // if (newPassword !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    // setIsLoading(true);

    const VERIFY_URL = "https://testapidevops.creditbank.co.ke:3010/creditbank/api/v1/verify/otp";

    try {
      const userString = localStorage.getItem('user');

// 2. Convert the string back into an object
      const user = userString ? JSON.parse(userString) : null;

// 3. Ensure user exists before trying to access .mail
   if (!user || !user.mail) {
      setError("User session not found. Please log in again.");
     return;
   }

      // --- STEP A: VERIFY OTP ---
    const verifyResponse = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email : user.mail,
        otp: otp // Adjust this key if your API uses "code" or "otp"
      })
    });


   const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      throw new Error(verifyData.message || "Invalid or expired OTP.");
    }
    const response = await fetch(`${API_BASE}/reset/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.username.toUpperCase(),
          otpValue: otp // Adjust key name based on your backend expectation
        })
      });

    const data = await response.json();


    const status = data?.['S:Envelope']?.['S:Body']?.['ns5:ResetUserAttemptsResponse']?.['Status'];

    const indicator = status?.successIndicator; // "T24Error"

    const message = status?.messages;


    if (indicator === "T24Error") {
            // Handle the specific T24 Error logic
            setError(`Failed! Please contact system administrator.`);
            setIsLoading(false);
            return;
        }

  if (response.ok) {
        setStep(3);
      } else {
        const data = await response.json();

        console.log(data)
        setError(data.message || "Invalid OTP or Reset failed.");
      }
    } catch (err) {
      setError("OTP validation failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-2xl rounded-3xl border border-slate-100">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Remember Your Password?</h2>
                {/* <p className="mt-2 text-sm text-slate-500">Enter your Email to receive an OTP.</p> */}
              </div>
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="username@creditbank.co.ke"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100"
                >
                  {isLoading ? "Processing..." : "Request OTP"} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Verify OTP</h2>
                <p className="mt-2 text-sm text-slate-500">Check your mail for the code sent to {customerId}</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter OTP"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                {/* <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="New Password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div> */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100"
                >
                  {isLoading ? "Updating..." : "Clear Login Attempts"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">All Set!</h2>
              <p className="text-slate-500">Attempts Have Been Successfully Cleared.</p>
              <button onClick={redirectToPage} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordAttempt;