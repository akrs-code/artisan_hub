import React, { useState } from 'react';
import { Upload, MapPin, Store, FileText, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Map as MapIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Map, MapMarker, MapControls, MarkerContent, MarkerLabel } from '@/components/ui/map';
import { Link } from 'react-router-dom';

const SellerVerification = () => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        storeName: '',
        category: '',
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
            lng: 121.0215, // Manila coordinates
            lat: 14.5995,
        }
    });

    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [e.target.name]: e.target.value
            }
        });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Seller Verification Submitted', formData);
        setIsSubmitted(true);
    };

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
                        <Link to="/seller/dashboard">
                            <Button className="w-full rounded-xl font-sans font-bold text-sm py-6">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background/50 animate-in fade-in duration-700 relative overflow-hidden flex items-center justify-center">

            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-3xl -z-10" />

            <div className="max-w-xl w-full z-10">
                <div className="bg-card p-8 md:p-10 rounded-3xl border border-border/60 shadow-soft-lg">

                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-primary/80' : 'w-4 bg-muted'}`} />
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-primary/80' : 'w-4 bg-muted'}`} />
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'w-8 bg-primary/80' : 'w-4 bg-muted'}`} />
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 4 ? 'w-8 bg-primary/80' : 'w-4 bg-muted'}`} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground tracking-tight">
                            {step === 1 && "Seller Identity"}
                            {step === 2 && "Store Basics"}
                            {step === 3 && "Store Location"}
                            {step === 4 && "Verification Documents"}
                        </h1>
                        <p className="mt-2 text-xs font-sans text-muted-foreground max-w-sm mx-auto">
                            {step === 1 && "Please provide your authentic legal identification details."}
                            {step === 2 && "Tell us about the craft you sell."}
                            {step === 3 && "Where can buyers find your physical store or workshop?"}
                            {step === 4 && "Upload necessary IDs and permits to verify your identity."}
                        </p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

                        {/* Step 1: Personal Identity */}
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-xs font-semibold text-foreground uppercase tracking-wide">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="middleName" className="text-xs font-semibold text-foreground uppercase tracking-wide">Middle Name</Label>
                                        <Input
                                            id="middleName"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Robert"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="lastName" className="text-xs font-semibold text-foreground uppercase tracking-wide">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-foreground uppercase tracking-wide">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. +63 9XX XXX XXXX"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Store Basics */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName" className="text-xs font-semibold text-foreground uppercase tracking-wide">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        name="storeName"
                                        required
                                        value={formData.storeName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. The Rustic Artisan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-xs font-semibold text-foreground uppercase tracking-wide">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Pottery, Woodwork, Textiles"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-semibold text-foreground uppercase tracking-wide">Store Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="resize-none"
                                        placeholder="Tell buyers about your craft..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Location */}
                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="street" className="text-xs font-semibold text-foreground uppercase tracking-wide">Street Address</Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            required
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                            placeholder="Unit, Building, Street name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-xs font-semibold text-foreground uppercase tracking-wide">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                required
                                                value={formData.address.city}
                                                onChange={handleAddressChange}
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-xs font-semibold text-foreground uppercase tracking-wide">State / Province</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                required
                                                value={formData.address.state}
                                                onChange={handleAddressChange}
                                                placeholder="State/Province"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode" className="text-xs font-semibold text-foreground uppercase tracking-wide">ZIP / Postal Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={formData.address.zipCode}
                                            onChange={handleAddressChange}
                                            placeholder="ZIP Code"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between pb-1">
                                        <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Pin Location</Label>
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

                        {/* Step 4: Documents */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Business Permit</Label>
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

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Valid Government ID</Label>
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

                        <div className="flex gap-4 pt-4 border-t border-border/50">
                            {step > 1 && (
                                <Button type="button" onClick={prevStep} variant="outline" className="w-1/3 rounded-xl font-sans font-bold text-xs uppercase tracking-widest border-border/60 hover:bg-neutral-light">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            )}

                            {step < 4 ? (
                                <Button type="button" onClick={nextStep} className="flex-1 rounded-xl font-sans font-bold text-xs uppercase tracking-widest group">
                                    Next Step
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleSubmit} className="flex-1 rounded-xl font-sans font-bold text-xs uppercase tracking-widest group bg-secondary hover:bg-secondary-dark text-white">
                                    Submit Application
                                    <CheckCircle className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerVerification;
