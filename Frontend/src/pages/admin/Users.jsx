import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/common/Table';
import AddUserModal from '../../components/admin/AddUserModal';
import Spinner from '../../components/common/Spinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [filters, setFilters] = useState({ name: '', email: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy,
        order
      }).toString();
      const res = await api.get(`/admin/users?${queryParams}`);
      setUsers(res.data);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(key);
      setOrder('ASC');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'address', 
      label: 'Address', 
      sortable: true, 
      render: (row) => <span className="text-gray-500 block max-w-[250px] truncate" title={row.address}>{row.address}</span> 
    },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
          row.role === 'store_owner' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
          'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {row.role.replace('_', ' ')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h2>
          <p className="text-gray-500 font-medium mt-1">View and manage system administrators, store owners, and users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-5 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Name</label>
          <input 
            type="text" 
            placeholder="Filter by name..." 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900"
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Email</label>
          <input 
            type="text" 
            placeholder="Filter by email..." 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900"
            value={filters.email}
            onChange={(e) => setFilters({...filters, email: e.target.value})}
          />
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
          <select 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 capitalize"
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Spinner />
        </div>
      ) : (
        <Table 
          columns={columns} 
          data={users} 
          onSort={handleSort} 
          sortBy={sortBy} 
          order={order} 
        />
      )}

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserAdded={fetchUsers}
      />
    </div>
  );
};

export default Users;
