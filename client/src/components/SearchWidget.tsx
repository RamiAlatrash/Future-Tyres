import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { staticTyres } from "@/data/tyres";
import { ChevronsRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { SizeSelectionModal } from "./SizeSelectionModal";

// Helper to parse "205/55R16", "205/55 R16", "205 R16C" into { width: 205, aspect: 55, rim: 16 }
const parseTyreSize = (size: string) => {
  // Standard format: 205/55R16 or 205/55 R16
  let match = size.match(/(\d+)\/(\d+)\s*R(\d+)/);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
      rim: parseInt(match[3], 10),
    };
  }

  // Light truck format: 205R16C or 205 R15C (assume aspect ratio of 82)
  match = size.match(/(\d+)\s*R(\d+)C?/);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: 82, // Common default for this format
      rim: parseInt(match[2], 10),
    };
  }
  
  // Format with space instead of R: 295/35 21
  match = size.match(/(\d+)\/(\d+)\s+(\d+)/);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
      rim: parseInt(match[3], 10),
    };
  }

  return null;
};

// Get unique, sorted numbers from an array
const getUniqueSorted = (arr: number[]) => [...new Set(arr)].sort((a, b) => a - b);

interface SearchWidgetProps {
  variant?: 'homepage' | 'footer';
}

export default function SearchWidget({ variant = 'homepage' }: SearchWidgetProps) {
  const [activeTab, setActiveTab] = useState<"size" | "productName">("size");
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [rim, setRim] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"width" | "height" | "rim">("width");

  useEffect(() => {
    // Only trigger navigation for the homepage variant when a full size is selected
    if (variant === 'homepage' && activeTab === 'size' && width && height && rim) {
      const sizeQuery = `${width}/${height}R${rim}`;
      setLocation(`/tyres?size=${encodeURIComponent(sizeQuery)}`);
      
      // Reset state after search to allow a new search
      setWidth(null);
      setHeight(null);
      setRim(null);
    }
  }, [width, height, rim, variant, activeTab, setLocation]);

  const parsedTyres = useMemo(() => staticTyres.map(tyre => ({ ...tyre, parsedSize: parseTyreSize(tyre.size) })).filter(t => t.parsedSize), []);
  
  const availableWidths = useMemo(() => getUniqueSorted(parsedTyres.map(t => t.parsedSize!.width)), [parsedTyres]);
  
  const availableHeights = useMemo(() => {
    if (!width) return [];
    return getUniqueSorted(parsedTyres.filter(t => t.parsedSize!.width === width).map(t => t.parsedSize!.height));
  }, [width, parsedTyres]);
  
  const availableRims = useMemo(() => {
    if (!width || !height) return [];
    return getUniqueSorted(parsedTyres.filter(t => t.parsedSize!.width === width && t.parsedSize!.height === height).map(t => t.parsedSize!.rim));
  }, [width, height, parsedTyres]);

  const modalOptions = useMemo(() => {
    switch (selectionMode) {
      case "width": return availableWidths;
      case "height": return availableHeights;
      case "rim": return availableRims;
      default: return [];
    }
  }, [selectionMode, availableWidths, availableHeights, availableRims]);
  

  const handleDimensionSelect = (value: number) => {
    if (selectionMode === "width") {
      setWidth(value);
      setHeight(null);
      setRim(null);
      setSelectionMode("height");
    } else if (selectionMode === "height") {
      setHeight(value);
      setRim(null);
      setSelectionMode("rim");
    } else if (selectionMode === "rim") {
      setRim(value);
      setModalOpen(false);
    }
  };

  const handleReset = () => {
      setWidth(null);
      setHeight(null);
      setRim(null);
      setSelectionMode("width");
  }

  const handleBack = () => {
    if (selectionMode === "height") setSelectionMode("width");
    else if (selectionMode === "rim") setSelectionMode("height");
  };

  const startSizeSelection = () => {
    setWidth(null);
    setHeight(null);
    setRim(null);
    setSelectionMode("width");
    setModalOpen(true);
  };

  const handleSearch = () => {
    if (activeTab === "productName" && query) {
      setLocation(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleFooterSearch = () => {
    if (width && height && rim) {
        const sizeQuery = `${width}/${height}R${rim}`;
        setLocation(`/tyres?size=${encodeURIComponent(sizeQuery)}`);
    }
  }

  const openModal = (mode: "width" | "height" | "rim") => {
    setSelectionMode(mode);
    setModalOpen(true);
  };

  if (variant === 'footer') {
    return (
      <Card className="shadow-2xl border-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex items-center justify-center gap-4">
              <Button 
                  variant="default"
                  className="bg-electric-blue hover:bg-black text-white font-semibold py-3 px-5 rounded-full hidden md:flex transition-colors duration-300"
                  onClick={startSizeSelection}
              >
                  SEARCH BY SIZE <ChevronsRight className="ml-2 h-5 w-5"/>
              </Button>
              <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" className={`py-3 px-5 rounded-full border-2 font-semibold transition-colors duration-200 border-gray-400 text-gray-800`} onClick={() => openModal('width')}>{width ? `Width: ${width}` : t('width')}</Button>
                  <Button variant="outline" className={`py-3 px-5 rounded-full border-2 font-semibold transition-colors duration-200 border-gray-400 text-gray-800`} onClick={() => openModal('height')} disabled={!width}>{height ? `Height: ${height}` : t('height')}</Button>
                  <Button variant="outline" className={`py-3 px-5 rounded-full border-2 font-semibold transition-colors duration-200 border-gray-400 text-gray-800`} onClick={() => openModal('rim')} disabled={!width || !height}>{rim ? `Rim: ${rim}` : t('rim_size')}</Button>
              </div>
              <Button 
                  onClick={handleFooterSearch} 
                  disabled={!width || !height || !rim}
                  className="bg-electric-blue hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300"
              >
                  {t('search')}
              </Button>

              <SizeSelectionModal
                  isOpen={isModalOpen}
                  onOpenChange={setModalOpen}
                  selectionMode={selectionMode}
                  options={modalOptions}
                  onSelect={handleDimensionSelect}
                  onBack={handleBack}
                  onReset={handleReset}
              />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setActiveTab("size")}
            className={`py-3 px-8 rounded-l-lg font-bold text-lg transition-colors duration-200 ${
              activeTab === "size"
                ? "bg-electric-blue text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("home.search.by_size")}
          </Button>
          <Button
            onClick={() => setActiveTab("productName")}
            className={`py-3 px-8 rounded-r-lg font-bold text-lg transition-colors duration-200 ${
              activeTab === "productName"
                ? "bg-electric-blue text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("home.search.by_product_name")}
          </Button>
        </div>

        {activeTab === "size" ? (
          <div className="space-y-4">
             <Button
              onClick={startSizeSelection}
              variant="outline"
              className="py-6 text-lg border-2 w-full justify-start font-normal text-gray-500 hover:text-gray-800 hover:border-electric-blue"
            >
              <Search className="mr-4 h-6 w-6" />
              {t("home.search.size_placeholder")}
            </Button>
            <SizeSelectionModal
              isOpen={isModalOpen}
              onOpenChange={setModalOpen}
              selectionMode={selectionMode}
              options={modalOptions}
              onSelect={handleDimensionSelect}
              onBack={handleBack}
              onReset={handleReset}
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={t("home.search.product_name_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 focus:border-electric-blue text-future-black text-lg h-auto"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="bg-electric-blue hover:bg-black text-white font-semibold py-2 px-4 transition-colors duration-300"
            >
              <Search className="mr-2 h-5 w-5" />
              {t("search")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
