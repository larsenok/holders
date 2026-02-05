import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

type Popup = {
  id: string; // Unique ID for each popup
  title: string;
  description: string;
  duration?: number; // Duration in ms, default 5000
};

type PopupContextType = {
  showPopup: (popup: Omit<Popup, 'id'>) => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const navigate = useNavigate();

  const showPopup = ({ title, description, duration = 5000 }: Omit<Popup, 'id'>) => {
    const id = `${title}-${Date.now()}`; // Unique ID
    console.log('[PopupProvider] Showing popup:', { id, title, description });
    setPopups(prev => [...prev, { id, title, description, duration }]);
  };

  // Auto-dismiss the oldest popup after its duration
  useEffect(() => {
    if (popups.length === 0) return;

    const current = popups[0];
    const timeout = setTimeout(() => {
      setPopups(prev => prev.slice(1));
      console.log('[PopupProvider] Popup dismissed:', current.id);
    }, current.duration);

    return () => clearTimeout(timeout);
  }, [popups]);

  const handlePopupClick = () => {
    navigate('/achievements');
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <AnimatePresence>
        {popups.length > 0 && (
          <motion.div
            key={popups[0].id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed cursor-pointer top-8 right-8 bg-gray-800 border border-pink-600 text-yellow-300 px-4 py-3 rounded shadow-lg z-50"
            onClick={handlePopupClick}
          >
            <h3 className="font-bold text-lg mb-1">🎉 {popups[0].title}</h3>
            <p className="text-sm text-pink-200">{popups[0].description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </PopupContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) throw new Error('usePopup must be used within PopupProvider');
  return context;
}