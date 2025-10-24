'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  UserX, 
  UserCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

const createUserSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['admin', 'superadmin'], { required_error: 'Le rôle est requis' }),
});

const updateUserSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().optional(),
  role: z.enum(['admin', 'superadmin'], { required_error: 'Le rôle est requis' }),
});

type CreateUserFormInputs = z.infer<typeof createUserSchema>;
type UpdateUserFormInputs = z.infer<typeof updateUserSchema>;

interface AdminUser {
  _id: string;
  username: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const createForm = useForm<CreateUserFormInputs>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'admin',
    },
  });

  const updateForm = useForm<UpdateUserFormInputs>({
    resolver: zodResolver(updateUserSchema),
  });

  // Charger la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.error || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur fetchUsers:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Créer un nouvel utilisateur
  const onCreateUser = async (data: CreateUserFormInputs) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Utilisateur créé avec succès !');
        createForm.reset();
        setShowCreateForm(false);
        fetchUsers();
      } else {
        toast.error(result.error || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur onCreateUser:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  // Mettre à jour un utilisateur
  const onUpdateUser = async (data: UpdateUserFormInputs) => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Utilisateur mis à jour avec succès !');
        setEditingUser(null);
        updateForm.reset();
        fetchUsers();
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur onUpdateUser:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  // Supprimer un utilisateur
  const onDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Utilisateur supprimé avec succès !');
        fetchUsers();
      } else {
        toast.error(result.error || 'Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur onDeleteUser:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Basculer le statut actif/inactif
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès !`);
        fetchUsers();
      } else {
        toast.error(result.error || 'Erreur lors de la modification du statut');
      }
    } catch (error) {
      console.error('Erreur toggleUserStatus:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  // Ouvrir le formulaire d'édition
  const openEditForm = (user: AdminUser) => {
    setEditingUser(user);
    updateForm.reset({
      username: user.username,
      password: '',
      role: user.role,
    });
  };

  // Fermer le formulaire d'édition
  const closeEditForm = () => {
    setEditingUser(null);
    updateForm.reset();
  };

  // Basculer l'affichage du mot de passe
  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-700 flex items-center">
            <Users className="mr-3" size={32} />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les comptes administrateurs et leurs permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
          className="flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary-700 flex items-center">
              <Plus className="mr-2" size={24} />
              Créer un Nouvel Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createForm.handleSubmit(onCreateUser)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  id="username"
                  label="Nom d'utilisateur"
                  placeholder="Entrez le nom d'utilisateur"
                  {...createForm.register('username')}
                  error={createForm.formState.errors.username?.message}
                />
                <Input
                  id="password"
                  label="Mot de passe"
                  type="password"
                  placeholder="Entrez le mot de passe"
                  {...createForm.register('password')}
                  error={createForm.formState.errors.password?.message}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle
                  </label>
                  <select
                    {...createForm.register('role')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                  {createForm.formState.errors.role && (
                    <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.role.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    createForm.reset();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary">
                  Créer l'Utilisateur
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des utilisateurs */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary-700">
            Utilisateurs Administrateurs ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Dernière Connexion</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Créé le</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'superadmin' ? (
                          <ShieldCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <Shield className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEditForm(user)}
                          className="p-2"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant={user.isActive ? "secondary" : "primary"}
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className="p-2"
                        >
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </Button>
                        {user.username !== 'superadmin' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onDeleteUser(user._id, user.username)}
                            className="p-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary-700 flex items-center">
                <Edit className="mr-2" size={24} />
                Modifier l'Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateForm.handleSubmit(onUpdateUser)} className="space-y-6">
                <Input
                  id="username"
                  label="Nom d'utilisateur"
                  placeholder="Entrez le nom d'utilisateur"
                  {...updateForm.register('username')}
                  error={updateForm.formState.errors.username?.message}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe (laisser vide pour ne pas changer)
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords[editingUser._id] ? 'text' : 'password'}
                      {...updateForm.register('password')}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Entrez le nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(editingUser._id)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords[editingUser._id] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {updateForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle
                  </label>
                  <select
                    {...updateForm.register('role')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                  {updateForm.formState.errors.role && (
                    <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.role.message}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeEditForm}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    Mettre à jour
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
