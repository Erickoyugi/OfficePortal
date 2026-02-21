import React, { useState } from 'react';
import { LockKeyhole, ShieldAlert, ChevronRight } from 'lucide-react';
import PasswordReset from './Home';
import { useNavigate } from 'react-router-dom';

const ResetLayout = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'reset', 'attempt'


  const redirectToPasswordReset = () => {
      
    window.location.href= '/reset/password/portal/'

  }


  const redirectToPasswordAttempt = () => {
    window.location.href ='/reset/password/portal/attempt'
  }

  // Mock UI for Password Attempt View
  const PasswordAttemptView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Login Attempts</h2>
        <p className="text-slate-500 text-sm">Review recent security activity for your account</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-700">Successful Login</p>
          <p className="text-xs text-slate-400">12 Feb 2026 • 14:20 PM</p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">Safe</span>
      </div>
      <button 
        onClick={() => setActiveTab('menu')}
        className="w-full mt-4 text-slate-500 font-medium hover:text-indigo-600 transition-colors"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-orange-600 p-8 text-white">
          <h1 className="text-xl font-bold tracking-tight">T24 Password Reset</h1>
          <p className="text-orange-100 text-sm opacity-80">Manage your credentials</p>
        </div>

        <div className="p-8">
          {activeTab === 'menu' && (
            <div className="grid gap-4">
              {/* Password Reset Button */}
              <button
                onClick={redirectToPasswordReset}
                className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <LockKeyhole className="text-indigo-600" size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-slate-800">Password Reset</span>
                    <span className="text-xs text-slate-400">Reset Your Password</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </button>

              {/* Password Attempt Button */}
              <button
                onClick={redirectToPasswordAttempt}
                className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-amber-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-3 rounded-xl group-hover:bg-amber-100 transition-colors">
                    <ShieldAlert className="text-amber-600" size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-slate-800">Password Attempt</span>
                    <span className="text-xs text-slate-400">Clear Failed Attempts</span>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
              </button>
            </div>
          )}

          {/* Conditional Rendering of Components */}
          {activeTab === 'reset' && (
            <div>
               <PasswordReset />
               <button 
                onClick={() => setActiveTab('menu')}
                className="w-full mt-2 text-slate-400 text-sm hover:underline"
               >
                 Cancel and Return
               </button>
            </div>
          )}

          {activeTab === 'attempt' && <PasswordAttemptView />}
        </div>
      </div>
    </div>
  );
};

export default ResetLayout;