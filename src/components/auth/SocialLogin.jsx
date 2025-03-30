import { FaGoogle } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient';
import { Button } from '../ui/button';

export default function SocialLogin() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error with Google login:', error);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3"
          variant="outline"
        >
          <FaGoogle className="text-red-600" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}