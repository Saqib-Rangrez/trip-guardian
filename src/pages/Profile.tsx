import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { TravelerProfile, ApiError } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingPage, LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle, User } from 'lucide-react';

interface ProfileFormData {
  passport_number: string;
  passport_issuing_country: string;
  passport_expiry_date: string;
  health_conditions: string;
  frequent_traveler: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    passport_number: '',
    passport_issuing_country: '',
    passport_expiry_date: '',
    health_conditions: '',
    frequent_traveler: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<TravelerProfile[]>('/core/travelers/');
      if (data.length > 0) {
        const userProfile = data.find(p => p.user === user?.id) || data[0];
        setProfile(userProfile);
        setFormData({
          passport_number: userProfile.passport_number,
          passport_issuing_country: userProfile.passport_issuing_country,
          passport_expiry_date: userProfile.passport_expiry_date,
          health_conditions: userProfile.health_conditions || '',
          frequent_traveler: userProfile.frequent_traveler,
        });
      }
    } catch (err) {
      // Profile doesn't exist yet, that's okay
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      if (profile) {
        await api.put(`/core/travelers/${profile.id}/`, formData);
        setSuccess('Profile updated successfully');
      } else {
        const newProfile = await api.post<TravelerProfile>('/core/travelers/', formData);
        setProfile(newProfile);
        setSuccess('Profile created successfully');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingPage />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Traveler Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your travel documentation and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Form Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-4 pb-6 border-b border-border mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Passport & Travel Details</h2>
              <p className="text-sm text-muted-foreground">
                This information is used for risk assessment
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive animate-scale-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-risk-low-bg text-risk-low animate-scale-in">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passport_number">Passport Number</Label>
                <Input
                  id="passport_number"
                  type="text"
                  value={formData.passport_number}
                  onChange={(e) => handleChange('passport_number', e.target.value)}
                  placeholder="AB1234567"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport_issuing_country">Issuing Country</Label>
                <Input
                  id="passport_issuing_country"
                  type="text"
                  value={formData.passport_issuing_country}
                  onChange={(e) => handleChange('passport_issuing_country', e.target.value)}
                  placeholder="United States"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passport_expiry_date">Passport Expiry Date</Label>
              <Input
                id="passport_expiry_date"
                type="date"
                value={formData.passport_expiry_date}
                onChange={(e) => handleChange('passport_expiry_date', e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_conditions">Health Conditions (Optional)</Label>
              <Textarea
                id="health_conditions"
                value={formData.health_conditions}
                onChange={(e) => handleChange('health_conditions', e.target.value)}
                placeholder="List any relevant health conditions or allergies..."
                rows={3}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                This information helps provide personalized health risk assessments
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="frequent_traveler" className="text-base font-medium">
                  Frequent Traveler
                </Label>
                <p className="text-sm text-muted-foreground">
                  I travel internationally more than 5 times per year
                </p>
              </div>
              <Switch
                id="frequent_traveler"
                checked={formData.frequent_traveler}
                onCheckedChange={(checked) => handleChange('frequent_traveler', checked)}
                disabled={isSaving}
              />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : profile ? (
                'Update Profile'
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Why we need this information</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">1</div>
                  <span>Passport details help us verify visa requirements for your destinations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">2</div>
                  <span>Health conditions allow us to provide personalized health risk alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">3</div>
                  <span>Frequent traveler status helps prioritize your risk assessments</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Data Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
