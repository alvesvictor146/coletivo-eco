import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import './AdminLogin.css';

const DEFAULT_ADMIN_PASSWORD = 'eco2026';

const AdminLogin = ({ onLoginSuccess, onBackToHome }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedCustomPass = localStorage.getItem('coletivo_custom_pass');
    const validPassword = storedCustomPass || DEFAULT_ADMIN_PASSWORD;

    if (password === validPassword) {
      sessionStorage.setItem('coletivo_admin_auth', 'true');
      setError('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="images/logo.png" alt="Coletivo Eco Logo" />
        </div>

        <span className="admin-login-badge">Área Restrita</span>
        <h1>Painel Admin</h1>
        <p className="admin-login-subtitle">
          Gerencie as próximas saídas e informações de passeios do Coletivo Eco.
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group-login">
            <label htmlFor="admin-password">Senha de Acesso</label>
            <div className="password-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Digite a senha..."
                autoFocus
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div className="login-error-msg">{error}</div>}

          <button type="submit" className="admin-btn-submit">
            <FaLock /> Acessar Painel
          </button>
        </form>

        <div className="admin-login-footer">
          <button type="button" className="btn-back-home" onClick={onBackToHome}>
            <FaArrowLeft /> Voltar para o site
          </button>
          <span className="default-hint">Dica de primeiro acesso: senha padrão: <strong>eco2026</strong></span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
