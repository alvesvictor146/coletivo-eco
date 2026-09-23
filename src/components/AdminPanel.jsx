import React, { useState, useEffect } from 'react';
import {
  subscribeDepartures,
  createDeparture,
  updateDeparture,
  deleteDeparture
} from '../services/departuresService';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaCircle,
  FaCheck,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaKey,
  FaTimes,
  FaWhatsapp,
  FaCloud,
  FaCheckCircle
} from 'react-icons/fa';
import './AdminPanel.css';

const PRESET_COLORS = [
  { name: 'Verde Sucesso', value: '#10B981' },
  { name: 'Vermelho Urgência', value: '#e63946' },
  { name: 'Dourado Alerta', value: '#c3b01e' },
  { name: 'Azul Turquesa', value: '#2dd4bf' },
  { name: 'Azul Oceano', value: '#172a4f' }
];

const AdminPanel = ({ onLogout, onGoToSite }) => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('conectando'); // 'conectado' | 'local'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    dates: '',
    spotsText: 'Restam apenas 4 vagas',
    statusText: 'Confirmado',
    statusColor: '#10B981',
    isUrgent: false,
    link: '',
    order: 1
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Carregar passeios em tempo real com fallback automático
  useEffect(() => {
    const unsubscribe = subscribeDepartures(
      (list, meta) => {
        setDepartures(list);
        setLoading(false);
        if (meta?.source === 'firestore') {
          setSyncStatus('conectado');
        } else {
          setSyncStatus('local');
        }
      },
      (err) => {
        console.warn('Aviso de conexão do Firestore:', err);
        setSyncStatus('local');
      }
    );

    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    const nextOrder = departures.length > 0 ? Math.max(...departures.map((d) => Number(d.order) || 0)) + 1 : 1;
    setFormData({
      title: '',
      dates: '',
      spotsText: 'Restam apenas 4 vagas',
      statusText: 'Confirmado',
      statusColor: '#10B981',
      isUrgent: false,
      link: '',
      order: nextOrder
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      dates: item.dates || '',
      spotsText: item.spotsText || '',
      statusText: item.statusText || 'Confirmado',
      statusColor: item.statusColor || '#10B981',
      isUrgent: Boolean(item.isUrgent),
      link: item.link || '',
      order: item.order !== undefined ? Number(item.order) : 1
    });
    setModalOpen(true);
  };

  const handleGenerateLink = (destinationTitle, dates) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de garantir minha vaga para o passeio: ${destinationTitle || 'Passeio'} (${dates || 'data a combinar'}).`
    );
    return `https://wa.me/5511953823911?text=${text}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dates.trim()) {
      showToast('Por favor, informe ao menos o nome do destino e as datas.', 'error');
      return;
    }

    let finalLink = formData.link.trim();
    if (!finalLink) {
      finalLink = handleGenerateLink(formData.title, formData.dates);
    }

    const payload = {
      title: formData.title.trim(),
      dates: formData.dates.trim(),
      spotsText: formData.spotsText.trim(),
      statusText: formData.statusText.trim(),
      statusColor: formData.statusColor,
      isUrgent: Boolean(formData.isUrgent),
      link: finalLink,
      order: Number(formData.order) || 1
    };

    try {
      if (editingId) {
        // Atualizar
        await updateDeparture(editingId, payload);
        // Atualização otimista imediata na UI
        setDepartures((prev) =>
          prev
            .map((item) => (item.id === editingId ? { ...item, ...payload } : item))
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        );
        showToast('Passeio atualizado com sucesso!');
      } else {
        // Criar novo
        const result = await createDeparture({
          ...payload,
          createdAt: new Date().toISOString()
        });
        // Inserção otimista imediata na UI
        setDepartures((prev) =>
          [...prev, result.item].sort(
            (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
          )
        );
        showToast('Novo passeio cadastrado com sucesso!');
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar passeio:', err);
      showToast('Erro ao salvar alterações.', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Tem certeza que deseja excluir o passeio "${title}"?`)) {
      try {
        await deleteDeparture(id);
        // Remoção otimista imediata na UI
        setDepartures((prev) => prev.filter((item) => item.id !== id));
        showToast(`Passeio "${title}" excluído com sucesso!`);
      } catch (err) {
        console.error('Erro ao excluir:', err);
        showToast('Erro ao excluir o passeio.', 'error');
      }
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Digite uma senha válida.', 'error');
      return;
    }
    localStorage.setItem('coletivo_custom_pass', newPassword.trim());
    setPasswordModalOpen(false);
    setNewPassword('');
    showToast('Senha de administrador alterada com sucesso!');
  };

  return (
    <div className="admin-panel-container">
      {/* Top Navbar */}
      <header className="admin-top-bar">
        <div className="admin-brand">
          <img src="images/logo.png" alt="Coletivo Eco Logo" className="admin-brand-logo" />
          <div className="admin-brand-title">
            <h2>Coletivo Eco</h2>
            <span>Painel Administrativo</span>
          </div>
        </div>

        <div className="admin-top-actions">
          {syncStatus === 'conectado' ? (
            <span
              style={{
                fontSize: '0.8rem',
                color: '#10B981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '6px 12px',
                borderRadius: '20px'
              }}
              title="Banco de dados Firestore conectado e sincronizado"
            >
              <FaCheckCircle /> Firestore Conectado
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.8rem',
                color: '#c3b01e',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(195, 176, 30, 0.15)',
                padding: '6px 12px',
                borderRadius: '20px'
              }}
              title="Modo persistente ativo com cache local"
            >
              <FaCloud /> Sincronizado Localmente
            </span>
          )}

          <button
            type="button"
            className="btn-admin-action btn-admin-secondary"
            onClick={() => setPasswordModalOpen(true)}
            title="Alterar Senha do Admin"
          >
            <FaKey /> Senha
          </button>
          <button
            type="button"
            className="btn-admin-action btn-admin-secondary"
            onClick={onGoToSite}
            title="Visualizar Site Público"
          >
            <FaExternalLinkAlt /> Ver Site
          </button>
          <button
            type="button"
            className="btn-admin-action btn-admin-danger"
            onClick={onLogout}
            title="Sair do Painel"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-content">
        {toast.show && (
          <div className={`admin-toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="admin-header-row">
          <div>
            <h1>Gerenciamento de Próximas Saídas</h1>
            <p>Edite datas, nomes de destinos, vagas e status dos passeios exibidos no site.</p>
          </div>
          <button
            type="button"
            className="btn-admin-action btn-admin-success"
            onClick={openCreateModal}
          >
            <FaPlus /> Adicionar Novo Passeio
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Carregando saídas...</h3>
            <p>Aguarde um instante.</p>
          </div>
        ) : departures.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum passeio cadastrado</h3>
            <p>Clique no botão acima para adicionar a primeira saída para os clientes!</p>
          </div>
        ) : (
          <div className="departures-admin-grid">
            {departures.map((item, index) => (
              <div key={item.id} className="departure-admin-card">
                <div className="card-top-status">
                  <span className="badge-order">Posição #{item.order || index + 1}</span>
                  <div className={`admin-badge-status ${item.isUrgent ? 'urgent' : ''}`}>
                    <FaCircle style={{ color: item.statusColor || '#10B981', fontSize: '0.65rem' }} />
                    <span>{item.statusText || 'Confirmado'}</span>
                  </div>
                </div>

                <div className="card-main-info">
                  <h3>{item.title}</h3>
                  <div className="card-dates-row">
                    <FaCalendarAlt style={{ color: '#10b981' }} />
                    <span>{item.dates}</span>
                  </div>

                  <div className="card-badges-row">
                    <span className="admin-badge-spots">{item.spotsText}</span>
                    {item.isUrgent && (
                      <span className="admin-badge-spots" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                        Alerta de Urgência Ativo
                      </span>
                    )}
                  </div>

                  {item.link && (
                    <small className="card-link-preview">
                      <FaWhatsapp style={{ color: '#25D366', marginRight: '4px' }} />
                      Link WhatsApp configurado
                    </small>
                  )}
                </div>

                <div className="card-actions-bar">
                  <button
                    type="button"
                    className="btn-card-edit"
                    onClick={() => openEditModal(item)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    type="button"
                    className="btn-card-delete"
                    onClick={() => handleDelete(item.id, item.title)}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Adicionar / Editar */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Editar Passeio' : 'Novo Passeio'}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="form-group-admin">
                  <label htmlFor="dep-title">Nome do Destino / Título *</label>
                  <input
                    id="dep-title"
                    type="text"
                    required
                    placeholder="Ex: Chapada dos Guimarães"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group-admin">
                    <label htmlFor="dep-dates">Datas do Passeio *</label>
                    <input
                      id="dep-dates"
                      type="text"
                      required
                      placeholder="Ex: 15 a 18 de Julho"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="dep-spots">Texto de Vagas</label>
                    <input
                      id="dep-spots"
                      type="text"
                      placeholder="Ex: Restam apenas 4 vagas"
                      value={formData.spotsText}
                      onChange={(e) => setFormData({ ...formData, spotsText: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group-admin">
                    <label htmlFor="dep-status">Texto do Status</label>
                    <input
                      id="dep-status"
                      type="text"
                      placeholder="Ex: Confirmado ou Últimas vagas!"
                      value={formData.statusText}
                      onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="dep-order">Ordem de Exibição</label>
                    <input
                      id="dep-order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-admin">
                  <label>Cor do Status</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={formData.statusColor}
                      onChange={(e) => setFormData({ ...formData, statusColor: e.target.value })}
                      style={{ width: '48px', height: '38px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    />
                    <input
                      type="text"
                      value={formData.statusColor}
                      onChange={(e) => setFormData({ ...formData, statusColor: e.target.value })}
                      placeholder="#10B981"
                      style={{ maxWidth: '120px' }}
                    />
                  </div>
                  <div className="color-presets-row">
                    <small style={{ color: '#64748b' }}>Cores rápidas:</small>
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className="color-circle-btn"
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                        onClick={() => setFormData({ ...formData, statusColor: c.value })}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group-admin">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    />
                    <span>Destacar com alerta de urgência (ponto pulsante vermelho)</span>
                  </label>
                </div>

                <div className="form-group-admin">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="dep-link">Link do WhatsApp</label>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      onClick={() => {
                        const link = handleGenerateLink(formData.title, formData.dates);
                        setFormData({ ...formData, link });
                      }}
                    >
                      Gerar Link Automático
                    </button>
                  </div>
                  <input
                    id="dep-link"
                    type="text"
                    placeholder="https://wa.me/5511953823911?text=..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                  <small style={{ color: '#64748b' }}>
                    Se deixar em branco, um link com o nome e data será gerado automaticamente.
                  </small>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-action btn-admin-secondary"
                  style={{ color: '#334155', borderColor: '#cbd5e1' }}
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-admin-action btn-admin-success">
                  <FaCheck /> {editingId ? 'Salvar Alterações' : 'Cadastrar Saída'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alterar Senha */}
      {passwordModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setPasswordModalOpen(false)}>
          <div className="admin-modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Alterar Senha do Admin</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPasswordModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSavePassword}>
              <div className="admin-modal-body">
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Defina uma nova senha para acessar o painel administrativo.
                </p>
                <div className="form-group-admin">
                  <label htmlFor="new-pass-input">Nova Senha</label>
                  <input
                    id="new-pass-input"
                    type="text"
                    required
                    placeholder="Digite a nova senha..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-action btn-admin-secondary"
                  style={{ color: '#334155', borderColor: '#cbd5e1' }}
                  onClick={() => setPasswordModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-admin-action btn-admin-success">
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
