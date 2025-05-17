
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import OpenSourceBadge from '@/components/ui/open-source-badge';

// Import new homepage sections
import HeroSection from '@/components/sections/HeroSection';
import SymbolExplorerPreview from '@/components/sections/SymbolExplorerPreview';
import MuseumCommunityHub from '@/components/sections/MuseumCommunityHub';
import AIDiscoveryTools from '@/components/sections/AIDiscoveryTools';
import CulturalMapPreview from '@/components/sections/CulturalMapPreview';
import StreamlinedHowItWorks from '@/components/sections/StreamlinedHowItWorks';
import CommunityAchievements from '@/components/sections/CommunityAchievements';
import ResearchEducationTools from '@/components/sections/ResearchEducationTools';
import DynamicCallToAction from '@/components/sections/DynamicCallToAction';
import CompactFooter from '@/components/sections/CompactFooter';

// Newsletter component
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Open Source Badge */}
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute right-6 top-4 z-50">
          <OpenSourceBadge />
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Symbol Explorer Preview */}
      <SymbolExplorerPreview />
      
      {/* Museum & Community Hub */}
      <MuseumCommunityHub />
      
      {/* AI-Powered Discovery Tools */}
      <AIDiscoveryTools />
      
      {/* Cultural Map Preview */}
      <CulturalMapPreview />
      
      {/* Streamlined How It Works */}
      <StreamlinedHowItWorks />
      
      {/* Community Achievements */}
      <CommunityAchievements />
      
      {/* Research & Education Tools */}
      <ResearchEducationTools />
      
      {/* Dynamic Call-to-Action */}
      <DynamicCallToAction />
    </div>
  );
};

export default HomePage;
