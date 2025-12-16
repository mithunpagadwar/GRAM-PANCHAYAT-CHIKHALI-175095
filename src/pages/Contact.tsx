import React from 'react';
import { AppSettings } from '../types';

interface ContactProps {
  settings: AppSettings;
}

export const Contact: React.FC<ContactProps> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gov-primary text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">संपर्क साधा (Contact Us)</h1>
        <p className="opacity-90">आम्ही आपल्या सेवेसाठी सदैव तत्पर आहोत</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-gov-secondary">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Gram Panchayat Office</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Address</h3>
                  <p className="text-gray-600">
                    {settings.address}<br/>
                    Taluka: {settings.taluka}<br/>
                    District: {settings.district}, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone-alt text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Phone / Mobile</h3>
                  <p className="text-gray-600 font-mono text-lg">{settings.contactNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Email Address</h3>
                  <a href={`mailto:${settings.email}`} className="text-blue-600 hover:underline">{settings.email}</a>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded text-sm text-gray-500 mt-4">
                 <i className="fas fa-clock mr-2"></i> Office Hours: 10:00 AM - 05:00 PM (Monday - Saturday)
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-2 rounded-lg shadow-xl h-[450px]">
            <iframe 
              src={settings.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen={true} 
              loading="lazy"
              title="Gram Panchayat Location"
              className="rounded"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};