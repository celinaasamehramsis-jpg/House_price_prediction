import React, { useState, useEffect } from 'react';
import { PredictionForm } from './components/PredictionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { PredictionResult, HealthStatus } from './types/prediction';
import { checkHealth } from './api/predictionClient';
import { Building2, Sparkles, Server } from 'lucide-react';

export const App: React.FC = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus>({
    status: 'offline',
    model_loaded: false,
    version: '1.0'
  });

  useEffect(() => {
    async function verifyBackendHealth() {
      const status = await checkHealth();
      setHealth(status);
    }
    verifyBackendHealth();
    // Periodically verify health
    const interval = setInterval(verifyBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePredictionSuccess = (result: PredictionResult) => {
    setPredictionResult(result);
    setIsLoading(false);
  };

  const handlePredictionStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handlePredictionError = (errMsg: string | null) => {
    setError(errMsg);
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="brand-title">Valuatr AI</h1>
            <p className="brand-subtitle">Smart Real Estate Valuation Engine</p>
          </div>
        </div>

        <div className="status-badge">
          <span className={`status-dot ${health.status === 'healthy' ? 'healthy' : 'offline'}`} />
          <Server size={14} style={{ opacity: 0.7 }} />
          <span>
            {health.status === 'healthy' 
              ? 'Backend API & ML Model Ready' 
              : 'Backend Offline / Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="main-grid">
        <PredictionForm
          onPredictionSuccess={handlePredictionSuccess}
          onPredictionStart={handlePredictionStart}
          onPredictionError={handlePredictionError}
        />

        <ResultDisplay
          result={predictionResult}
          isLoading={isLoading}
          error={error}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Valuatr AI &copy; {new Date().getFullYear()} &bull; Built with FastAPI, scikit-learn & React TypeScript
        </p>
      </footer>
    </div>
  );
};

export default App;
