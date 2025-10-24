'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  CreditCard,
  Wallet,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Mock data
const financialStats = {
  totalRevenue: 3250000,
  monthRevenue: 1250000,
  pendingPayments: 450000,
  expenses: 180000,
  profit: 1070000,
};

const recentTransactions = [
  {
    id: '1',
    type: 'revenue',
    description: 'Mariage Sarah & Paul',
    amount: 350000,
    date: '2024-10-20',
    status: 'completed',
    method: 'Mobile Money',
  },
  {
    id: '2',
    type: 'revenue',
    description: 'Portrait Corporate - M. Adjei',
    amount: 50000,
    date: '2024-10-19',
    status: 'completed',
    method: 'Espèces',
  },
  {
    id: '3',
    type: 'expense',
    description: 'Achat équipement photo',
    amount: 75000,
    date: '2024-10-18',
    status: 'completed',
    method: 'Virement',
  },
  {
    id: '4',
    type: 'revenue',
    description: 'Événement TechCorp',
    amount: 250000,
    date: '2024-10-17',
    status: 'pending',
    method: 'À recevoir',
  },
  {
    id: '5',
    type: 'expense',
    description: 'Abonnement Cloudinary',
    amount: 25000,
    date: '2024-10-15',
    status: 'completed',
    method: 'Carte',
  },
];

const invoices = [
  {
    id: 'INV-2024-001',
    client: 'Sarah & Paul Mensah',
    amount: 350000,
    status: 'paid',
    date: '2024-10-15',
    dueDate: '2024-10-15',
  },
  {
    id: 'INV-2024-002',
    client: 'TechCorp',
    amount: 250000,
    status: 'pending',
    date: '2024-10-17',
    dueDate: '2024-10-24',
  },
  {
    id: 'INV-2024-003',
    client: 'Kofi Adjei',
    amount: 50000,
    status: 'paid',
    date: '2024-10-19',
    dueDate: '2024-10-19',
  },
];

export default function FinancesPage() {
  const [filterPeriod, setFilterPeriod] = useState('month');

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Finances</h1>
          <p className="text-neutral-600">Gérez vos revenus, dépenses et factures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" leftIcon={<Download size={20} />}>
            Exporter
          </Button>
          <Button variant="primary" size="lg" leftIcon={<FileText size={20} />}>
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {['week', 'month', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterPeriod === period
                ? 'bg-primary-500 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {period === 'week' ? 'Cette semaine' : period === 'month' ? 'Ce mois' : 'Cette année'}
          </button>
        ))}
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Revenus du mois</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {(financialStats.monthRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>+15.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Paiements en attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(financialStats.pendingPayments / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xs text-neutral-600">3 factures</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Dépenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {(financialStats.expenses / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xs text-neutral-600">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Bénéfice net</p>
                <p className="text-2xl font-bold text-green-600">
                  {(financialStats.profit / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xs text-neutral-600">Marge: 85.6%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Revenus totaux</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {(financialStats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
            <p className="text-xs text-neutral-600">Année en cours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'revenue'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'revenue' ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{transaction.description}</p>
                      <p className="text-xs text-neutral-600">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'revenue' ? '+' : '-'}
                      {(transaction.amount / 1000).toFixed(0)}K
                    </p>
                    <Badge
                      variant={transaction.status === 'completed' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Factures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{invoice.id}</p>
                      <p className="text-sm text-neutral-600">{invoice.client}</p>
                      <p className="text-xs text-neutral-500">
                        Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">
                      {(invoice.amount / 1000).toFixed(0)}K
                    </p>
                    <Badge
                      variant={invoice.status === 'paid' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


