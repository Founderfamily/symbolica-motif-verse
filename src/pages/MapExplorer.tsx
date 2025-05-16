
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InteractiveMap from '@/components/map/InteractiveMap';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { MapPin, Filter, ZoomIn, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MapExplorer = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {t('mapExplorer.title')}
              </h1>
              <p className="text-slate-600 max-w-2xl">
                {t('mapExplorer.description')}
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="search" 
                  placeholder={t('mapExplorer.searchLocation')} 
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                {t('mapExplorer.filters')}
              </Button>
              <Button variant="outline" className="gap-1">
                <ZoomIn className="h-4 w-4" />
                {t('mapExplorer.zoom')}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="map">
            <TabsList className="mb-4">
              <TabsTrigger value="map">{t('mapExplorer.mapView')}</TabsTrigger>
              <TabsTrigger value="list">{t('mapExplorer.listView')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-6">
              <div className="flex items-center text-sm text-slate-500 mb-4">
                <MapPin className="h-4 w-4 mr-1 text-amber-600" />
                <span>{t('mapExplorer.symbolCount', { count: 5 })}</span>
                <span className="mx-2">•</span>
                <span>{t('mapExplorer.countriesCount', { count: 5 })}</span>
              </div>
              
              <InteractiveMap />
              
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800">
                <p className="text-sm">
                  {t('mapExplorer.betaNotice')}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-slate-600 text-center py-10">
                  {t('mapExplorer.listViewComingSoon')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{t('mapExplorer.popularRegions')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Europe', 'Asia', 'Africa', 'Americas'].map((region) => (
                <Button 
                  key={region} 
                  variant="outline" 
                  className="h-auto py-3 justify-start"
                >
                  <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                  {region}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MapExplorer;
