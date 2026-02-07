import React, { useState } from 'react';
import { Stethoscope, FileText, Video, Mic, VideoOff, PhoneOff, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface DoctorDashboardProps {
  onLogout: () => void;
  showNotification: (message: string) => void;
}

export function DoctorDashboard({ onLogout, showNotification }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [prescription, setPrescription] = useState({
    patientName: '',
    medications: [{ name: '', dosage: '', duration: '' }]
  });

  const addMedication = () => {
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, { name: '', dosage: '', duration: '' }]
    });
  };

  const removeMedication = (index: number) => {
    setPrescription({
      ...prescription,
      medications: prescription.medications.filter((_, i) => i !== index)
    });
  };

  const handleSubmitPrescription = () => {
    showNotification('Prescription created and sent to patient');
    setPrescription({
      patientName: '',
      medications: [{ name: '', dosage: '', duration: '' }]
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl">Dr. Hassan Alami</h1>
              <p className="text-cyan-100">General Practitioner</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white/10">
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-cyan-100 mb-1">Consultations Today</p>
              <h3 className="text-3xl">12</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-cyan-100 mb-1">Patients Waiting</p>
              <h3 className="text-3xl">3</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-cyan-100 mb-1">Prescriptions Created</p>
              <h3 className="text-3xl">8</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'prescriptions'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-gray-600 hover:text-cyan-600'
              }`}
            >
              <FileText className="w-5 h-5" />
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('telemedicine')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'telemedicine'
                  ? 'border-cyan-600 text-cyan-600'
                  : 'border-transparent text-gray-600 hover:text-cyan-600'
              }`}
            >
              <Video className="w-5 h-5" />
              Telemedicine
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {activeTab === 'prescriptions' && (
            <div>
              <h2 className="text-2xl mb-6">Create Digital Prescription</h2>

              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">
                <div className="mb-6">
                  <label className="block text-sm mb-2">Patient Name</label>
                  <Input
                    value={prescription.patientName}
                    onChange={(e) => setPrescription({ ...prescription, patientName: e.target.value })}
                    placeholder="Full patient name"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg">Medications</h3>
                    <Button
                      onClick={addMedication}
                      variant="outline"
                      size="sm"
                      className="text-cyan-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Medication"
                            value={med.name}
                            onChange={(e) => {
                              const newMeds = [...prescription.medications];
                              newMeds[index].name = e.target.value;
                              setPrescription({ ...prescription, medications: newMeds });
                            }}
                          />
                          <Input
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => {
                              const newMeds = [...prescription.medications];
                              newMeds[index].dosage = e.target.value;
                              setPrescription({ ...prescription, medications: newMeds });
                            }}
                          />
                          <Input
                            placeholder="Duration"
                            value={med.duration}
                            onChange={(e) => {
                              const newMeds = [...prescription.medications];
                              newMeds[index].duration = e.target.value;
                              setPrescription({ ...prescription, medications: newMeds });
                            }}
                          />
                        </div>
                        {prescription.medications.length > 1 && (
                          <Button
                            onClick={() => removeMedication(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Notes & Instructions</label>
                  <Textarea
                    placeholder="Instructions for the patient..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmitPrescription}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 py-6"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create and Send Prescription
                </Button>
              </div>

              {/* Recent Prescriptions */}
              <div className="mt-8">
                <h3 className="text-xl mb-4">Recent Prescriptions</h3>
                <div className="space-y-3">
                  {['Ahmed Benali - Doliprane 1000mg', 'Sara El Amrani - Amoxicilline 500mg', 'Mohamed Ziani - Ventoline'].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p>{item}</p>
                          <p className="text-sm text-gray-500">{idx + 1} hour(s) ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemedicine' && (
            <div>
              <h2 className="text-2xl mb-6">Telemedicine</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-lg mb-4">Upcoming Consultations</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Ahmed Benali', time: '14:00', status: 'Waiting' },
                      { name: 'Sara El Amrani', time: '14:30', status: 'Confirmed' },
                      { name: 'Mohamed Ziani', time: '15:00', status: 'Confirmed' }
                    ].map((consult, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p>{consult.name}</p>
                          <p className="text-sm text-gray-500">{consult.time}</p>
                        </div>
                        <Button
                          onClick={() => setVideoCallOpen(true)}
                          className="bg-cyan-600 hover:bg-cyan-700"
                          size="sm"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-lg mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Consultations this month</span>
                      <span className="text-2xl text-cyan-600">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average duration</span>
                      <span className="text-2xl text-cyan-600">23 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Satisfaction</span>
                      <span className="text-2xl text-cyan-600">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Call Modal */}
      {videoCallOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Video Area */}
          <div className="flex-1 relative">
            {/* Main Video (Patient) */}
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-16 h-16" />
                </div>
                <h3 className="text-2xl mb-2">Ahmed Benali</h3>
                <p className="text-gray-400">Consultation in progress...</p>
              </div>
            </div>

            {/* Self Video (Picture-in-Picture) */}
            <div className="absolute top-6 right-6 w-64 h-48 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-900 p-6">
            <div className="container mx-auto flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                } text-white`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                } text-white`}
              >
                <VideoOff className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setVideoCallOpen(false);
                  showNotification('Consultation ended');
                }}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}