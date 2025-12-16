import React, { useState } from 'react';
import { TaxRecord, AppSettings } from '../types';

interface TaxPaymentProps {
  records: TaxRecord[];
  settings: AppSettings;
}

export const TaxPayment: React.FC<TaxPaymentProps> = ({ records, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = (record: TaxRecord) => {
    let selectedUpiId = '';
    
    // Select UPI ID based on tax type
    if (record.paymentType === 'House Tax' && settings.upiIdHouse) {
        selectedUpiId = settings.upiIdHouse;
    } else if (record.paymentType === 'Water Tax' && settings.upiIdWater) {
        selectedUpiId = settings.upiIdWater;
    } else if (record.paymentType === 'Special Water Tax' && settings.upiIdSpecialWater) {
        selectedUpiId = settings.upiIdSpecialWater;
    }

    if (!selectedUpiId) {
        alert(`Online payment for ${record.paymentType} is currently not configured. Please contact Gram Panchayat.`);
        return;
    }
    // Construct UPI Link
    const upiLink = `upi://pay?pa=${selectedUpiId}&pn=GramPanchayatChikhali&am=${record.amount}&tn=${record.paymentType}-${record.propertyId}&cu=INR`;
    
    // Try to open
    window.open(upiLink, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-gov-primary p-6 text-white flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold"><i className="fas fa-hand-holding-usd mr-2"></i> Tax Payment Portal</h2>
            <p className="opacity-80">Pay House Tax, Water Tax & Special Taxes securely online</p>
          </div>
          {settings.taxListUrl && (
              <a href={settings.taxListUrl} target="_blank" rel="noreferrer" className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold transition flex items-center shadow-lg">
                  <i className="fas fa-file-pdf mr-2"></i> Download Tax List (यादी)
              </a>
          )}
        </div>
        
        <div className="p-6 bg-gray-50 border-b">
          <label className="block text-sm font-bold mb-2">Search Property</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Property ID (e.g. PROP-12345) or Owner Name" 
              className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="bg-gov-secondary text-white px-6 rounded-lg font-bold">Search</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 border-b">Property ID</th>
                <th className="p-4 border-b">Owner Name</th>
                <th className="p-4 border-b">Mobile</th>
                <th className="p-4 border-b">Tax Type</th>
                <th className="p-4 border-b text-right">Amount (INR)</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50 border-b transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-800">{record.propertyId}</td>
                  <td className="p-4 font-semibold">{record.ownerName}</td>
                  <td className="p-4">{record.mobile}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${record.paymentType === 'House Tax' ? 'bg-orange-100 text-orange-800' : 
                          record.paymentType === 'Water Tax' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                      {record.paymentType}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold">₹ {record.amount}</td>
                  <td className="p-4 text-center">
                    {record.status === 'Pending' ? (
                      <button 
                        onClick={() => handlePayment(record)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded shadow text-xs font-bold uppercase flex items-center justify-center gap-1 mx-auto"
                      >
                        <i className="fab fa-google-pay text-lg"></i> Pay Now
                      </button>
                    ) : (
                      <span className="text-green-600 font-bold border border-green-600 px-2 py-1 rounded">PAID</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                        No records found matching "{searchTerm}"
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Secure payment gateway powered by Government of India UPI standards.</p>
        <p className="text-xs mt-1">Note: Clicking 'Pay Now' will open your preferred UPI app (Google Pay, PhonePe, etc.) on mobile.</p>
      </div>
    </div>
  );
};