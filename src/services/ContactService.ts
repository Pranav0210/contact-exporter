export interface Contact {
  id: string;
  name: string;
  tel: string[];
  groupId: string;
}

export const ContactService = {
  isSupported: () => {
    return 'contacts' in navigator && 'select' in (navigator as any).contacts;
  },

  selectContacts: async (): Promise<Contact[]> => {
    const props = ['name', 'tel'];
    const opts = { multiple: true };

    try {
      const contacts = await (navigator as any).contacts.select(props, opts);
      return contacts.map((c: any, index: number) => ({
        id: `contact-${Date.now()}-${index}`,
        name: c.name?.[0] || 'Unknown',
        tel: c.tel || [],
        groupId: 'unassigned'
      }));
    } catch (err) {
      console.error('Contact Picker Error:', err);
      return [];
    }
  }
};
