
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GroupInviteDialogProps {
  groupId: string;
  groupName: string;
  className?: string;
}

export const GroupInviteDialog: React.FC<GroupInviteDialogProps> = ({
  groupId,
  groupName,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvites = async () => {
    if (!emails.trim()) {
      toast.error('Veuillez entrer au moins une adresse email');
      return;
    }

    setIsLoading(true);
    
    try {
      const emailList = emails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      if (emailList.length === 0) {
        toast.error('Veuillez entrer des adresses email valides');
        return;
      }

      // Appel à une edge function pour envoyer les invitations
      const { data, error } = await supabase.functions.invoke('send-group-invites', {
        body: {
          groupId,
          groupName,
          emails: emailList,
          customMessage: message,
          inviterEmail: (await supabase.auth.getUser()).data.user?.email
        }
      });

      if (error) throw error;

      toast.success(`${emailList.length} invitation(s) envoyée(s) avec succès !`);
      setIsOpen(false);
      setEmails('');
      setMessage('');
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Erreur lors de l\'envoi des invitations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter des membres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Inviter au groupe "{groupName}"
          </DialogTitle>
          <DialogDescription>
            Invitez vos contacts à rejoindre ce groupe d'intérêt par email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="emails">
              Adresses email (une par ligne ou séparées par des virgules)
            </Label>
            <Textarea
              id="emails"
              placeholder="exemple@email.com&#10;autre@email.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message personnalisé (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Rejoignez-nous pour découvrir et partager des symboles culturels fascinants..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSendInvites} disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer les invitations'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupInviteDialog;
