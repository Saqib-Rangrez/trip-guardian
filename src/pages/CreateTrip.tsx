import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiError, TravelerProfile } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TripFormData {
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  purpose: string;
  accommodation: string;
  transport_mode: string;
  traveler: string;
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [formData, setFormData] = useState<TripFormData>({
    destination_country: '',
    destination_city: '',
    start_date: '',
    end_date: '',
    purpose: '',
    accommodation: '',
    transport_mode: '',
    traveler: isAdmin ? '' : (user?.id || ''),
  });

  const [travelers, setTravelers] = useState<TravelerProfile[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTravelers, setIsLoadingTravelers] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchTravelers();
    }
  }, [isAdmin]);

  const fetchTravelers = async () => {
    setIsLoadingTravelers(true);
    try {
      const data = await api.get<TravelerProfile[]>('/core/travelers/');
      setTravelers(data);
    } catch (err) {
      console.error('Failed to fetch travelers');
    } finally {
      setIsLoadingTravelers(false);
    }
  };

  const handleChange = (field: keyof TripFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (
      !formData.destination_country ||
      !formData.destination_city ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.purpose ||
      !formData.accommodation ||
      !formData.transport_mode
    ) {
      setError('Please fill in all required fields');
      return;
    }

    // Traveler validation
    const travelerValue = formData.traveler.trim();
    if (!travelerValue) {
      setError(
        isAdmin
          ? 'Please select a traveler'
          : 'Please enter your traveler ID'
      );
      return;
    }

    const travelerId = parseInt(travelerValue, 10);
    if (isNaN(travelerId) || travelerId < 1) {
      setError('Traveler ID must be a valid positive number');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError('End date must be after start date');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        destination_country: formData.destination_country,
        destination_city: formData.destination_city,
        start_date: formData.start_date,
        end_date: formData.end_date,
        purpose: formData.purpose,
        accommodation: formData.accommodation,
        transport_mode: formData.transport_mode,
        traveler: travelerId,           // ← guaranteed valid number
      };

      await api.post('/core/trips/', payload);
      navigate('/trips');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/trips')}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card">
            <h1 className="text-2xl font-bold text-foreground mb-6">Create New Trip</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive animate-scale-in">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {isAdmin ? (
                <div className="space-y-2">
                  <Label htmlFor="traveler">Traveler *</Label>
                  <Select
                    value={formData.traveler}
                    onValueChange={(value) => handleChange('traveler', value)}
                    disabled={isLoadingTravelers || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingTravelers ? 'Loading travelers...' : 'Select traveler'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {travelers.map((traveler) => (
                        <SelectItem key={traveler.id} value={String(traveler.id)}>
                          {traveler.passport_issuing_country} - {traveler.passport_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="traveler">Your Traveler ID *</Label>
                  <Input
                    id="traveler"
                    type="number"
                    value={formData.traveler}
                    onChange={(e) => handleChange('traveler', e.target.value)}
                    placeholder="Enter your traveler ID"
                    min="1"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_country">Destination Country *</Label>
                  <Input
                    id="destination_country"
                    type="text"
                    value={formData.destination_country}
                    onChange={(e) => handleChange('destination_country', e.target.value)}
                    placeholder="Egypt"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination_city">Destination City *</Label>
                  <Input
                    id="destination_city"
                    type="text"
                    value={formData.destination_city}
                    onChange={(e) => handleChange('destination_city', e.target.value)}
                    placeholder="Cairo"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Travel *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Business meeting, conference, client visit..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation *</Label>
                  <Input
                    id="accommodation"
                    type="text"
                    value={formData.accommodation}
                    onChange={(e) => handleChange('accommodation', e.target.value)}
                    placeholder="Hilton Cairo Zamalek"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport_mode">Transport Mode *</Label>
                  <Select
                    value={formData.transport_mode}
                    onValueChange={(value) => handleChange('transport_mode', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flight">Flight</SelectItem>
                      <SelectItem value="Train">Train</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Ship">Ship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/trips')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating...
                    </>
                  ) : (
                    'Create Trip'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Trip Tips</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Enter exact city names for accurate risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Include country codes for better destination matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Provide detailed purpose for personalized recommendations</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                After creating your trip, you can run our AI-powered risk analysis to get comprehensive safety insights, political assessments, and health recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}