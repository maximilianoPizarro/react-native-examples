import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';
import FixtureAPI from '../services/fixture-api';
import AppConfig from '../../config/app-config';

/* ------------- Types ------------- */

import { StartupTypes } from '../reducers/startup.reducer';
import { LoginTypes } from '../../modules/login/login.reducer';
import { AccountTypes } from '../../shared/reducers/account.reducer';
import { RegisterTypes } from '../../modules/account/register/register.reducer';
import { ForgotPasswordTypes } from '../../modules/account/password-reset/forgot-password.reducer';
import { ChangePasswordTypes } from '../../modules/account/password/change-password.reducer';
import { UserTypes } from '../../shared/reducers/user.reducer';
import { ProductTypes } from '../../modules/entities/product/product.reducer';
import { ProductCategoryTypes } from '../../modules/entities/product-category/product-category.reducer';
import { CustomerDetailsTypes } from '../../modules/entities/customer-details/customer-details.reducer';
import { ShoppingCartTypes } from '../../modules/entities/shopping-cart/shopping-cart.reducer';
import { ProductOrderTypes } from '../../modules/entities/product-order/product-order.reducer';
// jhipster-react-native-saga-redux-import-needle

/* ------------- Sagas ------------- */

import { startup } from './startup.saga';
import { login, logout, loginLoad } from '../../modules/login/login.sagas';
import { register } from '../../modules/account/register/register.sagas';
import { forgotPassword } from '../../modules/account/password-reset/forgot-password.sagas';
import { changePassword } from '../../modules/account/password/change-password.sagas';
import { getAccount, updateAccount } from '../../shared/sagas/account.sagas';
import UserSagas from '../../shared/sagas/user.sagas';
import ProductSagas from '../../modules/entities/product/product.sagas';
import ProductCategorySagas from '../../modules/entities/product-category/product-category.sagas';
import CustomerDetailsSagas from '../../modules/entities/customer-details/customer-details.sagas';
import ShoppingCartSagas from '../../modules/entities/shopping-cart/shopping-cart.sagas';
import ProductOrderSagas from '../../modules/entities/product-order/product-order.sagas';
// jhipster-react-native-saga-method-import-needle

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = AppConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // JHipster accounts
    takeLatest(LoginTypes.LOGIN_LOAD, loginLoad, api),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),

    takeLatest(ProductTypes.PRODUCT_REQUEST, ProductSagas.getProduct, api),
    takeLatest(ProductTypes.PRODUCT_ALL_REQUEST, ProductSagas.getAllProducts, api),
    takeLatest(ProductTypes.PRODUCT_UPDATE_REQUEST, ProductSagas.updateProduct, api),
    takeLatest(ProductTypes.PRODUCT_DELETE_REQUEST, ProductSagas.deleteProduct, api),

    takeLatest(ProductCategoryTypes.PRODUCT_CATEGORY_REQUEST, ProductCategorySagas.getProductCategory, api),
    takeLatest(ProductCategoryTypes.PRODUCT_CATEGORY_ALL_REQUEST, ProductCategorySagas.getAllProductCategories, api),
    takeLatest(ProductCategoryTypes.PRODUCT_CATEGORY_UPDATE_REQUEST, ProductCategorySagas.updateProductCategory, api),
    takeLatest(ProductCategoryTypes.PRODUCT_CATEGORY_DELETE_REQUEST, ProductCategorySagas.deleteProductCategory, api),

    takeLatest(CustomerDetailsTypes.CUSTOMER_DETAILS_REQUEST, CustomerDetailsSagas.getCustomerDetails, api),
    takeLatest(CustomerDetailsTypes.CUSTOMER_DETAILS_ALL_REQUEST, CustomerDetailsSagas.getAllCustomerDetails, api),
    takeLatest(CustomerDetailsTypes.CUSTOMER_DETAILS_UPDATE_REQUEST, CustomerDetailsSagas.updateCustomerDetails, api),
    takeLatest(CustomerDetailsTypes.CUSTOMER_DETAILS_DELETE_REQUEST, CustomerDetailsSagas.deleteCustomerDetails, api),

    takeLatest(ShoppingCartTypes.SHOPPING_CART_REQUEST, ShoppingCartSagas.getShoppingCart, api),
    takeLatest(ShoppingCartTypes.SHOPPING_CART_ALL_REQUEST, ShoppingCartSagas.getAllShoppingCarts, api),
    takeLatest(ShoppingCartTypes.SHOPPING_CART_UPDATE_REQUEST, ShoppingCartSagas.updateShoppingCart, api),
    takeLatest(ShoppingCartTypes.SHOPPING_CART_DELETE_REQUEST, ShoppingCartSagas.deleteShoppingCart, api),

    takeLatest(ProductOrderTypes.PRODUCT_ORDER_REQUEST, ProductOrderSagas.getProductOrder, api),
    takeLatest(ProductOrderTypes.PRODUCT_ORDER_ALL_REQUEST, ProductOrderSagas.getAllProductOrders, api),
    takeLatest(ProductOrderTypes.PRODUCT_ORDER_UPDATE_REQUEST, ProductOrderSagas.updateProductOrder, api),
    takeLatest(ProductOrderTypes.PRODUCT_ORDER_DELETE_REQUEST, ProductOrderSagas.deleteProductOrder, api),
    // jhipster-react-native-saga-redux-connect-needle

    takeLatest(RegisterTypes.REGISTER_REQUEST, register, api),
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api),
    takeLatest(ChangePasswordTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),
    takeLatest(UserTypes.USER_REQUEST, UserSagas.getUser, api),
    takeLatest(UserTypes.USER_UPDATE_REQUEST, UserSagas.updateUser, api),
    takeLatest(UserTypes.USER_DELETE_REQUEST, UserSagas.deleteUser, api),
    takeLatest(UserTypes.USER_ALL_REQUEST, UserSagas.getAllUsers, api),

    takeLatest(AccountTypes.ACCOUNT_REQUEST, getAccount, api),
    takeLatest(AccountTypes.ACCOUNT_UPDATE_REQUEST, updateAccount, api),
  ]);
}
