import React, { useState, useEffect } from 'react';
import { HouseFeaturesInput, PredictionResult } from '../types/prediction';
import { fetchLocations, predictPrice } from '../api/predictionClient';
import { Calculator, MapPin, Home, Layers, Bath, Compass, ShieldCheck, Tag, Sparkles, RefreshCw } from 'lucide-react';

interface PredictionFormProps {
  onPredictionSuccess: (result: PredictionResult) => void;
  onPredictionStart: () => void;
  onPredictionError: (error: string | null) => void;
}

const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Furnished'];
const TRANSACTION_OPTIONS = ['Resale', 'New Property'];
const OWNERSHIP_OPTIONS = ['Freehold', 'Co-operative Society', 'Power Of Attorney', 'Leasehold'];
const FACING_OPTIONS = ['East', 'West', 'North - East', 'North', 'North - West', 'South', 'South -West', 'South - East'];

export const PredictionForm: React.FC<PredictionFormProps> = ({
  onPredictionSuccess,
  onPredictionStart,
  onPredictionError
}) => {
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State initialized with realistic default values
  const [formData, setFormData] = useState<HouseFeaturesInput>({
    carpet_area_sqft: 1200,
    floor_num: 3,
    bathroom: 2,
    balcony: 1,
    location_grouped: 'mumbai',
    Furnishing: 'Semi-Furnished',
    Transaction: 'Resale',
    Ownership: 'Freehold',
    facing: 'East'
  });

  useEffect(() => {
    async function loadLocations() {
      setLoadingLocations(true);
      const locList = await fetchLocations();
      setLocations(locList);
      if (locList.length > 0 && !locList.includes(formData.location_grouped)) {
        setFormData(prev => ({ ...prev, location_grouped: locList[0] }));
      }
      setLoadingLocations(false);
    }
    loadLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setValidationError(null);
    onPredictionError(null);

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.carpet_area_sqft || formData.carpet_area_sqft <= 0) {
      setValidationError("Carpet area must be greater than 0 sq.ft.");
      return false;
    }
    if (formData.carpet_area_sqft > 100000) {
      setValidationError("Carpet area exceeds maximum allowed value (100,000 sq.ft.).");
      return false;
    }
    if (formData.floor_num < 0 || formData.floor_num > 150) {
      setValidationError("Floor number must be between 0 and 150.");
      return false;
    }
    if (formData.bathroom < 1 || formData.bathroom > 20) {
      setValidationError("Bathrooms must be between 1 and 20.");
      return false;
    }
    if (formData.balcony < 0 || formData.balcony > 10) {
      setValidationError("Balconies must be between 0 and 10.");
      return false;
    }
    if (!formData.location_grouped) {
      setValidationError("Please select a target location.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    onPredictionStart();
    onPredictionError(null);

    try {
      const result = await predictPrice(formData);
      onPredictionSuccess(result);
    } catch (err: any) {
      const msg = err.message || "Failed to calculate house price prediction.";
      setValidationError(msg);
      onPredictionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      carpet_area_sqft: 1200,
      floor_num: 3,
      bathroom: 2,
      balcony: 1,
      location_grouped: locations[0] || 'mumbai',
      Furnishing: 'Semi-Furnished',
      Transaction: 'Resale',
      Ownership: 'Freehold',
      facing: 'East'
    });
    setValidationError(null);
    onPredictionError(null);
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">
          <Calculator className="brand-icon-sm" style={{ color: 'var(--primary-accent)' }} />
          Property Details Input
        </h2>
        <p className="card-description">
          Enter structural specifications and property parameters for instant AI valuation.
        </p>
      </div>

      {validationError && (
        <div className="error-banner">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        {/* Location Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="location_grouped">
            <MapPin size={16} style={{ color: 'var(--accent-cyan)' }} />
            Location / City
          </label>
          <select
            id="location_grouped"
            name="location_grouped"
            value={formData.location_grouped}
            onChange={handleChange}
            className="form-select"
            disabled={loadingLocations}
            required
          >
            {loadingLocations ? (
              <option>Loading location list...</option>
            ) : (
              locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc.toUpperCase()}
                </option>
              ))
            )}
          </select>
          <span className="input-hint">Populated from model location registry</span>
        </div>

        {/* Numeric Inputs Grid */}
        <div className="form-grid-2col">
          <div className="form-group">
            <label className="form-label" htmlFor="carpet_area_sqft">
              <Home size={16} style={{ color: 'var(--primary-accent)' }} />
              Carpet Area (sq.ft)
            </label>
            <input
              type="number"
              id="carpet_area_sqft"
              name="carpet_area_sqft"
              value={formData.carpet_area_sqft}
              onChange={handleChange}
              placeholder="e.g. 1200"
              min="50"
              max="100000"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="floor_num">
              <Layers size={16} style={{ color: 'var(--accent-gold)' }} />
              Floor Number
            </label>
            <input
              type="number"
              id="floor_num"
              name="floor_num"
              value={formData.floor_num}
              onChange={handleChange}
              placeholder="e.g. 5"
              min="0"
              max="150"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group">
            <label className="form-label" htmlFor="bathroom">
              <Bath size={16} style={{ color: 'var(--accent-cyan)' }} />
              Bathrooms
            </label>
            <input
              type="number"
              id="bathroom"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="e.g. 2"
              min="1"
              max="20"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="balcony">
              <Sparkles size={16} style={{ color: 'var(--accent-emerald)' }} />
              Balconies
            </label>
            <input
              type="number"
              id="balcony"
              name="balcony"
              value={formData.balcony}
              onChange={handleChange}
              placeholder="e.g. 1"
              min="0"
              max="10"
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Categorical Dropdowns Grid */}
        <div className="form-grid-2col">
          <div className="form-group">
            <label className="form-label" htmlFor="Furnishing">
              <Tag size={16} style={{ color: 'var(--primary-accent)' }} />
              Furnishing Status
            </label>
            <select
              id="Furnishing"
              name="Furnishing"
              value={formData.Furnishing}
              onChange={handleChange}
              className="form-select"
              required
            >
              {FURNISHING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="Transaction">
              <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
              Transaction Type
            </label>
            <select
              id="Transaction"
              name="Transaction"
              value={formData.Transaction}
              onChange={handleChange}
              className="form-select"
              required
            >
              {TRANSACTION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2col">
          <div className="form-group">
            <label className="form-label" htmlFor="Ownership">
              <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
              Ownership Type
            </label>
            <select
              id="Ownership"
              name="Ownership"
              value={formData.Ownership}
              onChange={handleChange}
              className="form-select"
              required
            >
              {OWNERSHIP_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="facing">
              <Compass size={16} style={{ color: 'var(--accent-cyan)' }} />
              Facing Direction
            </label>
            <select
              id="facing"
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              className="form-select"
              required
            >
              {FACING_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting || loadingLocations}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                Calculating Valuation...
              </>
            ) : (
              <>
                <Calculator size={18} />
                Predict Property Price
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            title="Reset Form"
            style={{
              padding: '0.95rem 1.25rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
