
import { AppSettings, BlogPost, ImportantLink, MeetingRecord, Member, Scheme, TaxRecord } from "./types";

export const INITIAL_SETTINGS: AppSettings = {
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
  flagUrl: "https://media.giphy.com/media/l3vRlT2k2L35Cnn5C/giphy.gif",
  sliderImages: [
    "https://picsum.photos/1200/500?random=1",
    "https://picsum.photos/1200/500?random=2",
    "https://picsum.photos/1200/500?random=3"
  ],
  panchayatName: "ग्रामपंचायत चिखली",
  marqueeText: "अधिकृत पोर्टलवर आपले स्वागत आहे | आपले कर वेळेवर भरा | ग्रामसभेत सहभाग नोंदवा.",
  address: "At Post Chikhali",
  taluka: "Kurkheda",
  district: "Gadchiroli",
  email: "contact@gpchikhali.in",
  contactNumber: "07138-XXXXXX",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.978936359196!2d80.0!3d20.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDM2JzE2LjMiTiA3OSw1OSw1MS41IkU!5e0!3m2!1sen!2sin!4v1633000000000!5m2!1sen!2sin",
  upiIdHouse: "sarpanch.house@oksbi",
  upiIdWater: "sarpanch.water@oksbi",
  upiIdSpecialWater: "sarpanch.special@oksbi",
  taxListUrl: "" 
};

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Shri. Rajesh Patil', position: 'Sarpanch', mobile: '9876543210', address: 'Main Road, Chikhali', photoUrl: 'https://picsum.photos/200/200?random=10', type: 'committee' },
  { id: '2', name: 'Miss. Priya Singh', position: 'Gram Sevak', mobile: '9876543214', address: 'Panchayat Quarter', photoUrl: 'https://picsum.photos/200/200?random=14', type: 'staff' },
  { id: '3', name: 'Shri. Mohan Rao', position: 'PESA Adhyaksh', mobile: '9988776611', address: 'Ward No 2', photoUrl: 'https://picsum.photos/200/200?random=15', type: 'pesa' },
  { id: '4', name: 'Shri. Ashok Deshmukh', position: 'Sabhapati (PS)', mobile: '9988776600', address: 'Kurkheda', photoUrl: 'https://picsum.photos/200/200?random=20', type: 'panchayat_samiti' },
  { id: '5', name: 'Shri. Vijay Kumar', position: 'Clerk (PS)', mobile: '9988776601', address: 'Kurkheda Office', photoUrl: 'https://picsum.photos/200/200?random=21', type: 'ps_staff' },
];

export const INITIAL_TAX_RECORDS: TaxRecord[] = [
  { id: '1', propertyId: 'PROP-12345', ownerName: 'Ramesh Pawar', mobile: '9988776655', paymentType: 'House Tax', amount: 1500, status: 'Pending', date: '2023-10-01' },
];

export const INITIAL_BLOGS: BlogPost[] = [
  { 
    id: '1', 
    title: 'Village Cleanliness Drive', 
    content: 'We are organizing a cleanliness drive this Sunday. All villagers are requested to participate.', 
    mediaUrl: '', 
    mediaType: 'image', 
    publishDate: '2023-10-25',
    author: 'Admin',
    category: 'Notice'
  }
];

export const INITIAL_SCHEMES: Scheme[] = [
  { id: '1', name: 'Pradhan Mantri Awas Yojana', description: 'Housing for all.', eligibility: 'BPL Card Holders', deadline: '2024-03-31' },
  { id: '2', name: 'Kisan Samman Nidhi', description: 'Financial support for farmers.', eligibility: 'Land ownership < 2 hectares' }
];

export const INITIAL_MEETINGS: MeetingRecord[] = [
  { id: '1', title: 'Special Gram Sabha on Water Issues', type: 'Gram Sabha', date: '2023-11-15', description: 'Discussion on new pipeline.', mediaType: 'image' }
];

export const INITIAL_LINKS: ImportantLink[] = [
  { id: '1', title: 'Birth/Death Certificate', url: 'https://crsorgi.gov.in/web/index.php/auth/login', description: 'Apply for birth and death certificates online.' },
  { id: '2', title: '7/12 Utara (Mahabhulekh)', url: 'https://bhulekh.mahabhumi.gov.in/', description: 'Download digital 7/12 land records.' },
  { id: '3', title: 'Ration Card Online', url: 'https://rcms.mahafood.gov.in/', description: 'Manage your ration card details.' }
];