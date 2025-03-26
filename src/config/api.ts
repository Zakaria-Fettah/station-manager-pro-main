
// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ROUTES = {
  fournisseurs: `${API_BASE_URL}/api/fournisseurs`,
  produits: `${API_BASE_URL}/api/produits`,
  citernes: `${API_BASE_URL}/api/citernes`,
  ventes: `${API_BASE_URL}/api/ventes`,
  employees: `${API_BASE_URL}/api/employees`,
};

export default API_BASE_URL;
