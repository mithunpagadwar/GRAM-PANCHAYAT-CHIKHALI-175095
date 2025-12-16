import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { Complaint as ComplaintType } from '../types';

interface ComplaintProps {
  onSubmit: (complaint: ComplaintType) => void;
}

export const Complaint: React.FC<ComplaintProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    category: 'Water Supply (पाणी पुरवठा)', // Default
    description: '',
    applicantPhotoUrl: '',
    docUrl: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newComplaint: ComplaintType = {
        id: Date.now().toString(),
        applicantName: formData.name,
        mobile: formData.mobile,
        category: formData.category,
        description: formData.description,
        applicantPhotoUrl: formData.applicantPhotoUrl,
        docUrl: formData.docUrl,
        status: 'Open',
        date: new Date().toLocaleDateString()
    };

    onSubmit(newComplaint);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Registered!</h2>
          <p className="text-gray-600 mb-6">Your grievance has been forwarded to the administration. We will process it shortly.</p>
          <button onClick={() => window.location.href = '#/'} className="bg-gov-primary text-white px-6 py-2 rounded">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-700 p-6 text-white">
          <h2 className="text-2xl font-bold"><i className="fas fa-bullhorn mr-2"></i> Register Complaint</h2>
          <p className="opacity-90">File your grievance directly to the Gram Panchayat.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Applicant Name</label>
              <input 
                required
                type="text" 
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Mobile Number</label>
              <input 
                required
                type="tel" 
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Complaint Type (विषय)</label>
            <select
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-500 outline-none bg-white"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
            >
                <option value="Water Supply (पाणी पुरवठा)">Water Supply (पाणी पुरवठा)</option>
                <option value="Street Light (पथदिवे)">Street Light (पथदिवे)</option>
                <option value="Road Construction (रस्ते/बांधकाम)">Road Construction (रस्ते/बांधकाम)</option>
                <option value="Cleaning/Sanitation (स्वच्छता/गटार)">Cleaning/Sanitation (स्वच्छता/गटार)</option>
                <option value="Property Tax (घरपट्टी/पाणीपट्टी)">Property Tax (घरपट्टी/पाणीपट्टी)</option>
                <option value="Encroachment (अतिक्रमण)">Encroachment (अतिक्रमण)</option>
                <option value="Other (इतर)">Other (इतर)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Complaint Details (सविस्तर माहिती)</label>
            <textarea 
              required
              rows={4}
              className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-red-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">1. Applicant Photo</h4>
                <p className="text-xs text-gray-500 mb-2">Upload your passport size photo</p>
                <FileUpload 
                    label="Upload Photo" 
                    accept="image/*" 
                    onFileSelect={(url) => setFormData({...formData, applicantPhotoUrl: url})}
                />
             </div>

             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">2. Evidence / Documents</h4>
                <p className="text-xs text-blue-600 mb-2">Upload photo of the issue or documents</p>
                <FileUpload 
                    label="Attach Proof/Doc" 
                    accept="image/*,.pdf" 
                    onFileSelect={(url) => setFormData({...formData, docUrl: url})}
                />
             </div>
          </div>

          <button type="submit" className="w-full bg-gov-secondary hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};