
export interface Member {
  id: string;
  name: string;
  position: string;
  mobile: string;
  address?: string; // Added Address
  photoUrl: string;
  type: 'committee' | 'staff' | 'pesa' | 'panchayat_samiti' | 'ps_staff'; // Added ps_staff
}

export interface TaxRecord {
  id: string;
  propertyId: string;
  ownerName: string;
  mobile: string;
  paymentType: 'House Tax' | 'Water Tax' | 'Special Water Tax'; // Added Special Water Tax
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'youtube';
  publishDate: string;
  author: string;
  category?: 'General' | 'Development' | 'Notice';
}

export interface Complaint {
  id: string;
  applicantName: string;
  mobile: string;
  category: string; // Added Category
  description: string;
  applicantPhotoUrl?: string; // Added Applicant Photo
  docUrl?: string;
  status: 'Open' | 'Resolved';
  date: string;
}

// New Types for specific sections
export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  deadline?: string;
  docUrl?: string; // PDF or Image
}

export interface MeetingRecord {
  id: string;
  title: string;
  type: 'Gram Sabha' | 'Masik Sabha' | 'Bal Sabha' | 'Ward Sabha';
  date: string;
  description: string;
  mediaUrl?: string; // Photos/Videos of the meeting
  mediaType: 'image' | 'video' | 'youtube';
}

export interface ImportantLink {
  id: string;
  title: string; 
  url: string;
  description?: string; // Added Description
}

export interface AppSettings {
  logoUrl: string;
  flagUrl?: string; // Added for Custom Flag
  sliderImages: string[];
  panchayatName: string;
  marqueeText?: string; // Added for Scrolling Notice
  address: string;
  district: string;
  taluka: string;
  email: string;
  contactNumber: string;
  mapEmbedUrl: string; // For location iframe
  upiIdHouse?: string; // For House Tax (Gharpatti)
  upiIdWater?: string; // For Water Tax (Panipatti)
  upiIdSpecialWater?: string; // For Special Water Tax (Khas Panipatti)
  taxListUrl?: string; // Added for uploading Tax List PDF
}