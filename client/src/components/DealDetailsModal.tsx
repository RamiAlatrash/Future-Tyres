import { X } from "lucide-react";
import { Button } from "./ui/button";

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function DealDetailsModal({ isOpen, onClose, title, description }: DealDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4 animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <h2 className="text-2xl font-bold text-future-black mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>

        {/* Close button */}
        <div className="text-right">
          <Button
            onClick={onClose}
            className="bg-electric-blue hover:bg-electric-blue-dark text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
} 