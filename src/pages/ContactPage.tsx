
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, HelpCircle, Users, Send } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useToast } from '@/hooks/use-toast';

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const contactCategories = [
    { id: 'general', label: 'Question générale', icon: HelpCircle },
    { id: 'support', label: 'Support technique', icon: MessageSquare },
    { id: 'community', label: 'Communauté', icon: Users },
    { id: 'partnership', label: 'Partenariat', icon: Mail }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <I18nText translationKey="contact.title">Contactez-nous</I18nText>
        </h1>
        <p className="text-muted-foreground">
          <I18nText translationKey="contact.subtitle">
            Nous sommes là pour vous aider et répondre à vos questions
          </I18nText>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                <I18nText translationKey="contact.form.title">Envoyer un message</I18nText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Type de demande</label>
                  <div className="grid grid-cols-2 gap-3">
                    {contactCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleInputChange('category', category.id)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            formData.category === category.id
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nom complet</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sujet</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Résumé de votre demande"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Décrivez votre demande en détail..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email général</h4>
                  <p className="text-sm text-muted-foreground">contact@symbolica-museum.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Support technique</h4>
                  <p className="text-sm text-muted-foreground">support@symbolica-museum.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Communauté</h4>
                  <p className="text-sm text-muted-foreground">community@symbolica-museum.org</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temps de réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Questions générales</span>
                  <span className="text-muted-foreground">24-48h</span>
                </div>
                <div className="flex justify-between">
                  <span>Support technique</span>
                  <span className="text-muted-foreground">12-24h</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgences</span>
                  <span className="text-muted-foreground">2-4h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
