import React, { useState } from 'react';
import { LayoutDashboard, Inbox, Users, Terminal, Mail, Check, Archive } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [developerMode, setDeveloperMode] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const tickets = [
    { id: 1, from: 'Al Madina Pharmacy', subject: 'Stock synchronization issue', status: 'new', time: '10:30' },
    { id: 2, from: 'Dr. Hassan Alami', subject: 'Telemedicine API Access', status: 'pending', time: '09:15' },
    { id: 3, from: 'Import Med SA', subject: 'November Billing', status: 'resolved', time: 'Yesterday' },
    { id: 4, from: 'Patient Ahmed K.', subject: 'Prescription not received', status: 'new', time: '14:22' }
  ];

  const logs = [
    '[10:45:32] ✓ Database backup completed',
    '[10:44:18] → User login: pharmacist_2341',
    '[10:43:01] ⚠ High API usage detected',
    '[10:42:15] ✓ Payment processed: 199 DH',
    '[10:40:08] → New prescription created',
    '[10:38:45] ✓ Stock update synchronized',
    '[10:37:22] → Order placed: #ORD-12849'
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            FinDawa
          </h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === 'overview' ? 'bg-green-600' : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === 'inbox' ? 'bg-green-600' : 'hover:bg-slate-800'
            }`}
          >
            <Inbox className="w-5 h-5" />
            Inbox
            <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">2</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
              activeTab === 'users' ? 'bg-green-600' : 'hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <div className="mt-6 p-4 bg-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Developer Mode</span>
              <Switch checked={developerMode} onCheckedChange={setDeveloperMode} />
            </div>
            <p className="text-xs text-gray-400">System logs & diagnostics</p>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button onClick={onLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <div className="p-8">
            <h1 className="text-3xl mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-600 mb-2">Total Users</p>
                <h3 className="text-3xl">106,234</h3>
                <p className="text-sm text-green-600 mt-2">+12% this month</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-600 mb-2">Revenue</p>
                <h3 className="text-3xl">2.4M DH</h3>
                <p className="text-sm text-green-600 mt-2">+8% this month</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-600 mb-2">Active Pharmacies</p>
                <h3 className="text-3xl">5,127</h3>
                <p className="text-sm text-blue-600 mt-2">423 new</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-600 mb-2">Support Tickets</p>
                <h3 className="text-3xl">42</h3>
                <p className="text-sm text-orange-600 mt-2">12 pending</p>
              </div>
            </div>

            {developerMode && (
              <div className="bg-black text-green-400 p-6 rounded-2xl font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5" />
                  <h3>System Console</h3>
                </div>
                <div className="space-y-1">
                  {logs.map((log, idx) => (
                    <div key={idx} className="opacity-80 hover:opacity-100">{log}</div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-yellow-400">$</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="flex h-full">
            {/* Ticket List */}
            <div className="w-96 bg-white border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl">Support Tickets</h2>
              </div>
              <div className="overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedTicket === ticket.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{ticket.from}</h3>
                      <span className="text-xs text-gray-500">{ticket.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.subject}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      ticket.status === 'new' ? 'bg-red-100 text-red-700' :
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status === 'new' ? 'New' : ticket.status === 'pending' ? 'Pending' : 'Resolved'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Detail */}
            <div className="flex-1 p-8">
              {selectedTicket ? (
                <div>
                  <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <h2 className="text-2xl mb-4">
                      {tickets.find(t => t.id === selectedTicket)?.subject}
                    </h2>
                    <div className="flex items-center gap-3 mb-6">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{tickets.find(t => t.id === selectedTicket)?.from}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are encountering a problem with our stock synchronization since this morning. Could you help us?
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg mb-4">Reply</h3>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Your reply..."
                      rows={6}
                      className="mb-4"
                    />
                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Send & Resolve
                      </Button>
                      <Button variant="outline">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Inbox className="w-16 h-16 mx-auto mb-4" />
                    <p>Select a ticket</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-8">
            <h1 className="text-3xl mb-8">User Management</h1>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {['Ahmed Benali', 'Sara El Amrani', 'Mohamed Ziani', 'Fatima Alaoui'].map((name, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="px-6 py-4">{name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Pharmacist
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">Dec 2024</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}