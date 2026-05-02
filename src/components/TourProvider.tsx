import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslation } from 'react-i18next';

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          { 
            element: '#tour-select-contacts', 
            popover: { 
              title: t('home.selectContacts'), 
              description: t('tour.step1'),
              side: "bottom", 
              align: 'start' 
            } 
          },
          { 
            element: '#tour-create-group', 
            popover: { 
              title: t('groups.createGroup'), 
              description: t('tour.step2'),
              side: "bottom", 
              align: 'start' 
            } 
          },
          { 
            element: '#tour-export-pdf', 
            popover: { 
              title: t('common.export'), 
              description: t('tour.step4'),
              side: "top", 
              align: 'start' 
            } 
          },
        ],
        nextBtnText: t('tour.next'),
        prevBtnText: t('tour.prev'),
        doneBtnText: t('tour.done'),
      });

      // Small delay to ensure elements are rendered
      setTimeout(() => {
        driverObj.drive();
        localStorage.setItem('hasSeenTour', 'true');
      }, 1000);
    }
  }, [t]);

  return <>{children}</>;
};
