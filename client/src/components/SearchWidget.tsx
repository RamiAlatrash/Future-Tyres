import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function SearchWidget() {
  const [activeTab, setActiveTab] = useState<"size" | "vehicle">("size");
  const [sizeQuery, setSizeQuery] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [, setLocation] = useLocation();

  const handleSizeSearch = () => {
    if (sizeQuery) {
      setLocation(`/tyres?size=${encodeURIComponent(sizeQuery)}`);
    }
  };

  const handleVehicleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.append("make", make);
    if (model) params.append("model", model);
    if (year) params.append("year", year);
    
    if (params.toString()) {
      setLocation(`/tyres?${params.toString()}`);
    }
  };

  const makes = ["Toyota", "BMW", "Mercedes", "Audi", "Ford", "Nissan", "Honda"];
  const models = ["Camry", "Corolla", "Land Cruiser", "Prado", "X5", "X3", "C-Class", "E-Class"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl">
      <CardContent className="p-8">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === "size" ? "default" : "ghost"}
            className={`flex-1 py-3 px-6 font-orbitron font-medium ${
              activeTab === "size" 
                ? "bg-electric-blue text-white" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("size")}
          >
            By Size
          </Button>
          <Button
            variant={activeTab === "vehicle" ? "default" : "ghost"}
            className={`flex-1 py-3 px-6 font-orbitron font-medium ${
              activeTab === "vehicle" 
                ? "bg-electric-blue text-white" 
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("vehicle")}
          >
            By Vehicle
          </Button>
        </div>
        
        {activeTab === "size" ? (
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="e.g. 205/55 R16"
              value={sizeQuery}
              onChange={(e) => setSizeQuery(e.target.value)}
              className="flex-1 px-4 py-3 focus:border-electric-blue text-future-black"
              onKeyPress={(e) => e.key === "Enter" && handleSizeSearch()}
            />
            <Button 
              onClick={handleSizeSearch}
              className="bg-electric-blue hover:bg-electric-blue-dark text-white px-8 py-3 font-medium"
            >
              Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger className="focus:border-electric-blue">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="focus:border-electric-blue">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="focus:border-electric-blue">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleVehicleSearch}
              className="bg-electric-blue hover:bg-electric-blue-dark text-white py-3 font-medium"
            >
              Search
            </Button>
          </div>
        )}
        
        <p className="text-gray-600 text-sm mt-4 text-center">
          Free fitment across UAE. Delivery in 24 hours.
        </p>
      </CardContent>
    </Card>
  );
}
