import { motion } from 'motion/react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

interface ControlsModalProps {
  onClose: () => void;
}

export function ControlsModal({ onClose }: ControlsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] p-6 flex justify-between items-center">
          <h2 className="text-white text-2xl">Kontroller</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls List */}
        <div className="p-6 space-y-6">
          {/* Movement Up */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E7F5FF] to-[#D0EBFF] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <ArrowUp className="w-6 h-6 text-[#74C0FC]" />
              </div>
              <span className="text-[#495057]">Yukarı Ok</span>
            </div>
            <span className="text-[#868E96]">Yukarı</span>
          </div>

          {/* Movement Down */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E7F5FF] to-[#D0EBFF] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <ArrowDown className="w-6 h-6 text-[#74C0FC]" />
              </div>
              <span className="text-[#495057]">Aşağı Ok</span>
            </div>
            <span className="text-[#868E96]">Aşağı</span>
          </div>

          {/* Package Drop */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E7F5FF] to-[#D0EBFF] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-3 rounded-lg shadow-md">
                <span className="text-[#74C0FC]">SPACE</span>
              </div>
              <span className="text-[#495057]">Boşluk</span>
            </div>
            <span className="text-[#868E96]">Paket Bırakma</span>
          </div>

          {/* Pause */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E7F5FF] to-[#D0EBFF] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-3 rounded-lg shadow-md">
                <span className="text-[#74C0FC]">ESC</span>
              </div>
              <span className="text-[#495057]">Escape</span>
            </div>
            <span className="text-[#868E96]">Duraklat</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#74C0FC] to-[#A5D8FF] hover:from-[#5DADE2] hover:to-[#74C0FC] text-white px-8 rounded-xl"
          >
            Anladım
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
