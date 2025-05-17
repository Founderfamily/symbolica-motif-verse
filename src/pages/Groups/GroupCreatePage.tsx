
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createInterestGroup } from '@/services/interestGroupService';
import { CirclePicker } from 'react-color';

const GroupCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
    theme_color: '#f59e0b', // Default amber color
  });
  
  const colorOptions = [
    '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', 
    '#2dd4bf', '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa', 
    '#e879f9', '#f472b6'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_public: checked }));
  };
  
  const handleColorChange = (color: any) => {
    setFormData(prev => ({ ...prev, theme_color: color.hex }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('groups.validation.nameRequired'));
      return;
    }
    
    try {
      setLoading(true);
      const newGroup = await createInterestGroup(formData);
      navigate(`/groups/${newGroup.slug}`);
    } catch (error) {
      console.error('Error creating group:', error);
      // Error is already handled in the service
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">{t('groups.create.title')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('groups.create.formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('groups.create.name')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('groups.create.namePlaceholder')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('groups.create.description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t('groups.create.descriptionPlaceholder')}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme_color">{t('groups.create.themeColor')}</Label>
                <div className="mt-2">
                  <CirclePicker
                    color={formData.theme_color}
                    onChangeComplete={handleColorChange}
                    colors={colorOptions}
                    width="100%"
                  />
                </div>
                <div 
                  className="mt-3 h-8 rounded-md" 
                  style={{ backgroundColor: formData.theme_color }}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_public">{t('groups.create.isPublic')}</Label>
              </div>
              
              <div className="pt-2 flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/groups')}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  {loading ? t('common.creating') : t('common.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GroupCreatePage;
