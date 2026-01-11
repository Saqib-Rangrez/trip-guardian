import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Globe, Brain, Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src="/image.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold text-lg">Travel Risk Analyzer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Risk Intelligence</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Travel with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Confidence
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Leverage advanced AI to analyze travel risks in real-time. 
                Get comprehensive insights on political, health, and safety factors for any destination.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                    Start Free Analysis
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">2,500+</span> travelers trust us
                </p>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-scale-in lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 rounded-3xl" />
              <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-6">
                {/* Mock Dashboard Preview */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Tokyo, Japan</p>
                      <p className="text-sm text-muted-foreground">Business Trip</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-risk-low/10 text-risk-low text-sm font-medium">
                    Low Risk
                  </div>
                </div>

                {/* Risk Score Visual */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Risk Score</span>
                    <span className="text-2xl font-bold text-risk-low">28/100</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-risk-low to-risk-low/70 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: '28%' }}
                    />
                  </div>
                </div>

                {/* Risk Categories */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Political', value: 'Stable', color: 'risk-low' },
                    { label: 'Health', value: 'Safe', color: 'risk-low' },
                    { label: 'Safety', value: 'Secure', color: 'risk-low' },
                    { label: 'Infrastructure', value: 'Excellent', color: 'risk-low' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className={`font-semibold text-${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI Badge */}
                <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Analysis Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Intelligent Risk Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes multiple data sources to provide comprehensive travel risk insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning models process real-time data to assess travel risks accurately.',
              },
              {
                icon: Globe,
                title: 'Global Coverage',
                description: 'Comprehensive risk data for every destination worldwide, updated continuously.',
              },
              {
                icon: Zap,
                title: 'Instant Insights',
                description: 'Get detailed risk reports in seconds with actionable recommendations.',
              },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get comprehensive travel risk analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            {[
              { step: '01', title: 'Create Your Trip', description: 'Enter your destination, dates, and travel purpose' },
              { step: '02', title: 'AI Analysis', description: 'Our AI processes multiple risk factors instantly' },
              { step: '03', title: 'Get Insights', description: 'Receive detailed risk report with recommendations' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-6">
                {[
                  'Real-time risk monitoring and alerts',
                  'Comprehensive political and health analysis',
                  'AI-generated travel recommendations',
                  'Enterprise-grade security and privacy',
                  'Dedicated support for HR and admin teams',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-risk-low/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-risk-low" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border/50 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">Enterprise Ready</p>
                    <p className="text-sm text-muted-foreground">Built for organizations of all sizes</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-primary">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-primary">195+</p>
                    <p className="text-sm text-muted-foreground">Countries</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-primary">&lt;2s</p>
                    <p className="text-sm text-muted-foreground">Analysis Time</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/50">
                    <p className="text-3xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-muted-foreground">Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/50 space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Travel Smarter?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of travelers and organizations using AI-powered risk analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src="/image.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold">Travel Risk Analyzer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Travel Risk Analyzer. AI-Powered Travel Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
