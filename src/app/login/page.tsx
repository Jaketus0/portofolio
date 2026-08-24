'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminCard } from '../../components/ui/AdminCard';
import api from '../../lib/api';
import { useAuth } from '../../providers/auth-provider';

export default function LoginPage() {
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post('/auth/send-otp', { email });
      return data;
    },
    onSuccess: () => {
      setStep('OTP');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to send OTP');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; code: string; rememberMe: boolean }) => {
      const { data } = await api.post('/auth/verify-otp', payload);
      return data;
    },
    onSuccess: (data) => {
      login(data.data.accessToken, data.data.refreshToken, data.data.user);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid OTP');
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    sendOtpMutation.mutate(email);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }
    verifyOtpMutation.mutate({ email, code: otp, rememberMe: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-4">
      <div className="z-10 w-full max-w-md animate-in slide-in-from-bottom-8 duration-500">
        <AdminCard title="VIA Admin Login" className="w-full text-center p-8 border-primary shadow-lg">
          <h1 className="mb-2 text-2xl text-primary font-semibold">Login</h1>
          <p className="mb-8 text-sm text-muted">Access your portfolio dashboard</p>

          {error && (
            <div className="mb-6 border border-danger bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-6 text-left">
              <AdminInput
                label="Admin Email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sendOtpMutation.isPending}
              />
              <AdminButton
                type="submit"
                className="w-full"
                isLoading={sendOtpMutation.isPending}
              >
                Send OTP
              </AdminButton>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 text-left">
              <AdminInput
                label="One-Time Password"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={verifyOtpMutation.isPending}
              />
              <AdminButton
                type="submit"
                className="w-full"
                isLoading={verifyOtpMutation.isPending}
              >
                Verify & Login
              </AdminButton>
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="text-xs text-muted hover:text-foreground underline text-center"
              >
                &lt; Back to Email
              </button>
            </form>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
