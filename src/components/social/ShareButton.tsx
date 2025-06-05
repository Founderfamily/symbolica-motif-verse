
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  image = '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    image: encodeURIComponent(image)
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
    whatsapp: `https://wa.me/?text=${shareData.title} ${shareData.url}`
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers !');
      setIsOpen(false);
    } catch (err) {
      toast.error('Erreur lors de la copie du lien');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        setIsOpen(false);
      } catch (err) {
        console.log('Native share cancelled');
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager...
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-2" />
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
