import { useState, useEffect } from 'react';

export const usePHLocations = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch('https://psgc.gitlab.io/api/provinces');
        const data = await res.json();
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        
        
        sorted.unshift({ code: '130000000', name: 'Metro Manila' });
        
        setProvinces(sorted);
      } catch (err) {
        console.error('Failed to load provinces:', err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  const getCities = async (provinceCode) => {
    if (!provinceCode) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      let url = `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`;
      if (provinceCode === '130000000') {
        url = `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setCities(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Failed to load cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  return { provinces, cities, getCities, loadingProvinces, loadingCities };
};
