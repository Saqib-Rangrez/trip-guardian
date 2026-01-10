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
  destination: string;
  origin: string;
  departure_date: string;
  return_date: string;
  purpose: string;
  traveler?: string;
}

export default function CreateTrip() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    origin: '',
    departure_date: '',
    return_date: '',
    purpose: '',
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
      const data = await api.get<TravelerProfile[]>('/api/travelers/');
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

    if (new Date(formData.return_date) < new Date(formData.departure_date)) {
      setError('Return date must be after departure date');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/api/trips/', formData);
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

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="traveler">Traveler</Label>
                <Select
                  value={formData.traveler || ''}
                  onValueChange={(value) => handleChange('traveler', value)}
                  disabled={isLoadingTravelers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingTravelers ? 'Loading...' : 'Select traveler'} />
                  </SelectTrigger>
                  <SelectContent>
                    {travelers.map((traveler) => (
                      <SelectItem key={traveler.id} value={traveler.id}>
                        {traveler.passport_issuing_country} - {traveler.passport_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  placeholder="New York, USA"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="London, UK"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_date">Departure Date</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => handleChange('departure_date', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return_date">Return Date</Label>
                <Input
                  id="return_date"
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => handleChange('return_date', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Travel</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                placeholder="Business meeting, conference, client visit..."
                rows={3}
                disabled={isLoading}
              />
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
