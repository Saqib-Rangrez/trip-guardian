import { ReactNode } from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-nav flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nav-accent">
              <Shield className="h-6 w-6 text-nav-foreground" />
            </div>
            <span className="text-xl font-semibold text-nav-foreground">
              Travel Risk Analyzer
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-nav-foreground leading-tight">
            AI-Powered Travel<br />Risk Intelligence
          </h1>
          <p className="text-nav-foreground/70 text-lg max-w-md">
            Assess travel risks with advanced AI analysis. Get real-time insights on political, health, and safety conditions for your destinations.
          </p>
        </div>

        <div className="flex gap-8">
          <div>
            <div className="text-3xl font-bold text-nav-accent">150+</div>
            <div className="text-nav-foreground/60 text-sm">Countries Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-nav-accent">24/7</div>
            <div className="text-nav-foreground/60 text-sm">Risk Monitoring</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-nav-accent">AI</div>
            <div className="text-nav-foreground/60 text-sm">Powered Analysis</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Travel Risk Analyzer
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
