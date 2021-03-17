import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';

import * as actions from '../actions/index';

export function* purchaseBurgerSaga(action) {
    yield put(actions.purchaseStart());

    try {
        console.log("order data: ", action.token, action.data);
        const response = yield axios.post( '/orders.json?auth=' + action.token, action.data )
        yield put(actions.purchaseSuccess(response.data.name, action.data));
    } catch (err){
        yield put(actions.purchaseFailed(err));
    }
}

export function* fetchOrdersSaga(action) {
    yield put(actions.fetchOrdersStart());
    
    try {
        const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
        const res = yield axios.get('/orders.json' + queryParams)

        const fetchedOrders = [];
        console.log("res data: ", res.data);
        for (let key in res.data) {
            fetchedOrders.push({
                ...res.data[key],
                id: key
            });
        }
        yield put(actions.fetchOrdersSuccess(fetchedOrders));
    } catch (err) {
        yield put(actions.fetchOrdersFailed(err))
    }
}