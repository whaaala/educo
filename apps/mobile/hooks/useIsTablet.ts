import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

export function useIsTablet() {
  const getIsTablet = () => Dimensions.get('window').width >= 768;
  const [isTablet, setIsTablet] = useState(getIsTablet);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => setIsTablet(getIsTablet()));
    return () => sub.remove();
  }, []);

  return useMemo(() => isTablet, [isTablet]);
}


