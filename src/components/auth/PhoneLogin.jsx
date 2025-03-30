import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+${phone}`
      });
      if (error) throw error;
      setStep('otp');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        token: otp,
        type: 'sms'
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'phone' ? (
        <div className="space-y-4">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number (with country code)"
            disabled={loading}
          />
          <Button
            onClick={handleSendOTP}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            disabled={loading}
          />
          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>
      )}
    </div>
  );
}