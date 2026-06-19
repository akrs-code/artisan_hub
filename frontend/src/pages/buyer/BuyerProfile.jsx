import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, Save, MapPin, User, FileText, LogOut, ShieldCheck, Mail, Phone, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map, MapMarker, MapControls, MarkerContent, MarkerLabel } from '@/components/ui/map';

const BuyerProfile = () => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('buyerProfile');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
            },
            idFile: null,
            location: {
                lng: 121.0215,
                lat: 14.5995,
            }
        };
    });

    const [mapViewport, setMapViewport] = useState({
        center: [formData.location.lng, formData.location.lat],
        zoom: 12,
    });

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddressChange = (e) => setFormData({
        ...formData,
        address: { ...formData.address, [e.target.name]: e.target.value }
    });

    const handleFileChange = (e, field) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, [field]: e.target.files[0] });
        }
    };

    const handleDragEnd = (e) => setFormData({
        ...formData,
        location: { lng: e.lng, lat: e.lat }
    });

    const handleLocate = (coords) => {
        setFormData({
            ...formData,
            location: { lng: coords.longitude, lat: coords.latitude }
        });
        setMapViewport({ center: [coords.longitude, coords.latitude], zoom: 15 });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData, idFile: null };
        localStorage.setItem('buyerProfile', JSON.stringify(dataToSave));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleLogout = () => {
        // Clear any auth tokens or user context here if they exist
        navigate('/login');
    };

    const initials = `${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Banner */}
            <div className="h-48 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 relative border-b border-border/40">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar Profile Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-card rounded-3xl border border-border/60 shadow-soft-lg p-6 relative z-10 flex flex-col items-center text-center">
                            
                            {/* Avatar */}
                            <div className="relative mb-4 group cursor-pointer">
                                <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-3xl font-headline font-bold text-primary">
                                        {initials}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center" title="Online">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <h1 className="text-xl font-headline font-bold text-foreground">
                                {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'Guest User'}
                            </h1>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-secondary" /> Verified Buyer
                            </p>

                            <div className="w-full h-px bg-border/40 my-6"></div>

                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">{formData.email || 'No email provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span>{formData.phone || 'No phone provided'}</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-border/40 my-6"></div>

                            <Button 
                                onClick={handleLogout}
                                variant="outline" 
                                className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-sans font-bold text-xs uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out Account
                            </Button>
                        </div>
                    </div>

                    {/* Right Form Content */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            
                            {/* Personal Information */}
                            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-soft-sm relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-xl font-headline font-semibold">Personal Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">First Name</Label>
                                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="Maria" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="middleName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Middle Name (Optional)</Label>
                                        <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} className="rounded-xl border-border/60 bg-muted/10 h-11" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="lastName" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Name</Label>
                                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="Santos" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="maria@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</Label>
                                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="+63 9XX XXX XXXX" required />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address & Location */}
                            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-soft-sm relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-xl font-headline font-semibold">Delivery Address</h2>
                                </div>
                                
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="street" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Street Address</Label>
                                        <Input id="street" name="street" value={formData.address.street} onChange={handleAddressChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="123 Rizal Street" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">City / Municipality</Label>
                                            <Input id="city" name="city" value={formData.address.city} onChange={handleAddressChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="Manila" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">State / Province</Label>
                                            <Input id="state" name="state" value={formData.address.state} onChange={handleAddressChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="Metro Manila" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ZIP / Postal Code</Label>
                                        <Input id="zipCode" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} className="rounded-xl border-border/60 bg-muted/10 h-11" placeholder="1000" required />
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Pin Delivery Point</Label>
                                        <span className="text-[10px] text-muted-foreground font-sans bg-muted/30 px-2 py-1 rounded-md">Drag pin to adjust</span>
                                    </div>
                                    <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-border/60 relative shadow-inner">
                                        <Map theme="light" viewport={mapViewport} onViewportChange={setMapViewport} className="w-full h-full">
                                            <MapControls position="bottom-right" showLocate onLocate={handleLocate} />
                                            <MapMarker longitude={formData.location.lng} latitude={formData.location.lat} draggable onDragEnd={handleDragEnd}>
                                                <MarkerContent>
                                                    <div className="size-6 cursor-pointer rounded-full border-2 border-white bg-primary shadow-xl transition-transform hover:scale-110 flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                    </div>
                                                    <MarkerLabel position="bottom">Deliver Here</MarkerLabel>
                                                </MarkerContent>
                                            </MapMarker>
                                        </Map>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Document */}
                            <div className="bg-card p-8 rounded-3xl border border-border/60 shadow-soft-sm relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-xl font-headline font-semibold">Identity Verification</h2>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Valid Government ID</Label>
                                    <p className="text-xs text-muted-foreground">For secure transactions, we require a valid government-issued ID.</p>
                                    
                                    <div className="mt-4 flex justify-center rounded-2xl border-2 border-dashed border-border/80 px-6 py-10 hover:bg-primary/5 hover:border-primary/30 transition-all bg-muted/5 relative cursor-pointer group">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="mt-2 flex text-sm leading-6 text-foreground justify-center font-medium">
                                                <label className="relative cursor-pointer focus-within:outline-none">
                                                    <span className="text-primary hover:text-primary-dark underline underline-offset-2">Click to upload</span>
                                                    <span className="text-muted-foreground no-underline ml-1">or drag and drop</span>
                                                    <input name="idFile" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idFile')} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">PNG, JPG, PDF up to 10MB</p>
                                            
                                            {formData.idFile && (
                                                <div className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary/10 text-secondary-dark rounded-full text-xs font-bold">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="max-w-[200px] truncate">{formData.idFile.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 sticky bottom-6 z-20">
                                <Button 
                                    type="submit" 
                                    className="rounded-full font-sans font-bold text-sm px-10 py-6 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary-dark text-white"
                                >
                                    {isSaved ? (
                                        <>
                                            Profile Updated
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Save Changes
                                            <Save className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
