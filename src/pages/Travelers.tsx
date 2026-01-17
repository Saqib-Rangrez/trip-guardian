import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TravelerProfile, ApiError } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingPage } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  Users, 
  Search,
  Globe,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Travelers() {
  const [travelers, setTravelers] = useState<TravelerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTravelers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<TravelerProfile[]>('/core/travelers/');
      setTravelers(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelers();
  }, []);

  const filteredTravelers = travelers.filter((traveler) =>
    traveler.passport_issuing_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    traveler.passport_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Travelers</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered travelers
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by country or passport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingPage />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTravelers} />
        ) : filteredTravelers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title={searchQuery ? 'No travelers found' : 'No travelers yet'}
            description={
              searchQuery 
                ? 'Try adjusting your search query'
                : 'Travelers will appear here once they create their profiles'
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTravelers.map((traveler, index) => (
              <div
                key={traveler.id}
                className="bg-card rounded-xl border border-border p-6 shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {traveler.passport_issuing_country}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {traveler.passport_number}
                      </p>
                    </div>
                  </div>
                  {traveler.frequent_traveler && (
                    <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <BadgeCheck className="h-3 w-3" />
                      Frequent
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expires: {format(new Date(traveler.passport_expiry_date), 'MMM d, yyyy')}
                  </span>
                </div>

                {traveler.health_conditions && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Health Notes:</p>
                    <p className="text-sm text-foreground mt-1 line-clamp-2">
                      {traveler.health_conditions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
