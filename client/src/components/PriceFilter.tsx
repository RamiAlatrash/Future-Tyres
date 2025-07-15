import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

interface PriceFilterProps {
  valueMin: number;
  valueMax: number;
  boundMin: number;
  boundMax: number;
  onPriceChange: (value: [number, number]) => void;
}

export function PriceFilter({ valueMin, valueMax, boundMin, boundMax, onPriceChange }: PriceFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([valueMin, valueMax]);

  useEffect(() => {
    setPriceRange([valueMin, valueMax]);
  }, [valueMin, valueMax]);

  const handleValueChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
  };

  const handleValueCommit = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    onPriceChange(newRange);
  };

  return (
    <div className="space-y-4">
      <Slider
        value={priceRange}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        min={boundMin}
        max={boundMax}
        step={10}
      />
      <div className="flex justify-between text-sm">
        <span>AED {priceRange[0]}</span>
        <span>AED {priceRange[1]}</span>
      </div>
    </div>
  );
} 