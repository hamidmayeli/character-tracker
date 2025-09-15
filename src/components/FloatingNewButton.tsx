import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n/texts';

/**
 * FloatingNewButton
 * - Fixed bottom-right FAB that navigates to /character
 * - Hides on scroll down, shows on scroll up (supports touch via scroll delta)
 */
export default function FloatingNewButton() {
  const navigate = useNavigate();
  const lastScrollY = useRef<number>(window.scrollY || 0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const threshold = 6; // small threshold to avoid jitter

    function onScroll() {
      const current = window.scrollY || 0;
      const delta = current - lastScrollY.current;

      if (Math.abs(delta) < threshold) return; // ignore tiny movements

      if (delta > 0) {
        // scrolling down
        if (visible) setVisible(false);
      } else {
        // scrolling up
        if (!visible) setVisible(true);
      }

      lastScrollY.current = current;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  return (
    <button
      aria-label={t('newCharacter')}
      title={t('newCharacter')}
      onClick={() => navigate('/character')}
      className={`fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 rounded-full px-4 py-3 shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
    >
      +
    </button>
  );
}
