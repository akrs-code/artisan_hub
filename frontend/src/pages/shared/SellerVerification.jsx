import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Store, FileText, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Map as MapIcon, User, Loader2 } from 'lucide-react';
import { Map, MapMarker, MapControls, MarkerContent, MarkerLabel } from '@/components/ui/map';
import { Link, useNavigate } from 'react-router-dom';
import { shopsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePHLocations } from '../../hooks/usePHLocations';

const fieldLabel = 'text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest block mb-1.5';
const fieldInput = 'w-full px-3.5 py-2.5 bg-card border border-border/70 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed';

const Steps = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Store Basics' },
    { id: 2, label: 'Location' },
    { id: 3, label: 'Documents' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-8 select-none">
      {steps.map((s, idx) => {
        const status = getStepStatus(s.id);
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all duration-300 border ${
                status === 'completed'
                  ? 'bg-secondary text-white border-secondary'
                  : status === 'active'
                  ? 'border-primary text-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border text-muted-foreground bg-muted/20'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`text-[10px] font-sans font-bold uppercase tracking-widest ${
                status === 'inactive' ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-8 md:w-12 h-px bg-border/60 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
};

const SellerVerification = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const [isCheckingShop, setIsCheckingShop] = useState(true);

    const { provinces, cities, getCities, loadingProvinces, loadingCities } = usePHLocations();

    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const checkAccess = async () => {
            if (authLoading) return;
            
            if (!isAuthenticated) {
                navigate('/login', { replace: true });
                return;
            }

            if (user?.role !== 'seller') {
                navigate(user?.role === 'admin' ? '/admin/overview' : '/', { replace: true });
                return;
            }

            
            try {
                const response = await shopsAPI.getOwned();
                if (response && response.data) {
                    
                    navigate('/seller/dashboard', { replace: true });
                }
            } catch (err) {
                
                setIsCheckingShop(false);
            }
        };
        checkAccess();
    }, [isAuthenticated, user, authLoading, navigate]);
    const [formData, setFormData] = useState({
        phone: '',
        storeName: '',
        category: 'Ceramics',
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
        },
        permitFile: null,
        idFile: null,
        location: {
            lng: 121.0215,
            lat: 14.5995,
        }
    });

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'state') { 
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, state: value, city: '' }
            }));
            const prov = provinces.find(p => p.name === value);
            if (prov) {
                getCities(prov.code);
            } else {
                getCities(null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [name]: value }
            }));
        }
    };

    const [mapViewport, setMapViewport] = useState({
        center: [121.0215, 14.5995],
        zoom: 12,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, field) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [field]: e.target.files[0] });
        }
    };

    const handleDragEnd = (e) => {
        setFormData({
            ...formData,
            location: { lng: e.lng, lat: e.lat }
        });
    };

    const handleLocate = (coords) => {
        setFormData({
            ...formData,
            location: { lng: coords.longitude, lat: coords.latitude }
        });
        setMapViewport({
            center: [coords.longitude, coords.latitude],
            zoom: 15,
        });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);

        try {
            
            const fullAddress = `${formData.address.street}, ${formData.address.city}, ${formData.address.state} ${formData.address.zipCode}`;

            
            const data = new FormData();
            data.append('name', formData.storeName);
            data.append('description', formData.description);
            data.append('category', formData.category || 'Ceramics');
            data.append('address', fullAddress);
            data.append('lat', formData.location.lat.toString());
            data.append('lng', formData.location.lng.toString());

            
            if (formData.permitFile) {
                data.append('businessPermit', formData.permitFile);
                data.append('cover', formData.permitFile);
            }
            if (formData.idFile) {
                data.append('governmentId', formData.idFile);
                data.append('logo', formData.idFile);
            }

            await shopsAPI.createShop(data);
            setIsSubmitted(true);
        } catch (err) {
            setSubmitError(err.message || 'Failed to submit seller verification. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isCheckingShop) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-sans text-muted-foreground">Checking store credentials...</p>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background/50 animate-in fade-in duration-700">
                <div className="max-w-md w-full bg-card p-10 rounded-2xl border border-border/60 shadow-soft-lg text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-foreground">Application Received</h2>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                        Thank you for applying to become a seller. We are reviewing your documents and store information. You will be notified once your store is approved.
                    </p>
                    <div className="pt-4">
                        <Link to="/seller/dashboard" className="block w-full text-center py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/50 animate-in fade-in duration-700 relative overflow-hidden flex items-center justify-center">

            
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-3xl -z-10" />

            <div className="max-w-xl w-full z-10">
                <div className="bg-card p-8 md:p-10 rounded-3xl border border-border/60 shadow-soft-lg">

                    <Steps currentStep={step} />

                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground tracking-tight">
                            {step === 1 && "Store Basics"}
                            {step === 2 && "Store Location"}
                            {step === 3 && "Verification Documents"}
                        </h1>
                        <p className="mt-2 text-xs font-sans text-muted-foreground max-w-sm mx-auto">
                            {step === 1 && "Tell us about the craft you sell and how buyers can reach you."}
                            {step === 2 && "Where can buyers find your physical store or workshop?"}
                            {step === 3 && "Upload necessary IDs and permits to verify your identity."}
                        </p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

                        
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label htmlFor="storeName" className={fieldLabel}>Store Name</label>
                                    <input
                                        id="storeName"
                                        name="storeName"
                                        required
                                        value={formData.storeName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. The Rustic Artisan"
                                        className={fieldInput}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className={fieldLabel}>Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. +63 9XX XXX XXXX"
                                        className={fieldInput}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className={fieldLabel}>Business Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`${fieldInput} resize-none`}
                                        placeholder="Tell buyers about your business..."
                                    />
                                </div>
                            </div>
                        )}

                        
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="street" className={fieldLabel}>Street Address</label>
                                        <input
                                            id="street"
                                            name="street"
                                            required
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                            placeholder="Unit, Building, Street name"
                                            className={fieldInput}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="state" className={fieldLabel}>State / Province</label>
                                            <select
                                                id="state"
                                                name="state"
                                                required
                                                value={formData.address.state}
                                                onChange={handleAddressChange}
                                                className={fieldInput}
                                                disabled={loadingProvinces}
                                            >
                                                <option value="" disabled>Select Province</option>
                                                {provinces.map(prov => (
                                                    <option key={prov.code} value={prov.name}>{prov.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="city" className={fieldLabel}>City</label>
                                            <select
                                                id="city"
                                                name="city"
                                                required
                                                value={formData.address.city}
                                                onChange={handleAddressChange}
                                                className={fieldInput}
                                                disabled={!formData.address.state || loadingCities}
                                            >
                                                <option value="" disabled>{loadingCities ? 'Loading...' : 'Select City'}</option>
                                                {cities.map(city => (
                                                    <option key={city.code} value={city.name}>{city.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className={fieldLabel}>ZIP / Postal Code</label>
                                        <input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={formData.address.zipCode}
                                            onChange={handleAddressChange}
                                            placeholder="ZIP Code"
                                            className={fieldInput}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between pb-1">
                                        <label className={fieldLabel}>Pin Location</label>
                                        <span className="text-[10px] text-muted-foreground font-sans">Drag pin to adjust</span>
                                    </div>
                                    <div className="h-[250px] w-full rounded-xl overflow-hidden border border-border/60 relative">
                                        <Map
                                            theme="light"
                                            viewport={mapViewport}
                                            onViewportChange={setMapViewport}
                                            className="w-full h-full"
                                        >
                                            <MapControls position="bottom-right" showLocate onLocate={handleLocate} />
                                            <MapMarker
                                                longitude={formData.location.lng}
                                                latitude={formData.location.lat}
                                                draggable
                                                onDragEnd={handleDragEnd}
                                            >
                                                <MarkerContent>
                                                    <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-primary shadow-lg transition-transform hover:scale-110" />
                                                    <MarkerLabel position="bottom">Your Store</MarkerLabel>
                                                </MarkerContent>
                                            </MapMarker>
                                        </Map>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className={fieldLabel}>Business Permit</label>
                                    <div className="mt-1 flex justify-center rounded-xl border border-dashed border-border/80 px-6 py-8 hover:bg-neutral-light/50 transition-colors bg-background/50 relative cursor-pointer group">
                                        <div className="text-center">
                                            <Upload className="mx-auto h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <div className="mt-3 flex text-sm leading-6 text-muted-foreground justify-center">
                                                <label className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary-dark">
                                                    <span>Upload a file</span>
                                                    <input name="permitFile" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'permitFile')} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] leading-5 text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                                            {formData.permitFile && (
                                                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-secondary">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {formData.permitFile.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={fieldLabel}>Valid Government ID</label>
                                    <div className="mt-1 flex justify-center rounded-xl border border-dashed border-border/80 px-6 py-8 hover:bg-neutral-light/50 transition-colors bg-background/50 relative cursor-pointer group">
                                        <div className="text-center">
                                            <Upload className="mx-auto h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <div className="mt-3 flex text-sm leading-6 text-muted-foreground justify-center">
                                                <label className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary-dark">
                                                    <span>Upload a file</span>
                                                    <input name="idFile" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idFile')} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] leading-5 text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                                            {formData.idFile && (
                                                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-secondary">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {formData.idFile.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {submitError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs font-sans text-destructive font-medium">
                                {submitError}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-border/50">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="w-1/3 py-3 text-xs font-sans font-bold uppercase tracking-widest border border-border/60 hover:bg-neutral-light text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer disabled:opacity-50" disabled={isSubmitting}>
                                    <ArrowLeft className="w-4 h-4 mr-2 inline-block align-middle" />
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="flex-1 py-3 text-xs font-sans font-bold uppercase tracking-widest bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 cursor-pointer">
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block align-middle" />
                                </button>
                            ) : (
                                <button type="button" onClick={handleSubmit} className="flex-1 py-3 text-xs font-sans font-bold uppercase tracking-widest bg-secondary hover:bg-secondary-dark text-white rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block align-middle" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <CheckCircle className="w-4 h-4 ml-2 inline-block align-middle" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerVerification;