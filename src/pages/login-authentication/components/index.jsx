import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/ui/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SecurityBadge from './SecurityBadge';

const LoginAuthentication = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const mockCredentials = {
    username: 'crib.user',
    password: 'Crib@2026'
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (formData?.username === mockCredentials?.username && formData?.password === mockCredentials?.password) {
        navigate('/real-time-monitor-hub', { 
          state: { 
            username: formData?.username 
          } 
        });
      } else {
        setErrors({
          password: `Invalid credentials. Use username: ${mockCredentials?.username} and password: ${mockCredentials?.password}`
        });
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Section - Branding & Info */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow-lg">
                <Icon name="Baby" size={28} color="white" className="md:w-9 md:h-9" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-heading">
                  BabyCrib Monitor
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Advanced Infant Care System
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                Real-Time Health Monitoring
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Secure access to comprehensive infant vital signs monitoring with real-time alerts, 
                environmental tracking, and advanced analytics for optimal care delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <SecurityBadge icon="Shield" text="HIPAA Compliant" />
              <SecurityBadge icon="Lock" text="256-bit Encryption" />
              <SecurityBadge icon="Award" text="Medical Grade" />
              <SecurityBadge icon="CheckCircle2" text="FDA Approved" />
            </div>
          </div>

          <div className="hidden lg:block">
           
        </div>

        {/* Right Section - Login Form */}
        <div className="lg:col-span-7">
          <div className="bg-card border border-border rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Login to Crib Monitor
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Enter your credentials to access the monitoring system
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
              {/* Username Input */}
              <Input
                label="Username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData?.username}
                onChange={handleInputChange}
                error={errors?.username}
                required
              />

              {/* Password Input */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={errors?.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>

              {/* Remember Device & Forgot Password */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e?.target?.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">Remember this device</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="LogIn" size={20} />
                    <span>Login to Crib Monitor</span>
                  </div>
                )}
              </Button>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Secure Access</p>
                  <p>
                    All login attempts are encrypted and logged for security purposes. 
                    Your session will timeout after 30 minutes of inactivity.
                  </p>
                </div>
              </div>
            </form>

            {/* Help Section */}
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icon name="HelpCircle" size={16} />
                <span>Need help?</span>
                <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuthentication;
