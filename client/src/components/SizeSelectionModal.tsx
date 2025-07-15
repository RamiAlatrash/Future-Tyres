import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { ProgressIndicator } from "./ProgressIndicator";

interface SizeSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectionMode: "width" | "height" | "rim";
  options: number[];
  onSelect: (value: number) => void;
  onBack: () => void;
  onReset: () => void;
}

export function SizeSelectionModal({
  isOpen,
  onOpenChange,
  selectionMode,
  options,
  onSelect,
  onBack,
  onReset,
}: SizeSelectionModalProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFilter("");
    }
  }, [isOpen, selectionMode]);

  const getTitle = () => {
    switch (selectionMode) {
        case "width":
          return t("width");
        case "height":
          return t("height");
        case "rim":
          return t("rim_size");
        default:
          return t("current_size_selection");
      }
  };

  const getPlaceholder = () => {
    switch (selectionMode) {
      case "width":
        return `${t('search')} ${t('width')}...`;
      case "height":
        return `${t('search')} ${t('height')}...`;
      case "rim":
        return `${t('search')} ${t('rim_size')}...`;
      default:
        return t('search_tyre_size_placeholder');
    }
  };

  const filteredItems = options.filter((item) =>
    String(item).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="w-full text-center">{getTitle()}</DialogTitle>
        </DialogHeader>
        <ProgressIndicator
          steps={["width", "height", "rim"]}
          currentStep={selectionMode}
        />
        <Input
          placeholder={getPlaceholder()}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="my-4"
        />
         <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 overflow-y-auto max-h-60">
            {filteredItems.map((item) => (
              <Button
                key={item}
                onClick={() => onSelect(item)}
                variant="selection"
                className="h-12 w-full flex-shrink-0 rounded-md"
              >
                {item}
              </Button>
            ))}
        </div>
        <DialogFooter className="mt-6 pt-4 border-t flex justify-between w-full">
            <Button variant="ghost" className="text-gray-600 hover:text-electric-blue" onClick={onBack}>{t('go_back')}</Button>
            <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white rounded-full" onClick={onReset}>{t('reset')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 