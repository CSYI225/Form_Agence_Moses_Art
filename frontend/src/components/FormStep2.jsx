import React from 'react';

const SERVICES = [
  { id: 'communication', label: 'Conseil de communication 360' },
  { id: 'publicite', label: 'Publicité' },
  { id: 'marketing', label: 'Marketing digital' },
  { id: 'mobile', label: 'Développement d’Application mobile' },
  { id: 'design', label: 'Design graphique' },
  { id: 'digitalisation', label: 'Digitalisation des services' },
  { id: 'audiovisuel', label: 'Production audiovisuelle' },
  { id: 'evenementiel', label: 'Événementiel' },
  { id: 'impression', label: 'Impression sur tout support' },
  { id: 'aucun', label: 'Aucun' },
];

export default function FormStep2({ formData, errors, handleServiceToggle }) {
  return (
    <div className="form-body">
      <div className="form-meta">
        <h2>02 / SERVICES RECHERCHÉS</h2>
        <h1>Vos Besoins</h1>
        <p>Sélectionnez les services et expertises que vous recherchez pour votre projet.</p>
      </div>

      <div className="form-grid">
        <div className="services-grid">
          {SERVICES.map((service) => {
            const isSelected = formData.services?.[service.id] || false;
            return (
              <label
                key={service.id}
                className={`service-card ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleServiceToggle(service.id)}
                />
                <span>{service.label}</span>
              </label>
            );
          })}
        </div>

        {errors.services && (
          <span className="error-text form-grid-full" style={{ marginTop: '8px' }}>
            {errors.services}
          </span>
        )}
      </div>
    </div>
  );
}

