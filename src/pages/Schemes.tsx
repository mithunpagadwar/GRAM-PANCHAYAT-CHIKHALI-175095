import React from 'react';
import { Scheme } from '../types';

interface SchemesProps {
  schemes: Scheme[];
}

export const Schemes: React.FC<SchemesProps> = ({ schemes }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gov-primary uppercase">Government Schemes (Yojana)</h2>
        <p className="text-gray-600 mt-2">Beneficiary schemes active in Gram Panchayat Chikhali</p>
        <div className="w-24 h-1 bg-gov-accent mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.length === 0 ? (
            <div className="text-center col-span-2 text-gray-500 py-10">No active schemes listed at the moment.</div>
        ) : (
            schemes.map(scheme => (
            <div key={scheme.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-gov-secondary hover:shadow-xl transition-shadow">
                <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{scheme.name}</h3>
                    {scheme.deadline && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Deadline: {scheme.deadline}</span>}
                </div>
                <p className="text-gray-600 mb-4">{scheme.description}</p>
                
                <div className="bg-blue-50 p-3 rounded mb-4">
                    <h4 className="text-sm font-bold text-blue-800">Eligibility:</h4>
                    <p className="text-sm text-blue-700">{scheme.eligibility}</p>
                </div>

                {scheme.docUrl && (
                    <a href={scheme.docUrl} target="_blank" rel="noreferrer" className="inline-block bg-gov-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-800">
                        <i className="fas fa-file-download mr-2"></i> Download Application / Details
                    </a>
                )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
