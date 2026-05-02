import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Contact } from '../services/ContactService';

export interface Group {
  id: string;
  name: string;
}

interface AppContextType {
  contacts: Contact[];
  groups: Group[];
  addContacts: (newContacts: Contact[]) => void;
  removeContact: (id: string) => void;
  createGroup: (name: string) => void;
  deleteGroup: (id: string) => void;
  moveContact: (contactId: string, groupId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('groups');
    return saved ? JSON.parse(saved) : [{ id: 'unassigned', name: 'Unassigned' }];
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const addContacts = (newContacts: Contact[]) => {
    setContacts(prev => {
      // Filter out duplicates by phone number if needed, but for now just add
      return [...prev, ...newContacts];
    });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const createGroup = (name: string) => {
    const newGroup = { id: `group-${Date.now()}`, name };
    setGroups(prev => [...prev, newGroup]);
  };

  const deleteGroup = (id: string) => {
    if (id === 'unassigned') return;
    setGroups(prev => prev.filter(g => g.id !== id));
    setContacts(prev => prev.map(c => c.groupId === id ? { ...c, groupId: 'unassigned' } : c));
  };

  const moveContact = (contactId: string, groupId: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, groupId } : c));
  };

  return (
    <AppContext.Provider value={{ contacts, groups, addContacts, removeContact, createGroup, deleteGroup, moveContact }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
