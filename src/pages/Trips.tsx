import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Trip, ApiError } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { RiskBadge } from '@/components/common/RiskBadge';
import { 
  Plus, 
  Plane, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Trip[]>('/api/trips/');
      setTrips(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-risk-low-bg text-risk-low border-risk-low/30';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdmin ? 'All Trips' : 'My Trips'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin 
                ? 'View and manage trips across all travelers'
                : 'View and manage your upcoming and past trips'
              }
            </p>
          </div>
          <Button onClick={() => navigate('/trips/new')}>
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by destination or origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingPage />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTrips} />
        ) : filteredTrips.length === 0 ? (
          <EmptyState
            icon={<Plane className="h-8 w-8 text-muted-foreground" />}
            title={searchQuery ? 'No trips found' : 'No trips yet'}
            description={
              searchQuery 
                ? 'Try adjusting your search query'
                : 'Create your first trip to get started with risk analysis'
            }
            action={
              !searchQuery && (
                <Button onClick={() => navigate('/trips/new')}>
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Button>
              )
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip, index) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-card rounded-xl border border-border p-6 shadow-card transition-all hover:shadow-card-hover hover:border-primary/20">
                  {/* Destination */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {trip.destination}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          from {trip.origin}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(trip.departure_date), 'MMM d')} - {format(new Date(trip.return_date), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Status & Purpose */}
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full border capitalize',
                      getStatusColor(trip.status)
                    )}>
                      {trip.status}
                    </span>
                    {trip.purpose && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {trip.purpose}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
