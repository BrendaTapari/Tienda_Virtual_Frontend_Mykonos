/**
 * Contact Service
 * Handles contact form submission
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/contact";

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Sender's name
 * @param {string} formData.email - Sender's email
 * @param {string} formData.phone - Sender's phone (optional)
 * @param {string} formData.message - Message content
 * @returns {Promise<Object>} Response message
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error.response?.data || error;
  }
};
