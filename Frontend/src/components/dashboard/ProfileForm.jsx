import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileForm({ user, onSave, isSaving }) {
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        avatar: user?.avatar || ""
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave?.(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.avatar} />
                        <AvatarFallback className="text-2xl bg-neutral-100">
                            {formData.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                    >
                        <Camera className="h-4 w-4" />
                    </button>
                </div>
                <div>
                    <h3 className="font-semibold text-neutral-900">{formData.full_name || "User"}</h3>
                    <p className="text-sm text-neutral-500">{formData.email}</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => handleChange("full_name", e.target.value)}
                            className="pl-10"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="pl-10"
                            placeholder="john@example.com"
                            disabled
                        />
                    </div>
                    <p className="text-xs text-neutral-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="pl-10"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-neutral-900 hover:bg-neutral-800"
                >
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}