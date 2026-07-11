import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, CreditCard, Bell, 
  Clock, ShoppingBag, Heart, 
  Ticket, Wallet, Gift, 
  HelpCircle, MessageSquare, AlertTriangle, HelpCircle as FaqIcon,
  Globe, Shield, FileText, Info,
  Share2, Star, LogOut, ArrowLeft,
  Crown, ChevronRight
} from 'lucide-react';
import { userProfileMock } from '../mock/userProfileMock';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSection from '../components/profile/ProfileSection';
import ProfileMenuItem from '../components/profile/ProfileMenuItem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(userProfileMock.notificationsEnabled);

  const handleItemClick = (itemTitle) => {
    console.log(`Clicked on ${itemTitle}`);
    // Handle navigation or actions here
  };

  const renderToggle = (checked, onChange) => (
    <div 
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );

  const sections = [
    {
      title: "Account",
      items: [
        { title: "Personal Information", icon: User },
        { title: "Saved Addresses", icon: MapPin },
        { title: "Payment Methods", icon: CreditCard },
        { 
          title: "Notifications", 
          icon: Bell, 
          rightElement: renderToggle(notificationsEnabled, setNotificationsEnabled)
        },
      ]
    },
    {
      title: "Orders",
      items: [
        { title: "Order History", icon: Clock },
        { title: "Active Orders", icon: ShoppingBag, rightElement: <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> },
        { title: "Favorite Restaurants", icon: Heart },
      ]
    },
    {
      title: "Rewards",
      items: [
        { title: "Coupons", icon: Ticket, rightElement: <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">{userProfileMock.activeCoupons} New</span> },
        { title: "Wallet", icon: Wallet, rightElement: <span className="font-extrabold text-slate-800">${userProfileMock.walletBalance.toFixed(2)}</span> },
        { title: "Referral & Earn", icon: Gift },
      ]
    },
    {
      title: "Support",
      items: [
        { title: "Help Center", icon: HelpCircle },
        { title: "Contact Support", icon: MessageSquare },
        { title: "Report an Issue", icon: AlertTriangle },
        { title: "FAQs", icon: FaqIcon },
      ]
    },
    {
      title: "Settings",
      items: [
        { title: "Language", icon: Globe },
        { title: "Privacy Policy", icon: Shield },
        { title: "Terms & Conditions", icon: FileText },
        { title: "About App", icon: Info },
      ]
    },
    {
      title: "Actions",
      items: [
        { title: "Share App", icon: Share2 },
        { title: "Rate App", icon: Star },
        { title: "Logout", icon: LogOut, danger: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-md mx-auto p-4 sm:p-6 md:max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pt-4 px-2">
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        </div>
        
        <ProfileHeader user={userProfileMock} />

        {/* Premium Upsell Banner */}
        <div className="mb-8 cursor-pointer relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 flex items-center justify-between shadow-xl shadow-slate-900/20 group transform transition-transform hover:-translate-y-1">
          {/* Subtle gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Crown fill="white" strokeWidth={1.5} size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                RouteBite <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">PRO</span>
              </h3>
              <p className="text-slate-300 text-sm font-medium">$0 Delivery Fees • Try 1 month free</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400 group-hover:text-white transition-colors relative z-10" />
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <ProfileSection key={index} title={section.title}>
              {section.items.map((item, itemIndex) => (
                <ProfileMenuItem 
                  key={itemIndex}
                  icon={item.icon}
                  title={item.title}
                  danger={item.danger}
                  rightElement={item.rightElement}
                  onClick={() => handleItemClick(item.title)}
                />
              ))}
            </ProfileSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
