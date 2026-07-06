import React from 'react';

export default function FormStep1({ formData, errors, handleChange }) {
  return (
    <div className="form-body">
      <div className="form-meta">
        <h2>01 / INFORMATIONS GÉNÉRALES</h2>
        <h1>Votre Profil</h1>
        <p>Merci de votre visite sur notre stand ! Veuillez renseigner vos informations pour établir la connexion.</p>
      </div>

      <div className="form-grid">
        <div className="input-wrapper form-grid-full">
          <label htmlFor="fullName">Nom et prénom</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Ex: Thomas Pesquet"
            value={formData.fullName || ''}
            onChange={handleChange}
            required
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="input-wrapper">
          <label htmlFor="company">Entreprise / Organisation</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Ex: Moses Art Agency"
            value={formData.company || ''}
            onChange={handleChange}
            required
          />
          {errors.company && <span className="error-text">{errors.company}</span>}
        </div>

        <div className="input-wrapper">
          <label htmlFor="role">Fonction</label>
          <input
            type="text"
            id="role"
            name="role"
            placeholder="Ex: Directeur Artistique"
            value={formData.role || ''}
            onChange={handleChange}
            required
          />
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        <div className="input-wrapper">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Ex: +33 6 12 34 56 78"
            value={formData.phone || ''}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="input-wrapper">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ex: contact@mosesart.agency"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>
    </div>
  );
}
