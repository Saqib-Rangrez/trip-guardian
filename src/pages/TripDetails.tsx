import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Trip, RiskAnalysis, ApiError } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { LoadingPage, LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { RiskBadge } from '@/components/common/RiskBadge';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Plane, 
  Shield,
  AlertTriangle,
  Heart,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Trip>(`/api/trips/${id}/`);
      setTrip(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeRisk = async () => {
    if (!id) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const data = await api.post<RiskAnalysis>(`/api/trips/${id}/analyze-risk/`);
      setRiskAnalysis(data);
    } catch (err) {
      const apiError = err as ApiError;
      setAnalysisError(apiError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingPage />
      </AppLayout>
    );
  }

  if (error || !trip) {
    return (
      <AppLayout>
        <ErrorMessage 
          message={error || 'Trip not found'} 
          onRetry={fetchTrip} 
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/trips')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Button>

        {/* Trip Header */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Plane className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {trip.origin} → {trip.destination}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(trip.departure_date), 'MMM d')} - {format(new Date(trip.return_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {trip.purpose && (
              <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                <span className="font-medium">Purpose:</span> {trip.purpose}
              </div>
            )}
          </div>
        </div>

        {/* Risk Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Risk Analysis</h2>
            <Button 
              onClick={analyzeRisk} 
              disabled={isAnalyzing}
              variant={riskAnalysis ? 'outline' : 'default'}
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Analyzing...
                </>
              ) : riskAnalysis ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Re-analyze
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Risk
                </>
              )}
            </Button>
          </div>

          {analysisError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{analysisError}</span>
            </div>
          )}

          {!riskAnalysis && !isAnalyzing && !analysisError && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mx-auto mb-4">
                <Shield className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                No risk analysis yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Click "Analyze Risk" to get AI-powered insights about political, health, and safety conditions for your destination.
              </p>
            </div>
          )}

          {riskAnalysis && (
            <div className="space-y-4 animate-slide-up">
              {/* Overall Score Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Risk Score</p>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold text-foreground">
                        {riskAnalysis.overall_score}
                      </span>
                      <RiskBadge level={riskAnalysis.risk_level} size="lg" />
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Analyzed on</p>
                    <p className="font-medium">
                      {format(new Date(riskAnalysis.analyzed_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Risk Score Bar */}
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      riskAnalysis.risk_level === 'Low' && 'bg-risk-low',
                      riskAnalysis.risk_level === 'Medium' && 'bg-risk-medium',
                      riskAnalysis.risk_level === 'High' && 'bg-risk-high'
                    )}
                    style={{ width: `${riskAnalysis.overall_score}%` }}
                  />
                </div>
              </div>

              {/* Risk Categories */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">Political & War Risk</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{riskAnalysis.political_risk}</p>
                  {riskAnalysis.war_risk && (
                    <p className="text-sm text-muted-foreground mt-2">{riskAnalysis.war_risk}</p>
                  )}
                </div>

                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">Health & Safety</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{riskAnalysis.health_risk}</p>
                  {riskAnalysis.safety_notes && (
                    <p className="text-sm text-muted-foreground mt-2">{riskAnalysis.safety_notes}</p>
                  )}
                </div>
              </div>

              {/* Key Factors */}
              {riskAnalysis.key_factors.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">Key Risk Factors</h3>
                  </div>
                  <ul className="space-y-2">
                    {riskAnalysis.key_factors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {riskAnalysis.recommendations.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">AI Recommendations</h3>
                  </div>
                  <ul className="space-y-3">
                    {riskAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
