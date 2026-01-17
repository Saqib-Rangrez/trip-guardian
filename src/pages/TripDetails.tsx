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
      const data = await api.get<Trip>(`/core/trips/${id}/`);
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
      const data = await api.post<RiskAnalysis>(`/core/trips/${id}/analyze-risk/`);
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
      <div className="space-y-8 animate-fade-in">
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
                  {trip.destination_city}, {trip.destination_country}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(new Date(trip.start_date), 'MMM d')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                <span className="font-medium">Purpose:</span> {trip.purpose}
              </div>
              <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                <span className="font-medium">Accommodation:</span> {trip.accommodation}
              </div>
              <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                <span className="font-medium">Transport:</span> {trip.transport_mode}
              </div>
            </div>
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
            <div className="space-y-6 animate-slide-up">
              {/* Executive Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-muted/30 rounded-xl border border-primary/20 p-6">
                <p className="text-foreground text-sm leading-relaxed">{riskAnalysis.analysis.executive_summary}</p>
              </div>

              {/* Overall Score Card */}
              <div className="bg-gradient-to-br from-card to-muted/30 rounded-xl border border-border p-8 shadow-card">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  {/* Score Display */}
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                      <span className="text-5xl font-bold text-foreground">
                        {riskAnalysis.analysis.overall_risk_score}
                      </span>
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-3">
                      <RiskBadge level={riskAnalysis.analysis.risk_level} size="lg" />
                    </div>
                  </div>

                  {/* Risk Score Bar */}
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low Risk</span>
                        <span>Medium Risk</span>
                        <span>High Risk</span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 flex">
                          <div className="w-1/3 bg-risk-low/20"></div>
                          <div className="w-1/3 bg-risk-medium/20"></div>
                          <div className="w-1/3 bg-risk-high/20"></div>
                        </div>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500 relative z-10',
                            riskAnalysis.analysis.risk_level === 'Low' && 'bg-risk-low',
                            riskAnalysis.analysis.risk_level === 'Medium' && 'bg-risk-medium',
                            riskAnalysis.analysis.risk_level === 'High' && 'bg-risk-high'
                          )}
                          style={{ width: `${riskAnalysis.analysis.overall_risk_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Info Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-lg font-semibold text-foreground">{riskAnalysis.analysis.travel_dates.duration_days} days</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <p className="text-xs text-muted-foreground mb-1">Travel Dates</p>
                  <p className="text-sm font-semibold text-foreground">
                    {format(new Date(riskAnalysis.analysis.travel_dates.start), 'MMM d')} - {format(new Date(riskAnalysis.analysis.travel_dates.end), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <p className="text-xs text-muted-foreground mb-1">Destination</p>
                  <p className="text-sm font-semibold text-foreground">{riskAnalysis.analysis.destination}</p>
                </div>
              </div>

              {/* Traveler Health Information */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Traveler Health Profile
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Health Conditions</p>
                    <p className="text-sm font-medium text-foreground">{riskAnalysis.analysis.traveler.health_conditions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Frequent Traveler</p>
                    <p className="text-sm font-medium text-foreground">{riskAnalysis.analysis.traveler.frequent_traveler ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Top Risks */}
              {riskAnalysis.analysis.top_risks.length > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Top Risks
                  </h3>
                  <ul className="space-y-2">
                    {riskAnalysis.analysis.top_risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Score Breakdown */}
              {Object.keys(riskAnalysis.analysis.risk_score_breakdown).length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Risk Score Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(riskAnalysis.analysis.risk_score_breakdown).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-semibold text-foreground">{value}/100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consolidated Recommendations */}
              {riskAnalysis.analysis.consolidated_recommendations.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Key Recommendations</h3>
                  </div>
                  <ul className="space-y-3">
                    {riskAnalysis.analysis.consolidated_recommendations.map((rec, index) => (
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

              {/* Detailed Agent Reports */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Detailed Risk Analysis</h3>
                
                {/* Weather & Climate Report */}
                {riskAnalysis.analysis.agent_reports.weather_climate && (
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 className="font-semibold text-foreground">Weather & Climate Analysis</h4>
                      </div>
                      <span className={cn(
                        'text-xs font-medium px-2.5 py-1 rounded-full',
                        riskAnalysis.analysis.agent_reports.weather_climate.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      )}>
                        {riskAnalysis.analysis.agent_reports.weather_climate.status === 'success' ? 'Complete' : 'Partial'}
                      </span>
                    </div>
                    
                    {riskAnalysis.analysis.agent_reports.weather_climate.status === 'error' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-amber-800">{riskAnalysis.analysis.agent_reports.weather_climate.message}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-foreground">{riskAnalysis.analysis.agent_reports.weather_climate.risk_score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </div>
                    
                    {riskAnalysis.analysis.agent_reports.weather_climate.weather && (
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                          <p className="font-medium text-foreground">{riskAnalysis.analysis.agent_reports.weather_climate.weather.temperature_range}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Weather</p>
                          <p className="font-medium text-foreground">{riskAnalysis.analysis.agent_reports.weather_climate.weather.weather_description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Precipitation</p>
                          <p className="font-medium text-foreground">{riskAnalysis.analysis.agent_reports.weather_climate.weather.precipitation_mm}mm</p>
                        </div>
                      </div>
                    )}
                    
                    {riskAnalysis.analysis.agent_reports.weather_climate.air_quality && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">Air Quality</p>
                        <p className="font-medium text-foreground text-sm">{riskAnalysis.analysis.agent_reports.weather_climate.air_quality.quality_level}</p>
                        <p className="text-xs text-muted-foreground mt-1">{riskAnalysis.analysis.agent_reports.weather_climate.air_quality.health_impact}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Health & Disease Report */}
                {riskAnalysis.analysis.agent_reports.health_disease && (
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                          <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <h4 className="font-semibold text-foreground">Health & Disease Analysis</h4>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        Complete
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-foreground">{riskAnalysis.analysis.agent_reports.health_disease.risk_score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </div>

                    <div className="space-y-4 text-sm">
                      {riskAnalysis.analysis.agent_reports.health_disease.covid_19 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">COVID-19 Risk</p>
                          <p className="font-medium text-foreground">{riskAnalysis.analysis.agent_reports.health_disease.covid_19.risk_level}</p>
                        </div>
                      )}

                      {riskAnalysis.analysis.agent_reports.health_disease.disease_outbreaks && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Endemic Diseases</p>
                          <div className="flex flex-wrap gap-2">
                            {riskAnalysis.analysis.agent_reports.health_disease.disease_outbreaks.endemic_diseases.map((disease, idx) => (
                              <span key={idx} className="text-xs bg-muted px-2.5 py-1 rounded text-foreground font-medium">
                                {disease}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {riskAnalysis.analysis.agent_reports.health_disease.vaccination_requirements && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Recommended Vaccinations</p>
                          <ul className="space-y-1">
                            {riskAnalysis.analysis.agent_reports.health_disease.vaccination_requirements.recommended.map((vaccine, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-foreground">{vaccine}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {riskAnalysis.analysis.agent_reports.health_disease.healthcare_infrastructure && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Healthcare Infrastructure</p>
                          <p className="font-medium text-foreground text-sm">{riskAnalysis.analysis.agent_reports.health_disease.healthcare_infrastructure.quality_rating}</p>
                          <p className="text-xs text-muted-foreground mt-1">{riskAnalysis.analysis.agent_reports.health_disease.healthcare_infrastructure.recommendation}</p>
                        </div>
                      )}
                    </div>

                    {riskAnalysis.analysis.agent_reports.health_disease.recommendations && (
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-xs font-semibold text-primary mb-2">Health Recommendations</p>
                        <ul className="space-y-1.5">
                          {riskAnalysis.analysis.agent_reports.health_disease.recommendations.slice(0, 5).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <span className="text-primary mt-0.5">✓</span>
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
          )}
        </div>
      </div>
    </AppLayout>
  );
}
