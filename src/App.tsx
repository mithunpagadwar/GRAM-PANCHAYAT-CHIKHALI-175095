import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { TaxPayment } from './pages/TaxPayment';
import { Complaint } from './pages/Complaint';
import { Blog } from './pages/Blog';
import { Schemes } from './pages/Schemes';
import { Meetings } from './pages/Meetings';
import { Contact } from './pages/Contact';

import { INITIAL_BLOGS, INITIAL_LINKS, INITIAL_MEETINGS, INITIAL_MEMBERS, INITIAL_SCHEMES, INITIAL_SETTINGS, INITIAL_TAX_RECORDS } from './constants';
import { AppSettings, BlogPost, Complaint as ComplaintType, ImportantLink, MeetingRecord, Member, Scheme, TaxRecord } from './types';
import { subscribeToCollection, addToCollection } from './services/db';
import { isConfigured } from './firebaseConfig';

function App() {
  // State 
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>(INITIAL_TAX_RECORDS); 
  const [complaints, setComplaints] = useState<ComplaintType[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>(INITIAL_SCHEMES);
  const [meetings, setMeetings] = useState<MeetingRecord[]>(INITIAL_MEETINGS);
  const [links, setLinks] = useState<ImportantLink[]>(INITIAL_LINKS);
  
  const [isConnected, setIsConnected] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Realtime Cloud Sync Logic
  const connectToDatabase = useCallback(() => {
    if (!isConfigured()) {
      console.warn("Firebase not configured. Using Demo Data.");
      return () => {};
    }

    setDbError(false); // Reset error state on try
    setIsConnected(true); // Optimistically set connected

    const handleSyncError = (err: any) => {
        // If we get a permission/not-found error, it means DB isn't set up yet
        console.warn("Database Sync Failed - Switching to Offline Mode", err);
        setIsConnected(false);
        setDbError(true);
    };

    const unsubMembers = subscribeToCollection('members', (data) => setMembers(data.length ? data as Member[] : INITIAL_MEMBERS), handleSyncError);
    const unsubBlogs = subscribeToCollection('blogs', (data) => setBlogs(data.length ? data as BlogPost[] : INITIAL_BLOGS), handleSyncError);
    const unsubTax = subscribeToCollection('taxRecords', (data) => setTaxRecords(data.length ? data as TaxRecord[] : INITIAL_TAX_RECORDS), handleSyncError);
    const unsubComplaints = subscribeToCollection('complaints', (data) => setComplaints(data as ComplaintType[]), handleSyncError);
    const unsubSchemes = subscribeToCollection('schemes', (data) => setSchemes(data.length ? data as Scheme[] : INITIAL_SCHEMES), handleSyncError);
    const unsubMeetings = subscribeToCollection('meetings', (data) => setMeetings(data.length ? data as MeetingRecord[] : INITIAL_MEETINGS), handleSyncError);
    const unsubLinks = subscribeToCollection('links', (data) => setLinks(data.length ? data as ImportantLink[] : INITIAL_LINKS), handleSyncError);
    
    // Return cleanup function
    return () => {
      if (unsubMembers) unsubMembers();
      if (unsubBlogs) unsubBlogs();
      if (unsubTax) unsubTax();
      if (unsubComplaints) unsubComplaints();
      if (unsubSchemes) unsubSchemes();
      if (unsubMeetings) unsubMeetings();
      if (unsubLinks) unsubLinks();
    };
  }, [retryCount]); // Re-run when retryCount changes

  // Trigger connection on mount or retry
  useEffect(() => {
    const cleanup = connectToDatabase();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connectToDatabase]);

  const handleRetry = () => {
      setDbError(false);
      setRetryCount(prev => prev + 1); // Trigger re-connection
  };

  const handleAddComplaint = (newComplaint: ComplaintType) => {
    if (isConfigured() && isConnected && !dbError) {
        addToCollection('complaints', newComplaint);
    } else {
        setComplaints(prev => [newComplaint, ...prev]); // Fallback
        alert("Offline Mode: Complaint saved locally. Enable Firestore in Google Cloud Console to sync permanently.");
    }
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        {/* Status Banners */}
        {!isConnected && isConfigured() === false && (
            <div className="bg-red-600 text-white text-center text-xs p-1 font-bold z-50">
                DEMO MODE: Configure firebaseConfig.ts to enable Cloud Database & Storage.
            </div>
        )}
        
        {dbError && (
            <div className="bg-yellow-500 text-black text-center text-xs p-2 font-bold z-50 flex flex-col md:flex-row justify-center items-center gap-2">
                <span>
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Connection Failed: Ensure "Firestore Database" is ENABLED in Firebase Console.
                </span>
                <button 
                    onClick={handleRetry} 
                    className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800 transition"
                >
                    <i className="fas fa-sync-alt mr-1"></i> Retry Connection
                </button>
            </div>
        )}

        <Navbar 
            logoUrl={settings.logoUrl} 
            panchayatName={settings.panchayatName} 
            flagUrl={settings.flagUrl}
            marqueeText={settings.marqueeText}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home settings={settings} members={members} links={links} notices={blogs} />} />
            
            <Route 
              path="/admin" 
              element={
                <AdminDashboard 
                  members={members} setMembers={setMembers}
                  settings={settings} setSettings={setSettings}
                  taxRecords={taxRecords} setTaxRecords={setTaxRecords}
                  complaints={complaints} setComplaints={setComplaints}
                  blogs={blogs} setBlogs={setBlogs}
                  schemes={schemes} setSchemes={setSchemes}
                  meetings={meetings} setMeetings={setMeetings}
                  links={links} setLinks={setLinks}
                  isCloudConnected={isConnected && !dbError}
                />
              } 
            />
            
            <Route path="/tax" element={<TaxPayment records={taxRecords} settings={settings} />} />
            <Route path="/complaint" element={<Complaint onSubmit={handleAddComplaint} />} />
            <Route path="/blog" element={<Blog posts={blogs} />} />
            <Route path="/schemes" element={<Schemes schemes={schemes} />} />
            <Route path="/meetings" element={<Meetings meetings={meetings} />} />
            <Route path="/contact" element={<Contact settings={settings} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;