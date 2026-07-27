import React from 'react';
import { PredictionResult } from '../types/prediction';
import { IndianRupee, TrendingUp, CheckCircle, HelpCircle, Layers, Home, MapPin, Tag, Compass } from 'lucide-react';

interface ResultDisplayProps {
  result: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="glass-card result-card empty-state">
        <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 1rem', borderWidth: 3 }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Running ML Pipeline...
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Feeding property parameters through Random Forest regression model.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card result-card empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <div className="empty-icon" style={{ color: '#ef4444', opacity: 0.8 }}>⚠️</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fca5a5', marginBottom: '0.5rem' }}>
          Prediction Unsuccessful
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto' }}>
          {error}
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card result-card empty-state">
        <HelpCircle className="empty-icon" />
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          No Prediction Generated
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
          Fill in the property details on the left and click <strong>Predict Property Price</strong> to calculate valuation.
        </p>
      </div>
    );
  }

  const { predicted_price, formatted_price, features_summary } = result;

  return (
    <div className="glass-card result-card">
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">
            <TrendingUp style={{ color: 'var(--accent-emerald)' }} />
            Estimated Property Value
          </h2>
          <span className="status-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)' }}>
            <CheckCircle size={12} /> Model Confidence High
          </span>
        </div>
      </div>

      <div className="price-box">
        <div className="price-label">Predicted Market Valuation</div>
        <div className="price-value">{formatted_price}</div>
        <div className="price-subtext">
          Raw Numerical: ₹ {predicted_price.toLocaleString('en-IN')} INR
        </div>
      </div>

      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>
        Evaluated Property Features
      </h4>

      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-item-label">Location</div>
          <div className="summary-item-value">{features_summary.location_grouped}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Carpet Area</div>
          <div className="summary-item-value">{features_summary.carpet_area_sqft} sq.ft</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Floor</div>
          <div className="summary-item-value">Floor {features_summary.floor_num}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Baths / Balconies</div>
          <div className="summary-item-value">{features_summary.bathroom} Bath, {features_summary.balcony} Balcony</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Furnishing</div>
          <div className="summary-item-value">{features_summary.Furnishing}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Transaction</div>
          <div className="summary-item-value">{features_summary.Transaction}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Ownership</div>
          <div className="summary-item-value">{features_summary.Ownership}</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Facing</div>
          <div className="summary-item-value">{features_summary.facing}</div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
        ℹ️ <strong>Note:</strong> Predictions are generated using a Random Forest model trained on real estate market data. Actual transactions may vary based on micro-location factors.
      </div>
    </div>
  );
};
