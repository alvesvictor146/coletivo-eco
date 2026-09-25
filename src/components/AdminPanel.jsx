import React, { useState, useEffect } from 'react';
import {
  subscribeDepartures,
  createDeparture,
  updateDeparture,
  deleteDeparture
} from '../services/departuresService';
import {
  subscribePackages,
  createPackage,
  updatePackage,
  deletePackage,
  uploadPackageImage,
  compressImage
} from '../services/packagesService';
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
  FaCheckCircle,
  FaSuitcase,
  FaUpload,
  FaSpinner
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
  // Navigation tabs: 'departures' | 'packages'
  const [activeTab, setActiveTab] = useState('departures');

  // Shared state
  const [syncStatus, setSyncStatus] = useState('conectando'); // 'conectado' | 'local'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Departures state
  const [departures, setDepartures] = useState([]);
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [editingDepartureId, setEditingDepartureId] = useState(null);
  const [departureFormData, setDepartureFormData] = useState({
    title: '',
    dates: '',
    spotsText: 'Restam apenas 4 vagas',
    statusText: 'Confirmado',
    statusColor: '#10B981',
    isUrgent: false,
    link: '',
    order: 1
  });

  // Packages state
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    title: '',
    desc: '',
    days: '4 Dias',
    price: 'R$ 1.890',
    image: '',
    order: 1,
    link: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmittingPackage, setIsSubmittingPackage] = useState(false);
  const [submittingStepText, setSubmittingStepText] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    isDeleting: false
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Carregar saídas em tempo real
  useEffect(() => {
    const unsubscribe = subscribeDepartures(
      (list, meta) => {
        setDepartures(list);
        setLoadingDepartures(false);
        if (meta?.source === 'firestore') {
          setSyncStatus('conectado');
        } else {
          setSyncStatus('local');
        }
      },
      (err) => {
        console.warn('Aviso de conexão do Firestore (saídas):', err);
        setSyncStatus('local');
      }
    );

    return () => unsubscribe();
  }, []);

  // Carregar pacotes em tempo real
  useEffect(() => {
    const unsubscribe = subscribePackages(
      (list) => {
        setPackages(list);
        setLoadingPackages(false);
      },
      (err) => {
        console.warn('Aviso de conexão do Firestore (pacotes):', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handlers para Próximas Saídas
  const openCreateDepartureModal = () => {
    setEditingDepartureId(null);
    const nextOrder = departures.length > 0 ? Math.max(...departures.map((d) => Number(d.order) || 0)) + 1 : 1;
    setDepartureFormData({
      title: '',
      dates: '',
      spotsText: 'Restam apenas 4 vagas',
      statusText: 'Confirmado',
      statusColor: '#10B981',
      isUrgent: false,
      link: '',
      order: nextOrder
    });
    setDepartureModalOpen(true);
  };

  const openEditDepartureModal = (item) => {
    setEditingDepartureId(item.id);
    setDepartureFormData({
      title: item.title || '',
      dates: item.dates || '',
      spotsText: item.spotsText || '',
      statusText: item.statusText || 'Confirmado',
      statusColor: item.statusColor || '#10B981',
      isUrgent: Boolean(item.isUrgent),
      link: item.link || '',
      order: item.order !== undefined ? Number(item.order) : 1
    });
    setDepartureModalOpen(true);
  };

  const handleGenerateDepartureLink = (destinationTitle, dates) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de garantir minha vaga para o passeio: ${destinationTitle || 'Passeio'} (${dates || 'data a combinar'}).`
    );
    return `https://wa.me/5511961781661?text=${text}`;
  };

  const handleDepartureSubmit = async (e) => {
    e.preventDefault();
    if (!departureFormData.title.trim() || !departureFormData.dates.trim()) {
      showToast('Por favor, informe ao menos o nome do destino e as datas.', 'error');
      return;
    }

    let finalLink = departureFormData.link.trim();
    if (!finalLink) {
      finalLink = handleGenerateDepartureLink(departureFormData.title, departureFormData.dates);
    }

    const payload = {
      title: departureFormData.title.trim(),
      dates: departureFormData.dates.trim(),
      spotsText: departureFormData.spotsText.trim(),
      statusText: departureFormData.statusText.trim(),
      statusColor: departureFormData.statusColor,
      isUrgent: Boolean(departureFormData.isUrgent),
      link: finalLink,
      order: Number(departureFormData.order) || 1
    };

    try {
      if (editingDepartureId) {
        await updateDeparture(editingDepartureId, payload);
        setDepartures((prev) =>
          prev
            .map((item) => (item.id === editingDepartureId ? { ...item, ...payload } : item))
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        );
        showToast('Passeio atualizado com sucesso!');
      } else {
        const result = await createDeparture({
          ...payload,
          createdAt: new Date().toISOString()
        });
        setDepartures((prev) =>
          [...prev, result.item].sort(
            (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
          )
        );
        showToast('Novo passeio cadastrado com sucesso!');
      }
      setDepartureModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar passeio:', err);
      showToast('Erro ao salvar alterações.', 'error');
    }
  };

  // DT-03: Solicitar confirmação nativa para excluir saída
  const requestDeleteDeparture = (id, title) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: 'departure',
      id,
      title,
      isDeleting: false
    });
  };

  // DT-03: Solicitar confirmação nativa para excluir pacote
  const requestDeletePackage = (id, title) => {
    setDeleteConfirmModal({
      isOpen: true,
      type: 'package',
      id,
      title,
      isDeleting: false
    });
  };

  // DT-03: Executar exclusão após confirmação no modal
  const handleConfirmDelete = async () => {
    const { type, id, title } = deleteConfirmModal;
    if (!id || !type) return;

    setDeleteConfirmModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      if (type === 'departure') {
        await deleteDeparture(id);
        setDepartures((prev) => prev.filter((item) => item.id !== id));
        showToast(`Passeio "${title}" excluído com sucesso!`);
      } else if (type === 'package') {
        await deletePackage(id);
        setPackages((prev) => prev.filter((item) => item.id !== id));
        showToast(`Pacote "${title}" excluído com sucesso!`);
      }
    } catch (err) {
      console.error(`Erro ao excluir ${type}:`, err);
      showToast('Erro ao excluir o item.', 'error');
    } finally {
      setDeleteConfirmModal({
        isOpen: false,
        type: null,
        id: null,
        title: '',
        isDeleting: false
      });
    }
  };

  // Handlers para Pacotes Exclusivos
  const openCreatePackageModal = () => {
    setEditingPackageId(null);
    setImageFile(null);
    setImagePreview('');
    const nextOrder = packages.length > 0 ? Math.max(...packages.map((p) => Number(p.order) || 0)) + 1 : 1;
    setPackageFormData({
      title: '',
      desc: '',
      days: '4 Dias',
      price: 'R$ 1.890',
      image: 'images/chapada_guimaraes_1783969294083.png',
      order: nextOrder,
      link: ''
    });
    setPackageModalOpen(true);
  };

  const openEditPackageModal = (item) => {
    setEditingPackageId(item.id);
    setImageFile(null);
    setImagePreview(item.image || '');
    setPackageFormData({
      title: item.title || '',
      desc: item.desc || '',
      days: item.days || '4 Dias',
      price: item.price || 'R$ 1.890',
      image: item.image || '',
      order: item.order !== undefined ? Number(item.order) : 1,
      link: item.link || ''
    });
    setPackageModalOpen(true);
  };

  const handleGeneratePackageLink = (title) => {
    const text = encodeURIComponent(`Olá! Gostaria de saber mais sobre o pacote para ${title || 'Mato Grosso'}.`);
    return `https://wa.me/5511961781661?text=${text}`;
  };

  // DT-02: Validação estrita de tipo (MIME) e tamanho (máx. 10MB)
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      showToast('Formato não suportado. Utilize imagens JPG, PNG ou WEBP.', 'error');
      e.target.value = '';
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      showToast('A imagem excede o tamanho máximo de 10MB.', 'error');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // DT-08: Permitir desmarcar o arquivo selecionado
  const handleClearImageFile = () => {
    setImageFile(null);
    setImagePreview(packageFormData.image || '');
    const fileInput = document.getElementById('pkg-file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    if (!packageFormData.title.trim()) {
      showToast('Por favor, informe o título do pacote.', 'error');
      return;
    }

    setIsSubmittingPackage(true);

    try {
      let finalImageUrl = packageFormData.image;

      // Se o usuário selecionou uma nova imagem pelo input de arquivo
      if (imageFile) {
        setSubmittingStepText('Enviando e otimizando imagem...');
        try {
          finalImageUrl = await uploadPackageImage(imageFile);
        } catch (uploadErr) {
          console.warn('Erro no upload de imagem:', uploadErr);
          showToast('Aviso: Falha no upload para nuvem, mantendo imagem anterior.', 'error');
        }
      }

      setSubmittingStepText('Salvando pacote...');

      let finalLink = packageFormData.link.trim();
      if (!finalLink) {
        finalLink = handleGeneratePackageLink(packageFormData.title);
      }

      const payload = {
        title: packageFormData.title.trim(),
        desc: packageFormData.desc.trim(),
        days: packageFormData.days.trim(),
        price: packageFormData.price.trim(),
        image: finalImageUrl,
        order: Number(packageFormData.order) || 1,
        link: finalLink
      };

      if (editingPackageId) {
        // Atualização imediata na interface
        setPackages((prev) =>
          prev
            .map((item) => (item.id === editingPackageId ? { ...item, ...payload } : item))
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
        );
        await updatePackage(editingPackageId, payload);
        showToast('Pacote atualizado com sucesso!');
      } else {
        const result = await createPackage({
          ...payload,
          createdAt: new Date().toISOString()
        });
        setPackages((prev) =>
          [...prev, result.item].sort(
            (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
          )
        );
        showToast('Novo pacote cadastrado com sucesso!');
      }
      setPackageModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar pacote:', err);
      showToast('Erro ao salvar alterações no pacote.', 'error');
    } finally {
      setIsSubmittingPackage(false);
      setSubmittingStepText('');
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

        {/* Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'departures' ? 'active' : ''}`}
            onClick={() => setActiveTab('departures')}
          >
            <FaCalendarAlt /> Próximas Saídas ({departures.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <FaSuitcase /> Pacotes Exclusivos ({packages.length})
          </button>
        </div>

        {/* TAB 1: PRÓXIMAS SAÍDAS */}
        {activeTab === 'departures' && (
          <div>
            <div className="admin-header-row">
              <div>
                <h1>Gerenciamento de Próximas Saídas</h1>
                <p>Edite datas, nomes de destinos, vagas e status dos passeios exibidos no site.</p>
              </div>
              <button
                type="button"
                className="btn-admin-action btn-admin-success"
                onClick={openCreateDepartureModal}
              >
                <FaPlus /> Adicionar Novo Passeio
              </button>
            </div>

            {loadingDepartures ? (
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
                        onClick={() => openEditDepartureModal(item)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        type="button"
                        className="btn-card-delete"
                        onClick={() => requestDeleteDeparture(item.id, item.title)}
                      >
                        <FaTrash /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PACOTES EXCLUSIVOS */}
        {activeTab === 'packages' && (
          <div>
            <div className="admin-header-row">
              <div>
                <h1>Gerenciamento de Pacotes Exclusivos</h1>
                <p>Edite fotos, textos, durações, preços e links de WhatsApp de cada pacote.</p>
              </div>
              <button
                type="button"
                className="btn-admin-action btn-admin-success"
                onClick={openCreatePackageModal}
              >
                <FaPlus /> Adicionar Novo Pacote
              </button>
            </div>

            {loadingPackages ? (
              <div className="empty-state">
                <h3>Carregando pacotes...</h3>
                <p>Aguarde um instante.</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhum pacote cadastrado</h3>
                <p>Clique no botão acima para adicionar o primeiro pacote exclusivo!</p>
              </div>
            ) : (
              <div className="packages-admin-grid">
                {packages.map((pkg, index) => (
                  <div key={pkg.id || index} className="package-admin-card">
                    <div className="package-card-img-wrapper">
                      <img src={pkg.image} alt={pkg.title} />
                      <span className="package-badge-order">Posição #{pkg.order || index + 1}</span>
                    </div>

                    <div className="package-admin-info">
                      <div className="package-meta-row">
                        <span className="package-days-badge">{pkg.days}</span>
                        <span className="package-price-tag">A partir de <strong>{pkg.price}</strong></span>
                      </div>

                      <h3>{pkg.title}</h3>
                      <p className="package-desc-snippet">{pkg.desc}</p>

                      {pkg.link && (
                        <small className="card-link-preview">
                          <FaWhatsapp style={{ color: '#25D366', marginRight: '4px' }} />
                          WhatsApp configurado
                        </small>
                      )}
                    </div>

                    <div className="card-actions-bar">
                      <button
                        type="button"
                        className="btn-card-edit"
                        onClick={() => openEditPackageModal(pkg)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        type="button"
                        className="btn-card-delete"
                        onClick={() => requestDeletePackage(pkg.id, pkg.title)}
                      >
                        <FaTrash /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Adicionar / Editar Saída */}
      {departureModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setDepartureModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingDepartureId ? 'Editar Passeio' : 'Novo Passeio'}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDepartureModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDepartureSubmit}>
              <div className="admin-modal-body">
                <div className="form-group-admin">
                  <label htmlFor="dep-title">Nome do Destino / Título *</label>
                  <input
                    id="dep-title"
                    type="text"
                    required
                    placeholder="Ex: Chapada dos Guimarães"
                    value={departureFormData.title}
                    onChange={(e) => setDepartureFormData({ ...departureFormData, title: e.target.value })}
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
                      value={departureFormData.dates}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, dates: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="dep-spots">Texto de Vagas</label>
                    <input
                      id="dep-spots"
                      type="text"
                      placeholder="Ex: Restam apenas 4 vagas"
                      value={departureFormData.spotsText}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, spotsText: e.target.value })}
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
                      value={departureFormData.statusText}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, statusText: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="dep-order">Ordem de Exibição</label>
                    <input
                      id="dep-order"
                      type="number"
                      min="1"
                      value={departureFormData.order}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, order: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-admin">
                  <label>Cor do Status</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={departureFormData.statusColor}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, statusColor: e.target.value })}
                      style={{ width: '48px', height: '38px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    />
                    <input
                      type="text"
                      value={departureFormData.statusColor}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, statusColor: e.target.value })}
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
                        onClick={() => setDepartureFormData({ ...departureFormData, statusColor: c.value })}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group-admin">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={departureFormData.isUrgent}
                      onChange={(e) => setDepartureFormData({ ...departureFormData, isUrgent: e.target.checked })}
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
                        const link = handleGenerateDepartureLink(departureFormData.title, departureFormData.dates);
                        setDepartureFormData({ ...departureFormData, link });
                      }}
                    >
                      Gerar Link Automático
                    </button>
                  </div>
                  <input
                    id="dep-link"
                    type="text"
                    placeholder="https://wa.me/5511961781661?text=..."
                    value={departureFormData.link}
                    onChange={(e) => setDepartureFormData({ ...departureFormData, link: e.target.value })}
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
                  onClick={() => setDepartureModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-admin-action btn-admin-success">
                  <FaCheck /> {editingDepartureId ? 'Salvar Alterações' : 'Cadastrar Saída'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar / Editar Pacote */}
      {packageModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setPackageModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingPackageId ? 'Editar Pacote Exclusivo' : 'Novo Pacote Exclusivo'}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPackageModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handlePackageSubmit}>
              <div className="admin-modal-body">
                <div className="form-group-admin">
                  <label htmlFor="pkg-title">Título do Destino *</label>
                  <input
                    id="pkg-title"
                    type="text"
                    required
                    placeholder="Ex: Chapada dos Guimarães"
                    value={packageFormData.title}
                    onChange={(e) => setPackageFormData({ ...packageFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-group-admin">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="pkg-desc">Descrição do Pacote *</label>
                    <span style={{ fontSize: '0.78rem', color: packageFormData.desc.length > 250 ? '#e63946' : '#64748b' }}>
                      {packageFormData.desc.length} caracteres
                    </span>
                  </div>
                  <textarea
                    id="pkg-desc"
                    rows="3"
                    required
                    placeholder="Descreva as principais atrações e experiências deste pacote..."
                    value={packageFormData.desc}
                    onChange={(e) => setPackageFormData({ ...packageFormData, desc: e.target.value })}
                  />
                  <small style={{ color: '#64748b' }}>
                    Recomendado: 80 a 160 caracteres para melhor equilíbrio nos cards do site.
                  </small>
                </div>

                <div className="form-row-2">
                  <div className="form-group-admin">
                    <label htmlFor="pkg-days">Duração</label>
                    <input
                      id="pkg-days"
                      type="text"
                      placeholder="Ex: 4 Dias"
                      value={packageFormData.days}
                      onChange={(e) => setPackageFormData({ ...packageFormData, days: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="pkg-price">Preço</label>
                    <input
                      id="pkg-price"
                      type="text"
                      placeholder="Ex: R$ 1.890"
                      value={packageFormData.price}
                      onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group-admin">
                    <label htmlFor="pkg-order">Ordem de Exibição</label>
                    <input
                      id="pkg-order"
                      type="number"
                      min="1"
                      value={packageFormData.order}
                      onChange={(e) => setPackageFormData({ ...packageFormData, order: e.target.value })}
                    />
                  </div>

                  <div className="form-group-admin">
                    <label htmlFor="pkg-image-url">URL da Imagem (Externa ou Local)</label>
                    <input
                      id="pkg-image-url"
                      type="text"
                      placeholder="images/exemplo.png ou https://..."
                      value={packageFormData.image}
                      onChange={(e) => {
                        setPackageFormData({ ...packageFormData, image: e.target.value });
                        if (!imageFile) {
                          setImagePreview(e.target.value);
                        }
                      }}
                    />
                    <small style={{ color: imageFile ? '#b45309' : '#64748b' }}>
                      {imageFile ? '⚠️ O arquivo do computador selecionado abaixo terá prioridade.' : 'Usado caso nenhum arquivo seja enviado pelo botão abaixo.'}
                    </small>
                  </div>
                </div>

                {/* Upload e Preview de Imagem com DT-02 e DT-08 */}
                <div className="form-group-admin">
                  <label>Foto do Pacote</label>
                  <div className="image-upload-box">
                    <input
                      type="file"
                      id="pkg-file-upload"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={handleImageFileChange}
                    />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <label htmlFor="pkg-file-upload" className="btn-upload-label">
                        <FaUpload /> {imageFile ? 'Trocar Foto Selecionada' : 'Escolher Foto do Computador'}
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          className="btn-admin-action btn-admin-secondary"
                          style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#b91c1c', borderColor: '#fca5a5', background: '#fef2f2' }}
                          onClick={handleClearImageFile}
                        >
                          <FaTimes /> Desmarcar Arquivo
                        </button>
                      )}
                    </div>
                    <small style={{ color: '#64748b', display: 'block', marginTop: '8px' }}>
                      Formatos suportados: PNG, JPG, JPEG, WEBP (máx. 10MB). Compressão automática progressiva.
                    </small>
                  </div>

                  {imagePreview && (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Pré-visualização" className="image-preview-thumb" />
                      <div className="image-preview-info">
                        <strong>Foto {imageFile ? 'Nova (Upload Pendente)' : 'Atual do Pacote'}</strong>
                        <span>{imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)` : 'Imagem vinculada ao registro'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group-admin">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="pkg-link">Link do WhatsApp</label>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      onClick={() => {
                        const link = handleGeneratePackageLink(packageFormData.title);
                        setPackageFormData({ ...packageFormData, link });
                      }}
                    >
                      Gerar Link Automático
                    </button>
                  </div>
                  <input
                    id="pkg-link"
                    type="text"
                    placeholder="https://wa.me/5511961781661?text=..."
                    value={packageFormData.link}
                    onChange={(e) => setPackageFormData({ ...packageFormData, link: e.target.value })}
                  />
                  <small style={{ color: '#64748b' }}>
                    Deixe em branco para usar o link padrão com o nome do pacote.
                  </small>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-admin-action btn-admin-secondary"
                  style={{ color: '#334155', borderColor: '#cbd5e1' }}
                  onClick={() => setPackageModalOpen(false)}
                  disabled={isSubmittingPackage}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-admin-action btn-admin-success"
                  disabled={isSubmittingPackage}
                >
                  {isSubmittingPackage ? (
                    <>
                      <FaSpinner className="spin-icon" /> {submittingStepText || 'Salvando...'}
                    </>
                  ) : (
                    <>
                      <FaCheck /> {editingPackageId ? 'Salvar Alterações' : 'Cadastrar Pacote'}
                    </>
                  )}
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

      {/* DT-03: Modal de Confirmação de Exclusão Nativo do Design System */}
      {deleteConfirmModal.isOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() =>
            !deleteConfirmModal.isDeleting &&
            setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '', isDeleting: false })
          }
        >
          <div className="admin-modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header" style={{ borderBottomColor: 'rgba(230, 57, 70, 0.2)' }}>
              <h2 style={{ color: '#e63946', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaTrash /> Confirmar Exclusão
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                disabled={deleteConfirmModal.isDeleting}
                onClick={() =>
                  setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '', isDeleting: false })
                }
              >
                <FaTimes />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Tem certeza que deseja excluir {deleteConfirmModal.type === 'package' ? 'o pacote' : 'a saída'}{' '}
                <strong>"{deleteConfirmModal.title}"</strong>?
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>
                Esta ação removerá o registro do site imediatamente e não poderá ser desfeita.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn-admin-action btn-admin-secondary"
                disabled={deleteConfirmModal.isDeleting}
                onClick={() =>
                  setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '', isDeleting: false })
                }
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-admin-action btn-admin-danger"
                disabled={deleteConfirmModal.isDeleting}
                onClick={handleConfirmDelete}
                style={{ background: '#e63946', color: '#ffffff' }}
              >
                {deleteConfirmModal.isDeleting ? (
                  <>
                    <FaSpinner className="spin-icon" /> Excluindo...
                  </>
                ) : (
                  <>
                    <FaTrash /> Excluir Definitivamente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
