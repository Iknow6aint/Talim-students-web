'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Briefcase, Pencil } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export function ProfileSettings() {
  const { user } = useAuthContext();
  const [profileImage, setProfileImage] = useState('/placeholder.svg');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phoneNumber ?? '',
        email: user.email ?? '',
        role: user.role ?? '',
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const initials = formData.firstName && formData.lastName
    ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
    : 'T';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#030E18]">Profile</h1>

      {/* Avatar row */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="w-28 h-28">
          <AvatarImage src={profileImage} alt="Profile picture" />
          <AvatarFallback className="text-xl bg-[#003366] text-white">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-4 pt-1">
          <h2 className="text-xl font-semibold text-[#030E18]">
            {formData.firstName} {formData.lastName}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              className="bg-[#003366] hover:bg-[#002B5B]"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              Change Picture
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setProfileImage('/placeholder.svg')}
            >
              Remove Picture
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="bg-gray-100 rounded-t-lg flex flex-row items-center justify-between py-3 px-6">
          <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center gap-1 text-[#003366] hover:bg-gray-200"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                <User className="h-4 w-4" />
                First Name
              </Label>
              {isEditing ? (
                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
              ) : (
                <p className="text-base font-medium text-[#030E18]">{formData.firstName || '—'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              {isEditing ? (
                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
              ) : (
                <p className="text-base font-medium text-[#030E18]">{formData.lastName || '—'}</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                <p className="text-base font-medium text-[#030E18]">{formData.phone || '—'}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              ) : (
                <p className="text-base font-medium text-[#030E18]">{formData.email || '—'}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-500">
              <Briefcase className="h-4 w-4" />
              Role
            </Label>
            <p className="text-base font-medium text-[#030E18] capitalize">{formData.role || '—'}</p>
          </div>
        </CardContent>
      </Card>

      {/* School Information */}
      {user?.schoolName && (
        <Card>
          <CardHeader className="bg-gray-100 rounded-t-lg py-3 px-6">
            <CardTitle className="text-base font-semibold">School Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-gray-500">School Name</Label>
              <p className="text-base font-medium text-[#030E18]">{user.schoolName}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
