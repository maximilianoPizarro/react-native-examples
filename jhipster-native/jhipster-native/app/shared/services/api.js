// a library to wrap and simplify api calls
import apisauce from 'apisauce';

import AppConfig from '../../config/app-config';

// our "constructor"
const create = (baseURL = AppConfig.apiUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
    },
    // 10 second timeout...
    timeout: 10000,
  });

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const setAuthToken = (userAuth) => api.setHeader('Authorization', 'Bearer ' + userAuth);
  const removeAuthToken = () => api.deleteHeader('Authorization');
  const login = (userAuth) => api.post('api/authenticate', userAuth);
  const register = (user) => api.post('api/register', user);
  const forgotPassword = (data) =>
    api.post('api/account/reset-password/init', data, {
      headers: { 'Content-Type': 'text/plain', Accept: 'application/json, text/plain, */*' },
    });

  const getAccount = () => api.get('api/account');
  const updateAccount = (account) => api.post('api/account', account);
  const changePassword = (currentPassword, newPassword) =>
    api.post(
      'api/account/change-password',
      { currentPassword, newPassword },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*' } },
    );

  const getUser = (userId) => api.get('api/users/' + userId);
  const getAllUsers = (options) => api.get('api/users', options);
  const createUser = (user) => api.post('api/users', user);
  const updateUser = (user) => api.put('api/users', user);
  const deleteUser = (userId) => api.delete('api/users/' + userId);

  const getProduct = (productId) => api.get('api/products/' + productId);
  const getAllProducts = (options) => api.get('api/products', options);
  const createProduct = (product) => api.post('api/products', product);
  const updateProduct = (product) => api.put(`api/products/${product.id}`, product);
  const deleteProduct = (productId) => api.delete('api/products/' + productId);

  const getProductCategory = (productCategoryId) => api.get('api/product-categories/' + productCategoryId);
  const getAllProductCategories = (options) => api.get('api/product-categories', options);
  const createProductCategory = (productCategory) => api.post('api/product-categories', productCategory);
  const updateProductCategory = (productCategory) => api.put(`api/product-categories/${productCategory.id}`, productCategory);
  const deleteProductCategory = (productCategoryId) => api.delete('api/product-categories/' + productCategoryId);

  const getCustomerDetails = (customerDetailsId) => api.get('api/customer-details/' + customerDetailsId);
  const getAllCustomerDetails = (options) => api.get('api/customer-details', options);
  const createCustomerDetails = (customerDetails) => api.post('api/customer-details', customerDetails);
  const updateCustomerDetails = (customerDetails) => api.put(`api/customer-details/${customerDetails.id}`, customerDetails);
  const deleteCustomerDetails = (customerDetailsId) => api.delete('api/customer-details/' + customerDetailsId);

  const getShoppingCart = (shoppingCartId) => api.get('api/shopping-carts/' + shoppingCartId);
  const getAllShoppingCarts = (options) => api.get('api/shopping-carts', options);
  const createShoppingCart = (shoppingCart) => api.post('api/shopping-carts', shoppingCart);
  const updateShoppingCart = (shoppingCart) => api.put(`api/shopping-carts/${shoppingCart.id}`, shoppingCart);
  const deleteShoppingCart = (shoppingCartId) => api.delete('api/shopping-carts/' + shoppingCartId);

  const getProductOrder = (productOrderId) => api.get('api/product-orders/' + productOrderId);
  const getAllProductOrders = (options) => api.get('api/product-orders', options);
  const createProductOrder = (productOrder) => api.post('api/product-orders', productOrder);
  const updateProductOrder = (productOrder) => api.put(`api/product-orders/${productOrder.id}`, productOrder);
  const deleteProductOrder = (productOrderId) => api.delete('api/product-orders/' + productOrderId);
  // jhipster-react-native-api-method-needle

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    createUser,
    updateUser,
    getAllUsers,
    getUser,
    deleteUser,

    createProduct,
    updateProduct,
    getAllProducts,
    getProduct,
    deleteProduct,

    createProductCategory,
    updateProductCategory,
    getAllProductCategories,
    getProductCategory,
    deleteProductCategory,

    createCustomerDetails,
    updateCustomerDetails,
    getAllCustomerDetails,
    getCustomerDetails,
    deleteCustomerDetails,

    createShoppingCart,
    updateShoppingCart,
    getAllShoppingCarts,
    getShoppingCart,
    deleteShoppingCart,

    createProductOrder,
    updateProductOrder,
    getAllProductOrders,
    getProductOrder,
    deleteProductOrder,
    // jhipster-react-native-api-export-needle
    setAuthToken,
    removeAuthToken,
    login,
    register,
    forgotPassword,
    getAccount,
    updateAccount,
    changePassword,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
