import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IProductOrder } from 'app/shared/model/product-order.model';
import { getEntities } from './product-order.reducer';

export const ProductOrder = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const productOrderList = useAppSelector(state => state.productOrder.entities);
  const loading = useAppSelector(state => state.productOrder.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  const { match } = props;

  return (
    <div>
      <h2 id="product-order-heading" data-cy="ProductOrderHeading">
        <Translate contentKey="storeApp.productOrder.home.title">Product Orders</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="storeApp.productOrder.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/product-order/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="storeApp.productOrder.home.createLabel">Create new Product Order</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {productOrderList && productOrderList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="storeApp.productOrder.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="storeApp.productOrder.quantity">Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="storeApp.productOrder.totalPrice">Total Price</Translate>
                </th>
                <th>
                  <Translate contentKey="storeApp.productOrder.product">Product</Translate>
                </th>
                <th>
                  <Translate contentKey="storeApp.productOrder.cart">Cart</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productOrderList.map((productOrder, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/product-order/${productOrder.id}`} color="link" size="sm">
                      {productOrder.id}
                    </Button>
                  </td>
                  <td>{productOrder.quantity}</td>
                  <td>{productOrder.totalPrice}</td>
                  <td>{productOrder.product ? <Link to={`/product/${productOrder.product.id}`}>{productOrder.product.name}</Link> : ''}</td>
                  <td>{productOrder.cart ? <Link to={`/shopping-cart/${productOrder.cart.id}`}>{productOrder.cart.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/product-order/${productOrder.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/product-order/${productOrder.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/product-order/${productOrder.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="storeApp.productOrder.home.notFound">No Product Orders found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductOrder;
