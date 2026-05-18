import api from './client';

export const fetchHome = async () => (await api.get('/public/home')).data.data;
export const fetchProducts = async () => (await api.get('/public/products')).data.data;
export const fetchProduct = async (slug) => (await api.get(`/public/products/${slug}`)).data.data;
export const fetchBlogs = async () => (await api.get('/public/blogs')).data.data;
export const fetchExportCountries = async () => (await api.get('/public/export-countries')).data.data;
export const fetchBlog = async (slug) => (await api.get(`/public/blogs/${slug}`)).data.data;
export const fetchPage = async (slug) => (await api.get(`/public/pages/${slug}`)).data.data;
export const submitInquiry = async (payload) => (await api.post('/public/inquiries', payload)).data;
export const loginUser = async (payload) => (await api.post('/auth/login', payload)).data.data;
export const requestRegisterCode = async (payload) => (await api.post('/auth/register', payload)).data.data;
export const verifyRegisterCode = async (payload) => (await api.post('/auth/register/verify', payload)).data.data;
export const fetchCurrentUser = async () => (await api.get('/auth/me')).data.data;
export const logoutUser = async (refreshToken) => (await api.post('/auth/logout', { refreshToken })).data.data;
export const createOrder = async (payload) => (await api.post('/orders', payload)).data.data;
export const fetchMyOrders = async () => (await api.get('/orders/my')).data.data;
export const fetchMyOrder = async (id) => (await api.get(`/orders/my/${id}`)).data.data;
export const fetchAdminResource = async (resource) => (await api.get(`/admin/${resource}`)).data.data;
export const createAdminResource = async (resource, payload) => (await api.post(`/admin/${resource}`, payload)).data.data;
export const updateAdminResource = async (resource, id, payload) =>
  (await api.put(`/admin/${resource}/${id}`, payload)).data.data;
export const deleteAdminResource = async (resource, id) => (await api.delete(`/admin/${resource}/${id}`)).data;
export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await api.post('/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data;
};
