import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseSuccess = (id, data) => {
    return {
        type: actionTypes.PURCHASE_SUCCESS,
        orderId: id,
        orderData: data
    }
}

export const purchaseFailed = (error) => {
    return {
        type: actionTypes.PURCHASE_FAILED,
        error: error
    }
};

export const purchaseStart = () => {
    return {
        type: actionTypes.PURCHASE_START
    }
}

export const purchaseBurger = (data, token) => {
    return dispatch => {
        dispatch(purchaseStart());
        axios.post( '/orders.json?auth=' + token, data )
            .then( response => {
                //cosole.log("response data: ", response.data);
                dispatch(purchaseSuccess(response.data.name, data));
                // this.setState( { loading: false } );
                // this.props.history.push('/');
            } )
            .catch( error => {
                dispatch(purchaseFailed(error));
                // this.setState( { loading: false } );
            } );
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFailed = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAILED,
        error: error
    }
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
};

export const fetchOrders = (token, userId) => {
    return dispach => {
        dispach(fetchOrdersStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json' + queryParams)
        .then(res => {
            const fetchedOrders = [];
            //cosole.log("res data: ", res.data);
            for (let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            dispach(fetchOrdersSuccess(fetchedOrders));
        })
        .catch(err => {
            dispach(fetchOrdersFailed(err))
        });
    }
}