import React, { useEffect, useState } from 'react';
import { AppSettings, Member, ImportantLink, BlogPost } from '../types';
import { Link } from 'react-router-dom';

interface HomeProps {
  settings: AppSettings;
  members: Member[];
  links: ImportantLink[];
  notices: BlogPost[];
}

export const Home: React.FC<HomeProps> = ({ settings, members, links, notices }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slider Logic (Right to Left)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % settings.sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [settings.sliderImages]);

  const gpCommittee = members.filter(m => m.type === 'committee');
  const pesaCommittee = members.filter(m => m.type === 'pesa');
  const panchayatSamiti = members.filter(m => m.type === 'panchayat_samiti');
  const psStaff = members.filter(m => m.type === 'ps_staff');
  const staff = members.filter(m => m.type === 'staff');

  const MemberCard = ({ member, colorClass, borderColor }: { member: Member, colorClass: string, borderColor: string }) => (
      <div className={`bg-white rounded-lg shadow-lg p-4 text-center border-t-4 ${borderColor} hover:shadow-xl transition relative group`}>
        <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-3 bg-gray-200 border-2 border-gray-100" />
        <h4 className="font-bold text-gray-800 text-base">{member.name}</h4>
        <p className={`${colorClass} font-bold text-sm uppercase`}>{member.position}</p>
        <p className="text-gray-500 text-xs mt-1"><i className="fas fa-phone-alt mr-1"></i> {member.mobile}</p>
        {member.address && <p className="text-gray-400 text-xs mt-0.5"><i className="fas fa-map-marker-alt mr-1"></i> {member.address}</p>}
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-0">
      
      {/* Hero Slider */}
      <div className="relative h-[300px] md:h-[500px] overflow-hidden bg-gray-900">
        {settings.sliderImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
            {/* Removed Text Overlay */}
            <div className="absolute inset-0 bg-black/20"></div> 
          </div>
        ))}
         {/* Slider Controls */}
         <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white z-10" onClick={() => setCurrentSlide(prev => (prev === 0 ? settings.sliderImages.length - 1 : prev - 1))}><i className="fas fa-chevron-left"></i></button>
         <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white z-10" onClick={() => setCurrentSlide(prev => (prev + 1) % settings.sliderImages.length)}><i className="fas fa-chevron-right"></i></button>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
             {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-10">
                {[
                    { label: 'Pay Tax', icon: 'fa-rupee-sign', link: '#/tax', color: 'bg-green-600' },
                    { label: 'Complaints', icon: 'fa-bullhorn', link: '#/complaint', color: 'bg-red-600' },
                    { label: 'Schemes', icon: 'fa-hand-holding-heart', link: '#/schemes', color: 'bg-blue-600' },
                    { label: 'Meetings', icon: 'fa-users', link: '#/meetings', color: 'bg-orange-600' },
                ].map((action, i) => (
                    <a key={i} href={action.link} className={`${action.color} text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer`}>
                    <i className={`fas ${action.icon} text-2xl mb-2`}></i>
                    <span className="font-semibold text-sm md:text-base">{action.label}</span>
                    </a>
                ))}
            </div>

            {/* GP Committee Section */}
            {gpCommittee.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-6 border-b pb-2 border-gov-primary">
                    <h3 className="text-2xl font-bold text-gov-primary uppercase"><i className="fas fa-users mr-2"></i>Gram Panchayat Committee</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {gpCommittee.map((member) => (
                        <MemberCard key={member.id} member={member} colorClass="text-gov-secondary" borderColor="border-gov-primary" />
                    ))}
                </div>
            </section>
            )}

            {/* PESA Committee Section */}
            {pesaCommittee.length > 0 && (
            <section>
                <div className="flex items-center justify-between mb-6 border-b pb-2 border-green-600">
                    <h3 className="text-2xl font-bold text-green-800 uppercase"><i className="fas fa-tree mr-2"></i>PESA Committee (पेसा समिती)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {pesaCommittee.map((member) => (
                        <MemberCard key={member.id} member={member} colorClass="text-green-600" borderColor="border-green-600" />
                    ))}
                </div>
            </section>
            )}

            {/* Panchayat Samiti Section */}
            {(panchayatSamiti.length > 0 || psStaff.length > 0) && (
            <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-6 border-b pb-2 border-purple-600">
                    <h3 className="text-2xl font-bold text-purple-800 uppercase"><i className="fas fa-landmark mr-2"></i>Panchayat Samiti Kurkheda</h3>
                </div>
                
                {/* PS Members */}
                {panchayatSamiti.length > 0 && (
                    <div className="mb-6">
                         <h4 className="font-bold text-purple-700 mb-3"><i className="fas fa-user-friends mr-2"></i> Members (सदस्य)</h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {panchayatSamiti.map((member) => (
                                <MemberCard key={member.id} member={member} colorClass="text-purple-600" borderColor="border-purple-600" />
                            ))}
                        </div>
                    </div>
                )}

                {/* PS Staff (New Section) */}
                {psStaff.length > 0 && (
                    <div>
                         <h4 className="font-bold text-purple-700 mb-3"><i className="fas fa-user-tie mr-2"></i> Staff (कर्मचारी)</h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {psStaff.map((member) => (
                                <MemberCard key={member.id} member={member} colorClass="text-purple-800" borderColor="border-purple-800" />
                            ))}
                        </div>
                    </div>
                )}
            </section>
            )}

             {/* Staff Section */}
             {staff.length > 0 && (
             <section>
                <div className="flex items-center justify-between mb-6 border-b pb-2 border-blue-600">
                    <h3 className="text-2xl font-bold text-blue-800 uppercase"><i className="fas fa-user-tie mr-2"></i>Gram Panchayat Staff (कर्मचारी)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <MemberCard key={member.id} member={member} colorClass="text-blue-600" borderColor="border-blue-600" />
                ))}
                </div>
            </section>
            )}
        </div>

        {/* Sidebar: Notices & Links */}
        <div className="space-y-8">
             {/* Notices Board */}
             <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gov-secondary text-white p-3 font-bold flex items-center justify-between">
                    <span><i className="fas fa-bell mr-2"></i> Latest Notices</span>
                    <span className="text-xs bg-white text-red-600 px-2 py-0.5 rounded animate-pulse">LIVE</span>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto">
                    {notices.filter(n => n.category === 'Notice').length > 0 ? (
                        <ul className="space-y-3">
                            {notices.filter(n => n.category === 'Notice').map(notice => (
                                <li key={notice.id} className="border-b pb-3 last:border-0 hover:bg-gray-50 p-1 rounded">
                                    <p className="text-sm font-bold text-gray-800 hover:text-blue-600 cursor-pointer mb-1">{notice.title}</p>
                                    <p className="text-xs text-gray-600 line-clamp-2">{notice.content}</p>
                                    {notice.mediaUrl && (
                                        <div className="mt-2">
                                            <a href={notice.mediaUrl} target="_blank" rel="noreferrer" className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 inline-block">
                                                <i className="fas fa-paperclip mr-1"></i> View Attachment
                                            </a>
                                        </div>
                                    )}
                                    <span className="text-xs text-red-500 font-semibold block mt-1"><i className="far fa-clock mr-1"></i> {notice.publishDate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 text-center">No active notices.</p>
                    )}
                </div>
             </div>

             {/* Important Links */}
             <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-blue-600">
                 <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Important Certificates</h4>
                 <ul className="space-y-3">
                     {links.map(link => (
                         <li key={link.id}>
                             <a href={link.url} target="_blank" rel="noreferrer" className="block p-3 bg-gray-50 hover:bg-blue-50 text-blue-800 rounded transition border border-gray-200 shadow-sm">
                                 <div className="flex items-center font-bold text-sm">
                                     <i className="fas fa-external-link-alt mr-2 text-gov-secondary"></i> {link.title}
                                 </div>
                                 {link.description && <p className="text-xs text-gray-500 mt-1 ml-6">{link.description}</p>}
                             </a>
                         </li>
                     ))}
                 </ul>
             </div>
        </div>
      </div>

      {/* Footer / Location */}
      <footer className="bg-gov-primary text-white mt-16">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-4 border-b border-blue-700 pb-2 inline-block">Contact Us</h4>
              <p className="font-bold text-lg">{settings.panchayatName}</p>
              <p className="text-gray-300 text-sm mt-2">
                <i className="fas fa-map-marker-alt w-5"></i> {settings.address}<br/>
                <span className="ml-5">Panchayat Samiti: {settings.taluka}</span><br/>
                <span className="ml-5">District: {settings.district}</span>
              </p>
              <p className="text-gray-300 text-sm mt-2">
                <i className="fas fa-envelope w-5"></i> {settings.email}<br/>
                <i className="fas fa-phone w-5"></i> {settings.contactNumber}
              </p>
            </div>
            
            <div>
               <h4 className="font-bold text-xl mb-4 border-b border-blue-700 pb-2 inline-block">Location Map</h4>
               <div className="bg-gray-700 h-40 rounded overflow-hidden">
                  <iframe 
                    src={settings.mapEmbedUrl} 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy"
                    title="Map"
                  ></iframe>
               </div>
            </div>

            <div>
              <h4 className="font-bold text-xl mb-4 border-b border-blue-700 pb-2 inline-block">Govt Links</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                 <a href="https://www.india.gov.in/" target="_blank" className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-700">India.gov.in</a>
                 <a href="https://www.maharashtra.gov.in/" target="_blank" className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-700">Maharashtra Govt</a>
                 <a href="https://gadchiroli.gov.in/" target="_blank" className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-700">Gadchiroli Dist</a>
              </div>
              <div className="mt-6 text-xs text-gray-400 flex justify-between items-end">
                <div>
                  &copy; {new Date().getFullYear()} {settings.panchayatName}.<br/>
                  Designed for Digital India Initiative.
                </div>
                {/* HIDDEN ADMIN LOGIN TRIGGER - SECURE ENTRY */}
                <Link to="/admin" className="opacity-10 hover:opacity-100 transition-opacity text-white" title="Staff Login">
                   <i className="fas fa-shield-alt"></i>
                </Link>
              </div>
            </div>
        </div>
      </footer>
      
    </div>
  );
};