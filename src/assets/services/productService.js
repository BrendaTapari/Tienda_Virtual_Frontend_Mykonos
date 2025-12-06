import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "products";


const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};


const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}?category=${category}`);
    return response.data;
    } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};




export { fetchProducts, fetchProductById, fetchProductsByCategory };