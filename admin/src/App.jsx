import React, { useState, useEffect } from 'react';
import mosesLogo from './assets/moses_art_logo.png';

const SERVICE_LABELS = {
  communication: 'Conseil Comm 360',
  publicite: 'Publicité',
  marketing: 'Marketing Digital',
  mobile: 'Développement App',
  design: 'Design Graphique',
  digitalisation: 'Digitalisation Services',
  audiovisuel: 'Production Audiovisuelle',
  evenementiel: 'Événementiel',
  impression: 'Impression Support',
  aucun: 'Aucun'
};

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('moses_art_admin_auth') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard states
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch registrations from Express backend
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`);
      if (!response.ok) {
        throw new Error('Erreur de communication avec le serveur.');
      }
      const data = await response.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Impossible de récupérer la liste des contacts. Assurez-vous que le serveur backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchContacts();
    }
  }, [isLoggedIn]);

  // Handle login submit
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'mosesart2026') {
      sessionStorage.setItem('moses_art_admin_auth', 'true');
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Identifiant ou mot de passe incorrect.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('moses_art_admin_auth');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Delete a contact entry
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer l'enregistrement de ${name} ?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContacts(prev => prev.filter(c => c.id !== id));
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau lors de la suppression.');
    }
  };

  // Helper to get selected service labels as text array
  const getSelectedServices = (servicesObj) => {
    if (!servicesObj || typeof servicesObj !== 'object') return [];
    return Object.entries(servicesObj)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => SERVICE_LABELS[key] || key);
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <img src={mosesLogo} alt="Agence Moses Art" className="login-logo" />
          <h2>Espace Administration</h2>
          <p>Saisissez vos identifiants pour accéder au suivi des visiteurs du stand.</p>

          {loginError && (
            <div className="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <label htmlFor="username">Identifiant</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin"
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Compute Statistics
  const totalContacts = contacts.length;
  const totalServicesCount = contacts.reduce((sum, c) => {
    const activeServices = Object.values(c.services || {}).filter(v => v === true).length;
    return sum + activeServices;
  }, 0);
  const averageServices = totalContacts > 0 ? (totalServicesCount / totalContacts).toFixed(1) : 0;

  // Main Dashboard View
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-title-section">
          <h1>Admin Dashboard</h1>
          <p>Visiteurs & Demandes — Agence Moses Art</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
          <img src={mosesLogo} alt="Agence Moses Art" className="logo-img" />
        </div>
      </header>

      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Total Visiteurs</span>
          <span className="value">{totalContacts}</span>
        </div>
        <div className="stat-card">
          <span className="label">Services demandés</span>
          <span className="value">{totalServicesCount}</span>
        </div>
        <div className="stat-card">
          <span className="label">Moyenne par contact</span>
          <span className="value">{averageServices} serv.</span>
        </div>
      </div>

      {/* Table section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#0e8588' }}>
          <strong>Chargement des données...</strong>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#e52b2b' }}>
          <p>{error}</p>
          <button
            onClick={fetchContacts}
            className="btn-website"
            style={{ marginTop: '15px', animation: 'none' }}
          >
            Actualiser
          </button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Aucun visiteur enregistré pour le moment.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Visiteur / Entreprise</th>
                <th>Coordonnées</th>
                <th>Services recherchés</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const selectedServices = getSelectedServices(contact.services);
                return (
                  <tr key={contact.id}>
                    <td>
                      <div className="client-name">{contact.fullName}</div>
                      <div className="client-meta">{contact.company} — {contact.role}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{contact.email}</div>
                      <div className="client-meta">{contact.phone}</div>
                    </td>
                    <td>
                      <div className="services-cell">
                        {selectedServices.length > 0 ? (
                          selectedServices.map((service, idx) => (
                            <span
                              key={idx}
                              className={`service-pill ${service === 'Aucun' ? 'none' : ''}`}
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="service-pill none">Aucun</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {new Date(contact.created_at).toLocaleString('fr-FR')}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {/* Details button */}
                        <button
                          className="btn-icon"
                          title="Détails"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </button>
                        {/* Delete button */}
                        <button
                          className="btn-icon delete"
                          title="Supprimer"
                          onClick={() => handleDelete(contact.id, contact.fullName)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails du Visiteur</h2>
              <button className="btn-close" onClick={() => setSelectedContact(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Nom & Prénom</label>
                  <span>{selectedContact.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>Entreprise</label>
                  <span>{selectedContact.company || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Fonction</label>
                  <span>{selectedContact.role || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Téléphone</label>
                  <span>{selectedContact.phone || '-'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Adresse E-mail</label>
                  <span>{selectedContact.email}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Services Demandés</label>
                  <div className="services-cell" style={{ marginTop: '8px', maxWidth: 'none' }}>
                    {getSelectedServices(selectedContact.services).length > 0 ? (
                      getSelectedServices(selectedContact.services).map((service, idx) => (
                        <span
                          key={idx}
                          className={`service-pill ${service === 'Aucun' ? 'none' : ''}`}
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="service-pill none">Aucun</span>
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Date de visite</label>
                  <span>{new Date(selectedContact.created_at).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
