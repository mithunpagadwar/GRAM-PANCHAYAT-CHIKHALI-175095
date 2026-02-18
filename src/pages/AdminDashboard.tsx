import React, { useState, useEffect } from 'react';
import { AppSettings, BlogPost, Complaint, ImportantLink, MeetingRecord, Member, Scheme, TaxRecord } from '../types';
import FileUpload from '../components/FileUpload';
import { addToCollection, deleteFromCollection, updateInCollection } from '../services/db';
import { isConfigured, auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";

interface AdminDashboardProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  taxRecords: TaxRecord[];
  setTaxRecords: React.Dispatch<React.SetStateAction<TaxRecord[]>>;
  complaints: Complaint[];
  setComplaints?: React.Dispatch<React.SetStateAction<Complaint[]>>; 
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  schemes: Scheme[];
  setSchemes: React.Dispatch<React.SetStateAction<Scheme[]>>;
  meetings: MeetingRecord[];
  setMeetings: React.Dispatch<React.SetStateAction<MeetingRecord[]>>;
  links: ImportantLink[];
  setLinks: React.Dispatch<React.SetStateAction<ImportantLink[]>>;
  isCloudConnected: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  members, setMembers, settings, setSettings, taxRecords, setTaxRecords, 
  complaints, setComplaints, 
  blogs, setBlogs, schemes, setSchemes, meetings, setMeetings, links, setLinks,
  isCloudConnected
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'schemes' | 'blog' | 'meetings' | 'tax' | 'members' | 'settings' | 'complaints'>('overview');
  
  // Security State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login Form State
  const [email, setEmail] = useState('mithunpagadwar8@gmail.com');
  const [password, setPassword] = useState('Jitesh$@0824');

  // Forms State
  const [newMember, setNewMember] = useState<Partial<Member>>({ type: 'committee', name: '', position: '', mobile: '', address: '', photoUrl: '' });
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({ mediaType: 'image', category: 'General', title: '', content: '' }); 
  const [newNotice, setNewNotice] = useState<Partial<BlogPost>>({ mediaType: 'image', category: 'Notice', title: '', content: '' });
  const [newTaxRecord, setNewTaxRecord] = useState<Partial<TaxRecord>>({ paymentType: 'House Tax', status: 'Pending', amount: 0, propertyId: '', ownerName: '' });
  const [newScheme, setNewScheme] = useState<Partial<Scheme>>({ name: '', description: '', eligibility: '' });
  const [newMeeting, setNewMeeting] = useState<Partial<MeetingRecord>>({ type: 'Gram Sabha', mediaType: 'image', title: '', description: '' });
  const [newLink, setNewLink] = useState<Partial<ImportantLink>>({ title: '', url: '', description: '' });

  // Monitor Authentication State
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setLoading(false);
      });
      return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsRegistering(false);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login Error:", error);
      
      // Handle "User Not Found" or "Invalid Credential" (which can be either wrong pass or no user)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          // Attempt to Register as fallback
          handleRegister();
      } 
      else if (error.code === 'auth/wrong-password') {
          // Explicitly wrong password for existing user
          setAuthError('Incorrect Password. Please check the password or reset the user in Firebase Console.');
      }
      else if (error.code === 'auth/operation-not-allowed') {
          setAuthError('SETUP REQUIRED: Go to Firebase Console > Authentication > Sign-in method > Enable "Email/Password".');
      } 
      else {
          setAuthError(error.message);
      }
    }
  };

  const handleRegister = async () => {
      setAuthError('');
      setIsRegistering(true);
      try {
          await createUserWithEmailAndPassword(auth, email, password);
          // Success will be handled by onAuthStateChanged
      } catch (createError: any) {
          console.error("Registration Failed", createError);
          setIsRegistering(false);
          
          if(createError.code === 'auth/email-already-in-use') {
              // Crucial: User tried to login, failed (maybe due to generic invalid-credential), tried to register, but email exists.
              // This means: EMAIL EXISTS but PASSWORD WAS WRONG.
              setAuthError('Incorrect Password. (Account exists). To reset: Delete user in Firebase Console.');
          } else if (createError.code === 'auth/operation-not-allowed') {
               setAuthError('SETUP REQUIRED: Enable "Email/Password" in Firebase Console.');
          } else {
              setAuthError('Registration Error: ' + createError.message);
          }
      }
  };

  const handleLogout = async () => {
      await signOut(auth);
  };

  // --- CLOUD WRAPPER ---
  const executeAction = (collection: string, data: any, localUpdate: () => void) => {
      if (isConfigured()) {
          addToCollection(collection, data);
      } else {
          localUpdate();
      }
  };

  const executeDelete = (collection: string, id: string, localUpdate: () => void) => {
      if (isConfigured()) {
          deleteFromCollection(collection, id);
      } else {
          localUpdate();
      }
  };

  const executeUpdate = (collection: string, id: string, data: any, localUpdate: () => void) => {
      if (isConfigured()) {
          updateInCollection(collection, id, data);
      } else {
          localUpdate();
      }
  };

  // --- HANDLERS ---
  const handleAddMember = () => {
    if(!newMember.name) { alert("Name is required"); return; }
    const memberToAdd = { ...newMember, id: Date.now().toString(), photoUrl: newMember.photoUrl || 'https://ui-avatars.com/api/?name=' + newMember.name + '&background=random' } as Member;
    executeAction('members', memberToAdd, () => setMembers(prev => [...prev, memberToAdd]));
    setNewMember({ type: 'committee', name: '', position: '', mobile: '', address: '', photoUrl: '' });
  };
  
  const handleAddBlog = () => { 
      if(!newPost.title) return; 
      const post = { ...newPost, id: Date.now().toString(), publishDate: new Date().toLocaleDateString(), author: 'Admin', category: 'General' } as BlogPost;
      executeAction('blogs', post, () => setBlogs(prev => [post, ...prev]));
      setNewPost({ mediaType: 'image', category: 'General', title: '', content: '' }); 
  };
  
  const handleAddNotice = () => { 
      if(!newNotice.title) return; 
      const notice = { ...newNotice, id: Date.now().toString(), publishDate: new Date().toLocaleDateString(), author: 'Admin', category: 'Notice' } as BlogPost;
      executeAction('blogs', notice, () => setBlogs(prev => [notice, ...prev]));
      setNewNotice({ mediaType: 'image', category: 'Notice', title: '', content: '' }); 
  };

  const handleAddTax = () => { 
      if(!newTaxRecord.propertyId) return; 
      const tax = { ...newTaxRecord, id: Date.now().toString(), date: new Date().toISOString() } as TaxRecord;
      executeAction('taxRecords', tax, () => setTaxRecords(prev => [...prev, tax]));
      setNewTaxRecord({ paymentType: 'House Tax', status: 'Pending', amount: 0, propertyId: '', ownerName: '' }); 
  };

  const handleAddScheme = () => { 
      if(!newScheme.name) return; 
      const scheme = { ...newScheme, id: Date.now().toString() } as Scheme;
      executeAction('schemes', scheme, () => setSchemes(prev => [...prev, scheme]));
      setNewScheme({ name: '', description: '', eligibility: '' }); 
  };

  const handleAddMeeting = () => { 
      if(!newMeeting.title) return; 
      const meeting = { ...newMeeting, id: Date.now().toString() } as MeetingRecord;
      executeAction('meetings', meeting, () => setMeetings(prev => [...prev, meeting]));
      setNewMeeting({ type: 'Gram Sabha', mediaType: 'image', title: '', description: '' }); 
  };

  const handleAddLink = () => { 
      if(!newLink.title || !newLink.url) return; 
      const link = { ...newLink, id: Date.now().toString() } as ImportantLink;
      executeAction('links', link, () => setLinks(prev => [...prev, link]));
      setNewLink({ title: '', url: '', description: '' }); 
  };

  const deleteTax = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('taxRecords', id, () => setTaxRecords(prev => prev.filter(item => item.id !== id))); };
  const deleteMember = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('members', id, () => setMembers(prev => prev.filter(item => item.id !== id))); };
  const deleteBlogPost = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('blogs', id, () => setBlogs(prev => prev.filter(item => item.id !== id))); };
  const deleteScheme = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('schemes', id, () => setSchemes(prev => prev.filter(item => item.id !== id))); };
  const deleteMeeting = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('meetings', id, () => setMeetings(prev => prev.filter(item => item.id !== id))); };
  const deleteLink = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('links', id, () => setLinks(prev => prev.filter(item => item.id !== id))); };
  const deleteComplaint = (e: React.MouseEvent, id: string) => { e.preventDefault(); executeDelete('complaints', id, () => setComplaints && setComplaints(prev => prev.filter(item => item.id !== id))); };

  const toggleComplaintStatus = (id: string, currentStatus: string) => {
      const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
      executeUpdate('complaints', id, { status: newStatus }, () => {
          if(setComplaints) setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
      });
  };

  // Loading Screen
  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gov-primary"><i className="fas fa-circle-notch fa-spin text-4xl"></i></div>;
  }

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
             <div className="flex justify-center mb-4">
                 <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-shield-alt text-white text-3xl"></i>
                 </div>
             <h2 className="text-2xl font-bold text-gray-800">Admin Sign In</h2>
             <p className="text-gray-500 text-sm mt-1">Gram Panchayat Official Portal</p>
             {isConfigured() ? 
               <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded mt-2 inline-block border border-green-200">
                   <i className="fas fa-lock mr-1"></i> Secured by Google Firebase
               </span> :
               <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded mt-2 inline-block">Cloud Config Missing</span>
             }
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="admin@example.com" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" required />
            </div>
            
            {authError && (
                <div className="bg-red-50 text-red-800 text-sm p-3 rounded border border-red-200">
                    <i className="fas fa-exclamation-triangle mr-2"></i> {authError}
                </div>
            )}
            
            {isRegistering && (
                <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded border border-blue-200 flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Registering new account...
                </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-md transition transform hover:-translate-y-0.5">
                {isRegistering ? 'Processing...' : 'Sign In / Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
              <p className="mb-2"><strong>Trouble Logging in?</strong></p>
              <p>If you get "Password Incorrect", you must delete the user in <br/>
              <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">Firebase Console {'>'} Authentication</a> to reset.</p>
          </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-gov-primary text-white flex-shrink-0 flex flex-col hidden md:flex shadow-2xl z-20">
            <div className="p-6 border-b border-blue-800 font-bold text-lg flex items-center gap-2">
                <i className="fas fa-laptop-code"></i> Admin Panel
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Cloud Connected"></div>
            </div>
            <div className="px-6 py-4 border-b border-blue-800 bg-blue-900/50">
                <div className="text-xs text-blue-300 uppercase font-bold">Logged in as</div>
                <div className="text-sm font-bold truncate" title={currentUser.email || ''}>{currentUser.email}</div>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {[
                    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
                    { id: 'complaints', icon: 'fa-clipboard-list', label: 'Complaints (Niwara)' },
                    { id: 'tax', icon: 'fa-rupee-sign', label: 'Taxation' },
                    { id: 'notices', icon: 'fa-bell', label: 'Notices (Suchana)' },
                    { id: 'blog', icon: 'fa-newspaper', label: 'News & Blog' },
                    { id: 'schemes', icon: 'fa-hand-holding-heart', label: 'Schemes (Yojana)' },
                    { id: 'meetings', icon: 'fa-handshake', label: 'Meetings (Sabha)' },
                    { id: 'members', icon: 'fa-users', label: 'Committee & Staff' },
                    { id: 'settings', icon: 'fa-cogs', label: 'Settings' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)} 
                        className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${activeTab === item.id ? 'bg-gov-secondary shadow-lg' : 'hover:bg-blue-800'}`}
                    >
                        <i className={`fas ${item.icon} w-5 text-center`}></i> {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-4 bg-blue-900">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-300 hover:text-white transition">
                    <i className="fas fa-sign-out-alt"></i> Secure Logout
                </button>
            </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 relative">
             <div className="bg-white shadow p-4 md:hidden flex justify-between sticky top-0 z-10 items-center">
                <span className="font-bold text-gov-primary">Admin Panel</span>
                <button onClick={handleLogout} className="text-red-500"><i className="fas fa-sign-out-alt"></i></button>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
                {activeTab === 'overview' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Tax</h3>
                            <p className="text-3xl font-bold text-gray-800">₹{taxRecords.filter(t => t.status === 'Pending').reduce((a, b) => a + b.amount, 0)}</p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-red-500 cursor-pointer" onClick={() => setActiveTab('complaints')}>
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Open Complaints</h3>
                            <p className="text-3xl font-bold text-gray-800">{complaints.filter(c => c.status === 'Open').length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-green-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Schemes Active</h3>
                            <p className="text-3xl font-bold text-gray-800">{schemes.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg border-b-4 border-orange-500">
                            <h3 className="text-gray-500 text-sm font-bold uppercase">Meetings</h3>
                            <p className="text-3xl font-bold text-gray-800">{meetings.length}</p>
                        </div>
                )}

                {/* --- COMPLAINTS SECTION --- */}
                {activeTab === 'complaints' && (
                    <div className="bg-white p-6 rounded-lg shadow">
                         <div className="flex justify-between items-center mb-6 border-b pb-2">
                             <h3 className="text-xl font-bold text-gov-primary"><i className="fas fa-clipboard-list mr-2"></i> Citizen Complaints (Grievance Redressal)</h3>
                             <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">Total: {complaints.length}</span>
                         </div>
                         
                         {complaints.length === 0 ? (
                             <div className="text-center py-12 text-gray-500">
    <i className="fas fa-check-circle text-4xl mb-3 text-green-500"></i>
    <p>No complaints found.</p>
</div>
) : (
<div className="grid gap-6">
    {complaints.map((c) => (
        <div
            key={c.id}
            className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 ${
                c.status === "Resolved"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-red-200 shadow-sm"
            }`}
        >
            {/* Photos Column */}
            <div className="flex-shrink-0 flex gap-2 md:flex-col md:w-32">
                {c.applicantPhotoUrl ? (
                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden mx-auto border">
                        <img
                            src={c.applicantPhotoUrl}
                            className="w-full h-full object-cover"
                            alt="Applicant"
                        />
                    </div>
                ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mx-auto text-gray-400 text-xs text-center p-1">
                        No Photo
                    </div>
                )}

                {c.docUrl && (
                    <a
                        href={c.docUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-blue-100 text-blue-700 p-2 rounded text-center hover:bg-blue-200"
                    >
                        <i className="fas fa-file-alt mr-1"></i> View Doc
                    </a>
                )}
            </div>

            {/* Info Column */}
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-gray-800">
                                {c.applicantName}
                            </h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                                {c.category}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            <i className="fas fa-phone mr-1"></i> {c.mobile}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Date: {c.date} | ID: {c.id}
                        </p>
                    </div>

                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            c.status === "Open"
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-green-500 text-white"
                        }`}
                    >
                        {c.status}
                    </span>
                </div>

                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 border">
                    <span className="font-bold block text-xs text-gray-500 mb-1">
                        COMPLAINT DETAILS:
                    </span>
                    {c.description}
                </div>

                <div className="mt-4 flex gap-2 justify-end">
                    <button
                        onClick={() =>
                            toggleComplaintStatus(c.id, c.status)
                        }
                        className={`px-4 py-2 rounded text-sm font-bold shadow transition ${
                            c.status === "Open"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                    >
                        {c.status === "Open" ? (
                            <>
                                <i className="fas fa-check mr-2"></i>
                                Mark Resolved
                            </>
                        ) : (
                            <>
                                <i className="fas fa-redo mr-2"></i>
                                Re-open
                            </>
                        )}
                    </button>

                    <button
                        onClick={(e) => deleteComplaint(e, c.id)}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-red-100 hover:text-red-600 transition"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
             )}

                                    <label className="text-xs font-bold text-gray-500">Designation (Pad)</label>
                                    <input className="border p-2 w-full rounded" placeholder="Position" value={newMember.position || ''} onChange={e => setNewMember({...newMember, position: e.target.value})} />
                                </div>
                                    <label className="text-xs font-bold text-gray-500">Mobile Number</label>
                                    <input className="border p-2 w-full rounded" placeholder="Mobile" value={newMember.mobile || ''} onChange={e => setNewMember({...newMember, mobile: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Address (Pata)</label>
                                    <input className="border p-2 w-full rounded" placeholder="Address" value={newMember.address || ''} onChange={e => setNewMember({...newMember, address: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500">Member Category</label>
                                    <select className="border p-2 w-full rounded bg-white" value={newMember.type} onChange={e => setNewMember({...newMember, type: e.target.value as any})}>
                                        <option value="committee">Gram Panchayat Committee (ग्रामपंचायत कमेटी)</option>
                                        <option value="pesa">PESA Committee (पेसा कमेटी)</option>
                                        <option value="panchayat_samiti">Panchayat Samiti (पंचायत समिती)</option>
                                        <option value="ps_staff">Panchayat Samiti Staff (पंचायत समिती कर्मचारी)</option>
                                        <option value="staff">Gram Panchayat Staff (कर्मचारी)</option>
                                    </select>
                                </div>
                            <FileUpload label="Member Photo" accept="image/*" onFileSelect={(url: string) => setNewMember({...newMember, photoUrl: url})} />
                            <button onClick={handleAddMember} className="mt-2 bg-gov-primary text-white px-6 py-2 rounded font-bold shadow-lg">Add Member</button>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {members.map(m => (
                                <div key={m.id} className="border p-3 rounded text-center relative group hover:shadow-md transition bg-gray-50">
                                    <button type="button" onClick={(e) => deleteMember(e, m.id)} className="absolute top-1 right-1 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700 z-10 shadow"><i className="fas fa-trash text-xs"></i></button>
                                    <img src={m.photoUrl} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white shadow-sm" />
                                    <div className="font-bold text-sm mt-1">{m.name}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">{m.position}</div>
                                    <div className="text-xs text-gray-400">{m.mobile}</div>
                                    <div className={`text-xs mt-1 font-bold px-2 py-0.5 rounded inline-block
                                        ${m.type === 'committee' ? 'bg-orange-100 text-orange-800' : 
                                          m.type === 'pesa' ? 'bg-green-100 text-green-800' :
                                          m.type === 'panchayat_samiti' ? 'bg-purple-100 text-purple-800' :
                                          m.type === 'ps_staff' ? 'bg-purple-200 text-purple-900' :
                                          'bg-blue-100 text-blue-800'}`}>
                                        {m.type === 'committee' ? 'GP Committee' : 
                                         m.type === 'pesa' ? 'PESA' : 
                                         m.type === 'panchayat_samiti' ? 'P. Samiti' : 
                                         m.type === 'ps_staff' ? 'PS Staff' : 'Staff'}
                                    </div>
                              ))}
                    

                {/* --- SETTINGS SECTION --- */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-bold mb-4 text-gov-primary">Global Location & Contact Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500">Panchayat Name</label>
                                    <input className="w-full border p-2 rounded" value={settings.panchayatName} onChange={e => setSettings({...settings, panchayatName: e.target.value})} />
                                </div>
                                    <label className="text-xs font-bold text-gray-500">Taluka (Panchayat Samiti)</label>
                                    <input className="w-full border p-2 rounded" value={settings.taluka} onChange={e => setSettings({...settings, taluka: e.target.value})} />
                                </div>
                                    <label className="text-xs font-bold text-gray-500">District</label>
                                    <input className="w-full border p-2 rounded" value={settings.district} onChange={e => setSettings({...settings, district: e.target.value})} />
                                </div>
                                
                                    <label className="text-xs font-bold text-gray-500">Contact Email</label>
                                    <input className="w-full border p-2 rounded" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                     <label className="text-xs font-bold text-gray-500">Scrolling Notice Text (Marquee)</label>
                                     <input className="w-full border p-2 rounded bg-yellow-50" value={settings.marqueeText || ''} onChange={e => setSettings({...settings, marqueeText: e.target.value})} placeholder="Enter scrolling notice text here..." />
                                </div>
                                
                                <div className="md:col-span-2 border-t pt-4 mt-2">
                                     <label className="text-sm font-bold text-green-800 block mb-2"><i className="fab fa-google-pay mr-1"></i> Tax UPI IDs (Tax-wise Collection)</label>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                         <div>
                                            <label className="text-xs font-bold text-gray-500">House Tax UPI ID (घरपट्टी)</label>
                                            <input className="w-full border-2 border-orange-200 p-2 rounded bg-orange-50" value={settings.upiIdHouse || ''} onChange={e => setSettings({...settings, upiIdHouse: e.target.value})} placeholder="e.g. house@oksbi" />
                                         </div>
                                         
                                            <label className="text-xs font-bold text-gray-500">Water Tax UPI ID (पाणीपट्टी)</label>
                                            <input className="w-full border-2 border-blue-200 p-2 rounded bg-blue-50" value={settings.upiIdWater || ''} onChange={e => setSettings({...settings, upiIdWater: e.target.value})} placeholder="e.g. water@oksbi" />
                                         </div>
                                         <div>
                                            <label className="text-xs font-bold text-gray-500">Special Water Tax UPI ID (खास पाणीपट्टी)</label>
                                            <input className="w-full border-2 border-purple-200 p-2 rounded bg-purple-50" value={settings.upiIdSpecialWater || ''} onChange={e => setSettings({...settings, upiIdSpecialWater: e.target.value})} placeholder="e.g. special@oksbi" />
                                         </div>

                         {/* Important Links moved to Settings */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gov-primary">External Certificate Links</h3>
                             <div className="flex flex-col gap-2 mb-4 bg-gray-50 p-4 rounded">
                                <input className="border p-2 w-full" placeholder="Link Title (e.g. Birth Certificate)" value={newLink.title || ''} onChange={e => setNewLink({...newLink, title: e.target.value})} />
                                <input className="border p-2 w-full" placeholder="URL (https://...)" value={newLink.url || ''} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                                <input className="border p-2 w-full" placeholder="Description (Brief info about certificate)" value={newLink.description || ''} onChange={e => setNewLink({...newLink, description: e.target.value})} />
                                <button onClick={handleAddLink} className="bg-blue-600 text-white px-4 py-2 rounded font-bold w-full md:w-auto">Add Link</button>
                             </div>
                             <div className="space-y-2">
                                {links.map(l => (
                                    <div key={l.id} className="bg-blue-50 text-blue-800 p-3 rounded flex justify-between items-center border border-blue-100">
                                        <div>
                                            <div className="font-bold">{l.title}</div>
                                            <div className="text-xs text-blue-600">{l.url}</div>
                                            {l.description && <div className="text-xs text-gray-500 mt-1 italic">{l.description}</div>}
                                        </div>
                                        <button type="button" onClick={(e) => deleteLink(e, l.id)} className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700 ml-2 text-xs">&times;</button>
                                    </div>
                                ))}
                             </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-bold mb-4 text-gov-primary">Branding (Logo & Slider)</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <img src={settings.logoUrl} className="w-16 h-16 border p-1" />
                                <div className="flex-1">
                                    <FileUpload label="Update Logo" accept="image/*" onFileSelect={(url: string) => setSettings({...settings, logoUrl: url})} />
                                </div>
                            
                            {/* Added Flag Upload */}
                            <div className="flex items-center gap-4 mb-6 border-t pt-4">
                                <img src={settings.flagUrl || 'https://media.giphy.com/media/l3vRlT2k2L35Cnn5C/giphy.gif'} className="w-16 h-12 border p-1 object-cover" />
                                <div className="flex-1">
                                    <FileUpload label="Update Tiranga (GIF/Image)" accept="image/*" onFileSelect={(url: string) => setSettings({...settings, flagUrl: url})} />
                                </div>

                            <div className="border-t pt-4">
                                <label className="font-bold block mb-2">Slider Images</label>
                                <div className="flex gap-2 mb-2 overflow-x-auto">
                                    {settings.sliderImages.map((src, i) => (
                                        <img key={i} src={src} className="w-20 h-12 object-cover border" />
                                    ))}
                                </div>
                                <FileUpload label="Add Slider Image" accept="image/*" onFileSelect={(url: string) => setSettings({...settings, sliderImages: [...settings.sliderImages, url]})} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
