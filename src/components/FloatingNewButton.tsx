import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { t } from '../i18n/texts';

/**
 * FloatingNewButton
 * - Fixed bottom-right FAB that navigates to /character or back to home
 * - Shows "+" on home page, "×" on character form page
 * - Hides on scroll down, shows on scroll up (supports touch via scroll delta)
 */
export default function FloatingNewButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef<number>(window.scrollY || 0);
  const [visible, setVisible] = useState(true);

  // Check if we're on the character creation/edit page
  const isCharacterPage = location.pathname.startsWith('/character');

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

  const handleClick = () => {
    if (isCharacterPage) {
      navigate('/');
    } else {
      navigate('/character');
    }
  };

  const buttonLabel = isCharacterPage ? t('cancel') : t('newCharacter');
  const buttonIcon = isCharacterPage ? '×' : '+';
  const buttonBg = isCharacterPage 
    ? 'bg-gray-600 hover:bg-gray-700' 
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <button
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={handleClick}
      className={`fixed z-50 bottom-16 right-8 md:bottom-6 md:right-6 rounded-full! p-8 shadow-lg text-white ${buttonBg} focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
    >
      <span className={isCharacterPage ? 'text-3xl' : 'text-2xl'}>{buttonIcon}</span>
    </button>
  );
}
