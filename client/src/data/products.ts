import { Tyre, Accessory } from "@shared/schema"

export const mockTyres: Tyre[] = []

export const mockAccessories: Accessory[] = []

export const tyreBrands = [
  "Bridgestone",
  "Michelin", 
  "Continental",
  "Goodyear",
  "Pirelli",
  "Dunlop",
  "Yokohama",
  "Falken"
]

export const tyreTypes = [
  "All-Season",
  "Summer", 
  "Winter",
  "SUV/4x4"
]

export const accessoryBrands = [
  "ARB",
  "TJM", 
  "Thule",
  "Yakima",
  "Rhino-Rack",
  "Kings"
]

export const accessoryCategories = [
  "Bumpers",
  "Lighting",
  "Lift Kits", 
  "Roof Racks",
  "Wheel Spacers",
  "Rock Sliders",
  "Winches"
]

export const vehicleMakes = [
  "Toyota",
  "BMW",
  "Mercedes-Benz",
  "Audi", 
  "Ford",
  "Nissan",
  "Honda",
  "Volkswagen",
  "Hyundai",
  "Kia"
]

export const vehicleModels: Record<string, string[]> = {
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "RAV4", "Hilux"],
  "BMW": ["X5", "X3", "3 Series", "5 Series", "X1", "X7"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "G-Class"],
  "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3"],
  "Ford": ["F-150", "Explorer", "Edge", "Escape", "Ranger", "Expedition"],
  "Nissan": ["Patrol", "X-Trail", "Altima", "Pathfinder", "Sentra", "Armada"]
}

export const vehicleYears = Array.from(
  { length: 15 }, 
  (_, i) => (new Date().getFullYear() - i).toString()
)
