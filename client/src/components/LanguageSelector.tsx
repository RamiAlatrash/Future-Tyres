import { Globe } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface LanguageSelectorProps {
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setCurrentLang(newLang);
    onLanguageChange(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 transition-colors"
      size="sm"
    >
      <Globe className="w-4 h-4" />
      <span>{currentLang === 'en' ? 'عربي' : 'English'}</span>
    </Button>
  );
} 