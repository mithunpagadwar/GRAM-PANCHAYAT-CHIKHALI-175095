import React, { useState } from 'react';
import { MeetingRecord } from '../types';

interface MeetingsProps {
  meetings: MeetingRecord[];
}

export const Meetings: React.FC<MeetingsProps> = ({ meetings }) => {
  const [filter, setFilter] = useState<'All' | 'Gram Sabha' | 'Masik Sabha' | 'Bal Sabha' | 'Ward Sabha'>('All');

  const filteredMeetings = filter === 'All' ? meetings : meetings.filter(m => m.type === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gov-primary uppercase">Meetings & Sabhas</h2>
        <p className="text-gray-600 mt-2">Minutes, Schedules, and Recordings of Panchayat Meetings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['All', 'Gram Sabha', 'Masik Sabha', 'Ward Sabha', 'Bal Sabha'].map(type => (
            <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${
                    filter === type ? 'bg-gov-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
                {type}
            </button>
        ))}
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredMeetings.length === 0 ? (
             <div className="text-center text-gray-500 py-10 bg-white rounded shadow">
                <i className="fas fa-calendar-times text-4xl mb-3 block"></i>
                No records found for {filter}
             </div>
        ) : (
            filteredMeetings.map(meeting => (
            <div key={meeting.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gray-200 relative min-h-[200px]">
                    {meeting.mediaUrl ? (
                         meeting.mediaType === 'video' ? (
                            <video src={meeting.mediaUrl} controls className="w-full h-full object-cover" />
                         ) : (
                            <img src={meeting.mediaUrl} className="w-full h-full object-cover" alt="Meeting" />
                         )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-users text-4xl"></i>
                        </div>
                    )}
                    <div className="absolute top-0 left-0 bg-gov-accent text-white px-3 py-1 text-xs font-bold">
                        {meeting.type}
                    </div>
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{meeting.title}</h3>
                            <span className="text-sm text-gray-500 font-mono"><i className="far fa-calendar-alt mr-1"></i> {meeting.date}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{meeting.description}</p>
                    </div>
                    <div>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                            <i className="fas fa-file-pdf mr-1"></i> View Minutes / Resolution (Tharav)
                        </button>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
