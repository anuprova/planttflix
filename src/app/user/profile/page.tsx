"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/lib/UseUserProfile";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function UserProfilePage() {
    const { user } = useAuth();
    const { data: userProfile, isLoading } = useUserProfile(user?.email);
    const updateProfile = useUpdateUserProfile();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (userProfile) {
            setProfileData({
                name: userProfile.name || user?.name || "",
                phone: userProfile.phone || "",
                address: userProfile.address || "",
            });
            setImagePreview(userProfile.profileImage || null);
        } else if (user) {
            setProfileData({
                name: user.name || "",
                phone: "",
                address: "",
            });
        }
    }, [userProfile, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            await updateProfile.mutateAsync({
                email: user.email,
                data: profileData,
                image: imageFile,
            });
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            setImageFile(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (userProfile) {
            setProfileData({
                name: userProfile.name || user?.name || "",
                phone: userProfile.phone || "",
                address: userProfile.address || "",
            });
            setImagePreview(userProfile.profileImage || null);
        }
        setIsEditing(false);
        setImageFile(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    <p className="text-gray-500 mt-1">Manage your account information</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-8">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Profile"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-green-600" />
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:text-green-600 transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="text-white">
                            <h3 className="text-2xl font-bold">{profileData.name || "User"}</h3>
                            <p className="text-green-100">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, name: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                                {profileData.name || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4" />
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, phone: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                            />
                        ) : (
                            <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg">
                                {profileData.phone || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                        </label>
                        {isEditing ? (
                            <textarea
                                value={profileData.address}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, address: e.target.value })
                                }
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                placeholder="Enter your complete shipping address"
                            />
                        ) : (
                            <p className="text-gray-900 px-4 py-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                {profileData.address || "Not provided"}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSaveProfile}
                                disabled={updateProfile.isPending}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {updateProfile.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={updateProfile.isPending}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
