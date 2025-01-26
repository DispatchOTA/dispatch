import axios from 'axios';

const BASE_API_URL = 'http://localhost:3000';

export const toSentenceCase = (txt: string) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();

export const fetchData = async <T,>(endpoint: string): Promise<T[]> => {
  const { data } = await axios.get(BASE_API_URL + endpoint);
  return data;
};