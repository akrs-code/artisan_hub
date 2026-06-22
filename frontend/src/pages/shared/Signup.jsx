import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Store, ShoppingBag, ArrowRight, Loader2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms and Policies.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await register({ ...formData, role });

      // Route based on role after successful registration
      const userRole = data.user?.role;
      if (userRole === 'seller') {
        navigate('/verify-seller');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700 bg-background/50 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-card p-8 md:p-10 rounded-2xl border border-border/60 shadow-soft-lg">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1.5 rounded-full bg-primary/80" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold text-foreground tracking-tight">
              Create an Account
            </h2>
            <p className="mt-2 text-sm font-sans text-muted-foreground">
              Join Artisan Hub today.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-6 flex items-center gap-3 p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-xs font-sans text-destructive font-medium">{error}</p>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            {/* Role Toggle */}
            <div className="flex p-1.5 bg-neutral-light/80 rounded-xl border border-border/50 shadow-sm">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold font-sans rounded-lg transition-all duration-300 ${
                  role === 'buyer' 
                    ? 'bg-white shadow-sm text-foreground border border-border/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold font-sans rounded-lg transition-all duration-300 ${
                  role === 'seller' 
                    ? 'bg-white shadow-sm text-foreground border border-border/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <Store className="w-4 h-4" />
                Seller
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-foreground tracking-wide uppercase">First Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      disabled={isLoading}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-xs font-semibold text-foreground tracking-wide uppercase">Middle Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                    <Input
                      id="middleName"
                      name="middleName"
                      type="text"
                      autoComplete="additional-name"
                      disabled={isLoading}
                      value={formData.middleName}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Robert"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-semibold text-foreground tracking-wide uppercase">Last Name</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    disabled={isLoading}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground tracking-wide uppercase">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground tracking-wide uppercase">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-sans mt-1.5">Must be at least 8 characters.</p>
              </div>
            </div>

            {/* Terms and Policies Checkbox */}
            <div className="flex items-start gap-2.5 my-4">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs font-sans text-muted-foreground leading-normal">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="font-semibold text-primary hover:underline hover:text-primary-dark transition-all cursor-pointer"
                >
                  Terms and Policies
                </button>{' '}
                of Artisan Hub.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full rounded-xl font-sans font-bold text-sm uppercase tracking-widest py-6 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create {role === 'seller' ? 'Seller ' : ''}Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="text-center mt-8 pt-6 border-t border-border/50">
              <p className="text-sm font-sans text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                  Sign in securely
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Policies Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm transition-opacity" onClick={() => setShowTermsModal(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-soft-xl w-full max-w-lg overflow-hidden transform transition-all my-8 max-h-[80vh] flex flex-col z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 shrink-0">
              <h3 className="text-lg font-headline font-bold text-foreground">Terms and Policies</h3>
              <button type="button" onClick={() => setShowTermsModal(false)} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-neutral-dark/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 font-sans text-xs text-muted-foreground space-y-4 leading-relaxed text-left">
              <h4 className="font-bold text-foreground">1. Acceptance of Terms</h4>
              <p>By creating an account on Artisan Hub, you agree to comply with and be bound by these Terms and Policies. If you do not agree, you must not use our services.</p>
              <h4 className="font-bold text-foreground">2. Seller Responsibilities</h4>
              <p>Sellers are responsible for verifying their identities, maintaining accurate listings, pricing products in Philippine Pesos (PHP), and fulfilling buyer orders on time.</p>
              <h4 className="font-bold text-foreground">3. Buyer Safeguards</h4>
              <p>Buyers agree to provide valid shipping addresses and payment credentials. All transactions are final, protected by secure checkout protocols.</p>
              <h4 className="font-bold text-foreground">4. Privacy and Location Data</h4>
              <p>We collect store and buyer location data to optimize the marketplace delivery network and calculate distances. Your coordinates are secured and handled in compliance with privacy regulations.</p>
            </div>
            <div className="flex justify-end p-6 border-t border-border/80 shrink-0 bg-neutral-dark/5">
              <button
                type="button"
                onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }}
                className="px-6 py-2.5 rounded-lg bg-[#8C5233] text-white text-[12px] font-sans font-bold uppercase tracking-wider hover:bg-[#7E4A2E] cursor-pointer"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;