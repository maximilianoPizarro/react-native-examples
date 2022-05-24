import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import ProductActions from './product.reducer';
import ProductCategoryActions from '../product-category/product-category.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './product-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().required().min(0),
  productSize: Yup.string().required(),
  productCategory: Yup.mixed().required(),
});

const Size = [
  {
    label: 'S',
    value: 'S',
  },
  {
    label: 'M',
    value: 'M',
  },
  {
    label: 'L',
    value: 'L',
  },
  {
    label: 'XL',
    value: 'XL',
  },
  {
    label: 'XXL',
    value: 'XXL',
  },
];

function ProductEditScreen(props) {
  const {
    getProduct,
    updateProduct,
    route,
    product,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllProductCategories,
    productCategoryList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getProduct(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getProduct, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(product));
    }
  }, [product, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllProductCategories();
  }, [getAllProductCategories]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('ProductDetail', { entityId: product?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateProduct(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const nameRef = createRef();
  const descriptionRef = createRef();
  const priceRef = createRef();
  const productSizeRef = createRef();
  const imageRef = createRef();
  const imageContentTypeRef = createRef();
  const productCategoryRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="productEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="name"
              ref={nameRef}
              label="Name"
              placeholder="Enter Name"
              testID="nameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => descriptionRef.current?.focus()}
            />
            <FormField
              name="description"
              ref={descriptionRef}
              label="Description"
              placeholder="Enter Description"
              testID="descriptionInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => priceRef.current?.focus()}
            />
            <FormField name="price" ref={priceRef} label="Price" placeholder="Enter Price" testID="priceInput" inputType="number" />
            <FormField
              name="productSize"
              ref={productSizeRef}
              label="Product Size"
              placeholder="Enter Product Size"
              testID="productSizeInput"
              inputType="select-one"
              listItems={Size}
              onSubmitEditing={() => imageRef.current?.focus()}
            />
            <FormField
              name="image"
              ref={imageRef}
              label="Image"
              placeholder="Enter Image"
              testID="imageInput"
              onSubmitEditing={() => imageContentTypeRef.current?.focus()}
            />
            <FormField
              name="imageContentType"
              ref={imageContentTypeRef}
              label="Image Content Type"
              placeholder="Enter Image Content Type"
              testID="imageContentTypeInput"
              inputType="text"
              autoCapitalize="none"
            />
            <FormField
              name="productCategory"
              inputType="select-one"
              ref={productCategoryRef}
              listItems={productCategoryList}
              listItemLabelField="name"
              label="Product Category"
              placeholder="Select Product Category"
              testID="productCategorySelectInput"
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
    name: value.name ?? null,
    description: value.description ?? null,
    price: value.price ?? null,
    productSize: value.productSize ?? null,
    image: value.image ?? null,
    imageContentType: value.imageContentType ?? null,
    productCategory: value.productCategory && value.productCategory.id ? value.productCategory.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    name: value.name ?? null,
    description: value.description ?? null,
    price: value.price ?? null,
    productSize: value.productSize ?? null,
    image: value.image ?? null,
    imageContentType: value.imageContentType ?? null,
  };
  entity.productCategory = value.productCategory ? { id: value.productCategory } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    productCategoryList: state.productCategories.productCategoryList ?? [],
    product: state.products.product,
    fetching: state.products.fetchingOne,
    updating: state.products.updating,
    updateSuccess: state.products.updateSuccess,
    errorUpdating: state.products.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProductCategories: (options) => dispatch(ProductCategoryActions.productCategoryAllRequest(options)),
    getProduct: (id) => dispatch(ProductActions.productRequest(id)),
    getAllProducts: (options) => dispatch(ProductActions.productAllRequest(options)),
    updateProduct: (product) => dispatch(ProductActions.productUpdateRequest(product)),
    reset: () => dispatch(ProductActions.productReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductEditScreen);
