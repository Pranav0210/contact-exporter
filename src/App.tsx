import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, FileDown, Search, Trash2, Globe } from 'lucide-react';
import { useApp } from './context/AppContext';
import { ContactService } from './services/ContactService';
import { PdfExportService } from './services/PdfExportService';
import './i18n';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { contacts, groups, addContacts, removeContact, moveContact, createGroup, deleteGroup, loadDummyData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectContacts = async () => {
    const selected = await ContactService.selectContacts();
    if (selected.length > 0) {
      addContacts(selected);
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const handleExport = async () => {
    setIsExporting(true);
    await PdfExportService.exportToPdf('print-view', 'wedding-invite-list.pdf');
    setIsExporting(false);
  };

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      {/* Hidden Print View for PDF generation */}
      <div id="print-view" style={{ display: 'none', padding: '40px', background: 'white', color: 'black' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #800000', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{t('common.appName')}</h1>
          <p style={{ fontSize: '16px', color: '#666' }}>{new Date().toLocaleDateString()}</p>
        </div>
        
        {groups.map(group => {
          const groupContacts = contacts.filter(c => c.groupId === group.id);
          if (groupContacts.length === 0) return null;
          
          return (
            <div key={group.id} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', borderBottom: '1px solid #d4af37', paddingBottom: '5px', marginBottom: '15px' }}>
                {group.id === 'unassigned' ? t('groups.unassigned') : group.name}
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9' }}>
                    <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #eee' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '10px', border: '1px solid #eee' }}>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {groupContacts.map(contact => (
                    <tr key={contact.id}>
                      <td style={{ padding: '10px', border: '1px solid #eee' }}>{contact.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #eee' }}>{contact.tel[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <header style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('common.appName')}</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={loadDummyData}
              className="btn"
              style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#eee' }}
            >
              Dummy Data
            </button>
            <button onClick={toggleLanguage} className="btn" style={{ padding: '8px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--primary)' }}>
              <Globe size={20} />
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('home.subtitle')}</p>
      </header>

      {/* Search Bar */}
      <div className="card glass" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder={t('common.search')} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem' }}
        />
      </div>

      {/* Main Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleSelectContacts}
          className="btn btn-primary"
          id="tour-select-contacts"
        >
          <Plus size={20} />
          {t('home.selectContacts')}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddGroup(true)}
          className="btn btn-secondary"
          id="tour-create-group"
        >
          <Users size={20} />
          {t('groups.createGroup')}
        </motion.button>
      </div>

      {/* Group List */}
      <div style={{ flex: 1 }}>
        <AnimatePresence>
          {groups.map(group => (
            <div key={group.id} className="card" style={{ marginBottom: '16px', padding: '0' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{group.id === 'unassigned' ? t('groups.unassigned') : group.name}</h3>
                {group.id !== 'unassigned' && (
                  <button onClick={() => deleteGroup(group.id)} style={{ color: 'var(--accent)', background: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div style={{ padding: '8px' }}>
                {contacts.filter(c => c.groupId === group.id && c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                  <p style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('home.noContacts')}</p>
                ) : (
                  contacts.filter(c => c.groupId === group.id && c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(contact => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={contact.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px', 
                        borderBottom: '1px solid #f0f0f0',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600' }}>{contact.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{contact.tel[0]}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select 
                          value={contact.groupId} 
                          onChange={(e) => moveContact(contact.id, e.target.value)}
                          style={{ border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.8rem', padding: '4px' }}
                        >
                          {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.id === 'unassigned' ? t('groups.unassigned') : g.name}</option>
                          ))}
                        </select>
                        <button onClick={() => removeContact(contact.id)} style={{ color: 'var(--text-muted)', background: 'none' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Export Button (Sticky) */}
      <div className="sticky-footer glass">
        <button 
          disabled={isExporting}
          onClick={handleExport}
          className="btn btn-primary" 
          style={{ width: '100%', gap: '12px', opacity: isExporting ? 0.7 : 1 }} 
          id="tour-export-pdf"
        >
          <FileDown size={24} />
          {isExporting ? t('export.preparing') : t('common.export')}
        </button>
      </div>

      {/* Add Group Modal */}
      {showAddGroup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: '300px' }}>
            <h3>{t('groups.createGroup')}</h3>
            <input 
              autoFocus
              type="text" 
              placeholder={t('groups.groupName')}
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{ width: '100%', padding: '12px', margin: '16px 0', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAddGroup(false)} className="btn" style={{ flex: 1, background: '#eee' }}>{t('common.cancel')}</button>
              <button 
                onClick={() => {
                  if (newGroupName) {
                    createGroup(newGroupName);
                    setNewGroupName('');
                    setShowAddGroup(false);
                  }
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {t('common.add')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default App;
