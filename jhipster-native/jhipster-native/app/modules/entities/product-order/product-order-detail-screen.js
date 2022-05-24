import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ProductOrderActions from './product-order.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ProductOrderDeleteModal from './product-order-delete-modal';
import styles from './product-order-styles';

function ProductOrderDetailScreen(props) {
  const { route, getProductOrder, navigation, productOrder, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = productOrder?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('ProductOrder');
      } else {
        setDeleteModalVisible(false);
        getProductOrder(routeEntityId);
      }
    }, [routeEntityId, getProductOrder, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the ProductOrder.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="productOrderDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{productOrder.id}</Text>
      {/* Quantity Field */}
      <Text style={styles.label}>Quantity:</Text>
      <Text testID="quantity">{productOrder.quantity}</Text>
      {/* TotalPrice Field */}
      <Text style={styles.label}>TotalPrice:</Text>
      <Text testID="totalPrice">{productOrder.totalPrice}</Text>
      <Text style={styles.label}>Product:</Text>
      <Text testID="product">{String(productOrder.product ? productOrder.product.name : '')}</Text>
      <Text style={styles.label}>Cart:</Text>
      <Text testID="cart">{String(productOrder.cart ? productOrder.cart.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('ProductOrderEdit', { entityId })}
          accessibilityLabel={'ProductOrder Edit Button'}
          testID="productOrderEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'ProductOrder Delete Button'}
          testID="productOrderDeleteButton"
        />
        {deleteModalVisible && (
          <ProductOrderDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={productOrder}
            testID="productOrderDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    productOrder: state.productOrders.productOrder,
    error: state.productOrders.errorOne,
    fetching: state.productOrders.fetchingOne,
    deleting: state.productOrders.deleting,
    errorDeleting: state.productOrders.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductOrder: (id) => dispatch(ProductOrderActions.productOrderRequest(id)),
    getAllProductOrders: (options) => dispatch(ProductOrderActions.productOrderAllRequest(options)),
    deleteProductOrder: (id) => dispatch(ProductOrderActions.productOrderDeleteRequest(id)),
    resetProductOrders: () => dispatch(ProductOrderActions.productOrderReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductOrderDetailScreen);
