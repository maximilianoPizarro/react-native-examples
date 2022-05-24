import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import ProductOrderActions from './product-order.reducer';
import ProductActions from '../product/product.reducer';
import ShoppingCartActions from '../shopping-cart/shopping-cart.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './product-order-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  quantity: Yup.number().required().min(0),
  totalPrice: Yup.number().required().min(0),
  product: Yup.mixed().required(),
  cart: Yup.mixed().required(),
});

function ProductOrderEditScreen(props) {
  const {
    getProductOrder,
    updateProductOrder,
    route,
    productOrder,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllProducts,
    productList,
    getAllShoppingCarts,
    shoppingCartList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getProductOrder(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getProductOrder, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(productOrder));
    }
  }, [productOrder, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllProducts();
    getAllShoppingCarts();
  }, [getAllProducts, getAllShoppingCarts]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('ProductOrderDetail', { entityId: productOrder?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateProductOrder(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const quantityRef = createRef();
  const totalPriceRef = createRef();
  const productRef = createRef();
  const cartRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="productOrderEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="quantity"
              ref={quantityRef}
              label="Quantity"
              placeholder="Enter Quantity"
              testID="quantityInput"
              inputType="number"
              onSubmitEditing={() => totalPriceRef.current?.focus()}
            />
            <FormField
              name="totalPrice"
              ref={totalPriceRef}
              label="Total Price"
              placeholder="Enter Total Price"
              testID="totalPriceInput"
              inputType="number"
            />
            <FormField
              name="product"
              inputType="select-one"
              ref={productRef}
              listItems={productList}
              listItemLabelField="name"
              label="Product"
              placeholder="Select Product"
              testID="productSelectInput"
            />
            <FormField
              name="cart"
              inputType="select-one"
              ref={cartRef}
              listItems={shoppingCartList}
              listItemLabelField="id"
              label="Cart"
              placeholder="Select Cart"
              testID="shoppingCartSelectInput"
            />

            <FormButton title={'Save'} testID={'submitButton'} />
          </Form>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = (value) => {
  if (!value) {
    return {};
  }
  return {
    id: value.id ?? null,
    quantity: value.quantity ?? null,
    totalPrice: value.totalPrice ?? null,
    product: value.product && value.product.id ? value.product.id : null,
    cart: value.cart && value.cart.id ? value.cart.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    quantity: value.quantity ?? null,
    totalPrice: value.totalPrice ?? null,
  };
  entity.product = value.product ? { id: value.product } : null;
  entity.cart = value.cart ? { id: value.cart } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    productList: state.products.productList ?? [],
    shoppingCartList: state.shoppingCarts.shoppingCartList ?? [],
    productOrder: state.productOrders.productOrder,
    fetching: state.productOrders.fetchingOne,
    updating: state.productOrders.updating,
    updateSuccess: state.productOrders.updateSuccess,
    errorUpdating: state.productOrders.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProducts: (options) => dispatch(ProductActions.productAllRequest(options)),
    getAllShoppingCarts: (options) => dispatch(ShoppingCartActions.shoppingCartAllRequest(options)),
    getProductOrder: (id) => dispatch(ProductOrderActions.productOrderRequest(id)),
    getAllProductOrders: (options) => dispatch(ProductOrderActions.productOrderAllRequest(options)),
    updateProductOrder: (productOrder) => dispatch(ProductOrderActions.productOrderUpdateRequest(productOrder)),
    reset: () => dispatch(ProductOrderActions.productOrderReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductOrderEditScreen);
