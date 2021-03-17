import { takeEvery, all, takeLatest} from 'redux-saga/effects';
import { logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga} from './auth';
import * as actionTypes from '../actions/actionTypes'
import { initIngredientsSaga } from './burgerBuilder';
import { fetchOrdersSaga, purchaseBurgerSaga } from './order';

export function* watchAuth() {
    yield all([
         takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
         takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga),
         takeEvery(actionTypes.AUTH_USER, authUserSaga),
         takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
    ])

    // yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    // yield takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga);
    // yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    // yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);

    // It can be moved to other watchers and enable them in index.js
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
    yield takeLatest(actionTypes.PURCHASE_BURGER_INIT, purchaseBurgerSaga);
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}
