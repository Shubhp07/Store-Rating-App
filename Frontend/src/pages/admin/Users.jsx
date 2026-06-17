import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import Table from '../../components/common/Table';
import AddUserModal from '../../components/admin/AddUserModal';
import EditUserModal from '../../components/admin/EditUserModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable } from '../../components/common/Skeletons';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { addToast } = useToast();

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      addToast('User deleted successfully!', 'success');
      fetchUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

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
      render: (row) => <span className="text-gray-500 dark:text-gray-400 block max-w-[250px] truncate" title={row.address}>{row.address}</span> 
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
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (row) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${
          row.is_suspended ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          {row.is_suspended ? 'Suspended' : 'Active'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-150"
            title="Edit User"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-150"
            title="Delete User"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Users</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">View and manage system administrators, store owners, and users.</p>
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

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-5 items-end transition-colors duration-200">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search Name</label>
          <input 
            type="text" 
            placeholder="Filter by name..." 
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-900 dark:text-gray-100"
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Search Email</label>
          <input 
            type="text" 
            placeholder="Filter by email..." 
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-900 dark:text-gray-100"
            value={filters.email}
            onChange={(e) => setFilters({...filters, email: e.target.value})}
          />
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Role</label>
          <select 
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all text-gray-900 dark:text-gray-100 capitalize"
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
        <SkeletonTable columns={6} rows={6} />
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

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }} 
        user={selectedUser}
        onUserUpdated={fetchUsers}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }} 
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete user ${selectedUser?.name} (${selectedUser?.email})?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Users;
