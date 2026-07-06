import React, { useEffect, useState } from 'react';

const SERVICE_LABELS = {
  communication: 'Conseil Comm 360',
  publicite: 'Publicité',
  marketing: 'Marketing Digital',
  mobile: 'App Mobile',
  design: 'Design Graphique',
  digitalisation: 'Digitalisation',
  audiovisuel: 'Production AV',
  evenementiel: 'Événementiel',
  impression: 'Impression',
};

export default function SuccessState({ formData, resetForm }) {
  const [ticketId, setTicketId] = useState('');
  const [countdown, setCountdown] = useState({
    days: 42,
    hours: 12,
    minutes: 4,
    seconds: 56,
  });

  useEffect(() => {
    // Generate a unique boarding pass ID
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
    setTicketId(`MA-ART-${randomHex}`);

    // Countdown interval (tick every second)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSelectedServices = () => {
    const list = [];
    if (!formData.services) return 'Aucun';
    
    Object.keys(formData.services).forEach((key) => {
      if (formData.services[key]) {
        if (key === 'autre') {
          list.push(formData.otherServiceText || 'Autre');
        } else {
          list.push(SERVICE_LABELS[key] || key);
        }
      }
    });

    return list.length > 0 ? list.join(', ') : 'Aucun';
  };

  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <div className="success-card">
      <div className="success-icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h1>CONNEXION RÉUSSIE</h1>
      <p>Merci pour votre visite ! Vos informations de contact et besoins ont été enregistrés avec succès dans nos serveurs orbitaux.</p>

      <div className="ticket-container">
        <div className="ticket-header">
          <span className="ticket-title">MOSES ART // PASS VISITEUR</span>
          <span className="ticket-id">{ticketId}</span>
        </div>

        <div className="ticket-grid">
          <div className="ticket-field">
            <label>NOM ET PRÉNOM</label>
            <span>{formData.fullName}</span>
          </div>
          <div className="ticket-field">
            <label>ORGANISATION</label>
            <span>{formData.company || 'Indépendant'}</span>
          </div>
          <div className="ticket-field">
            <label>FONCTION</label>
            <span>{formData.role}</span>
          </div>
          <div className="ticket-field">
            <label>TÉLÉPHONE</label>
            <span>{formData.phone}</span>
          </div>
          <div className="ticket-field" style={{ gridColumn: 'span 2' }}>
            <label>E-MAIL</label>
            <span>{formData.email}</span>
          </div>
          <div className="ticket-field" style={{ gridColumn: 'span 2' }}>
            <label>SERVICES RECHERCHÉS</label>
            <span>{getSelectedServices()}</span>
          </div>
        </div>
      </div>

      <div className="countdown-container">
        <span className="countdown-label">LANCEMENT DE LA COLLABORATION</span>
        <div className="countdown-timer">
          {padZero(countdown.days)}D : {padZero(countdown.hours)}H : {padZero(countdown.minutes)}M : {padZero(countdown.seconds)}S
        </div>
      </div>

      <button className="btn-secondary" style={{ marginTop: '32px' }} onClick={resetForm}>
        Enregistrer une autre visite
      </button>
    </div>
  );
}
