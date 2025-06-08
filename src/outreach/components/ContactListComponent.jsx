import React, { useState, useMemo } from 'react';
import { Search, Filter, Mail, Phone, Users, CheckSquare, Square, Trash2 } from 'lucide-react';

const ContactListComponent = ({ contacts = [], onContactsSelect, selectedContacts = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, email, phone, both
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.phone?.includes(term)
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'email':
        filtered = filtered.filter(contact => contact.hasEmail);
        break;
      case 'phone':
        filtered = filtered.filter(contact => contact.hasPhone);
        break;
      case 'both':
        filtered = filtered.filter(contact => contact.hasEmail && contact.hasPhone);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [contacts, searchTerm, filterType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      // Deselect all
      onContactsSelect([]);
    } else {
      // Select all visible contacts
      onContactsSelect(paginatedContacts);
    }
  };

  const handleSelectContact = (contact) => {
    const isSelected = selectedContacts.some(c => c._rowId === contact._rowId);
    
    if (isSelected) {
      // Remove from selection
      onContactsSelect(selectedContacts.filter(c => c._rowId !== contact._rowId));
    } else {
      // Add to selection
      onContactsSelect([...selectedContacts, contact]);
    }
  };

  const isContactSelected = (contact) => {
    return selectedContacts.some(c => c._rowId === contact._rowId);
  };

  const getContactStatusBadges = (contact) => {
    const badges = [];
    if (contact.hasEmail) {
      badges.push(
        <span key="email" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Mail className="w-3 h-3 mr-1" />
          Email
        </span>
      );
    }
    if (contact.hasPhone) {
      badges.push(
        <span key="phone" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Phone className="w-3 h-3 mr-1" />
          Phone
        </span>
      );
    }
    return badges;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Contact List
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and select contacts for your outreach campaigns
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.hasEmail).length}
              </div>
              <div className="text-sm text-gray-600">With Email</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {contacts.filter(c => c.hasPhone).length}
              </div>
              <div className="text-sm text-gray-600">With Phone</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{selectedContacts.length}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search contacts by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Contacts</option>
              <option value="email">Email Only</option>
              <option value="phone">Phone Only</option>
              <option value="both">Both Email & Phone</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>

        {/* Selection Controls */}
        {paginatedContacts.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              {selectedContacts.length === paginatedContacts.length ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
              {selectedContacts.length === paginatedContacts.length ? 'Deselect All' : 'Select All'}
            </button>
            
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => onContactsSelect([])}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Table */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">
            {contacts.length === 0 
              ? 'Upload a CSV file to get started with your contacts'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedContacts.map((contact) => (
                  <tr 
                    key={contact._rowId}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      isContactSelected(contact) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectContact(contact);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {isContactSelected(contact) ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {getContactStatusBadges(contact)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredContacts.length)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{filteredContacts.length}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactListComponent;
