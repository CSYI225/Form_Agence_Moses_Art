import React, { useState } from 'react';
import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import astronautHero from './assets/moses_space_hero.png';
import mosesLogo from './assets/moses_art_logo.png';

const INITIAL_FORM_STATE = {
  fullName: '',
  company: '',
  role: '',
  phone: '',
  email: '',
  services: {
    communication: false,
    publicite: false,
    marketing: false,
    mobile: false,
    design: false,
    digitalisation: false,
    audiovisuel: false,
    evenementiel: false,
    impression: false,
    aucun: false,
  },
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'submitting'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const updatedServices = {
        ...prev.services,
        [serviceId]: !prev.services[serviceId],
      };
      return { ...prev, services: updatedServices };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName || formData.fullName.trim().length < 2)
        newErrors.fullName = 'Le nom et le prénom sont requis (minimum 2 caractères)';
      if (!formData.company || formData.company.trim().length < 2)
        newErrors.company = "L'entreprise ou l'organisation est requise";
      if (!formData.role || formData.role.trim().length < 2)
        newErrors.role = 'La fonction est requise';
      if (!formData.phone || formData.phone.trim().length < 4)
        newErrors.phone = 'Le numéro de téléphone est requis';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email)
        newErrors.email = "L'adresse e-mail est requise";
      else if (!emailRegex.test(formData.email))
        newErrors.email = 'Veuillez saisir une adresse e-mail valide';
    } else if (currentStep === 2) {
      const isAnySelected = Object.values(formData.services).some((v) => v === true);
      if (!isAnySelected)
        newErrors.services = 'Veuillez sélectionner au moins un service recherché';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setSubmitStatus('submitting');

    try {
      const response = await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.company,
          role: formData.role,
          phone: formData.phone,
          email: formData.email,
          services: formData.services,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setStep(1);
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  return (
    <>
      <div className="bg-glow-left"></div>

      <div className="app-container">
        {/* Left Form Panel */}
        <div className="form-section">
          {/* Header */}
          <header className="form-header">
            {/* Real Moses Art Logo */}
            <div className="logo-container">
              <img src={mosesLogo} alt="Agence Moses Art" className="logo-img" />
            </div>

            {/* Star-breathing website button */}
            <a
              href="https://agencemosesart.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-website"
            >
              <span className="star-icon">✦</span>
              Notre site
              <span className="star-icon">✦</span>
            </a>
          </header>

          {/* Dynamic Form Content */}
          {step === 1 && (
            <FormStep1
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}

          {step === 2 && (
            <FormStep2
              formData={formData}
              errors={errors}
              handleServiceToggle={handleServiceToggle}
              handleChange={handleChange}
            />
          )}

          {/* Footer Navigation */}
          <footer className="form-footer">
            <div className="step-indicator">
              <span className={`step-number ${step >= 1 ? 'active' : ''}`}>01</span>
              <div className="step-line-container">
                <div
                  className="step-line-progress"
                  style={{ width: step === 2 ? '100%' : '50%' }}
                ></div>
              </div>
              <span className={`step-number ${step === 2 ? 'active' : ''}`}>02</span>
            </div>

            <div className="footer-buttons">
              {submitStatus === 'success' && (
                <div style={{ color: '#0e8588', fontWeight: 'bold', fontSize: '0.9rem', marginRight: '15px' }}>
                  Enregistrement réussi !
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ color: '#e52b2b', fontWeight: 'bold', fontSize: '0.9rem', marginRight: '15px' }}>
                  Erreur de connexion. Réessayez.
                </div>
              )}
              {step === 2 && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleBack}
                  disabled={submitStatus === 'submitting'}
                >
                  Retour
                </button>
              )}
              {step === 1 ? (
                <button type="button" className="btn-primary" onClick={handleNext}>
                  Suivant
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary" 
                  onClick={handleSubmit}
                  disabled={submitStatus === 'submitting'}
                >
                  {submitStatus === 'submitting' ? 'Enregistrement...' : 'Enregistrer'}
                  {submitStatus !== 'submitting' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  )}
                </button>
              )}
            </div>
          </footer>
        </div>

        {/* Right Visual Showcase Panel */}
        <div className="visual-section">
          <div className="tech-coordinates">
            MOSES ART AGENCY // EST. 2026 // STAND 04
          </div>

          <div className="sphere-backdrop">
            <img
              src={astronautHero}
              className="hero-image"
              alt="Moses Art Stand Astronaut Helmet"
            />
          </div>

          <div className="tech-details">
            SYSTÈME: {step === 2 ? 'ÉTAPE 02' : 'ÉTAPE 01'}<br />
            ORBIT: LEO_EXPO_GRID<br />
            STATION: MOSES_EXPO_STAND
          </div>
        </div>
      </div>
    </>
  );
}
