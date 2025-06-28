import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language.toUpperCase());

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng.toUpperCase());
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 font-medium">{t('language')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-secondary">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => changeLanguage('en')}>
            English (EN)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('fr')}>
            Français (FR)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
