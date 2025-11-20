import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const IdleTimer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);
  const idleTimeRef = useRef(0);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    idleTimeRef.current = 0;
    timeoutRef.current = setTimeout(() => {
      if (user) {
        dispatch(logout());
      }
    }, 60000); // 1 minute
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    if (user) {
      resetTimer();

      // Add event listeners for activity
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [user]);

  return null; // This component doesn't render anything
};

export default IdleTimer;
