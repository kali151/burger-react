import { put, delay, call } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* logoutSaga(action) {
    yield call([localStorage, 'removeItem'], "token");
    //yield localStorage.removeItem('token');
    yield localStorage.removeItem('expDate');
    yield localStorage.removeItem('userId');

    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expTime * 1000);
    yield put(actions.logout());
};

export function* authUserSaga(action) {
    yield put(actions.authStart());

    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };

    const API_KEY = process.env.REACT_APP_API_KEY;

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    if (!action.isSignUp) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }
    // console.log("logging url: ", url, "authData: ", authData);
    try {
        const response = yield axios.post(url, authData);

        const expDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
        // console.log("auth ok: ", response);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('expDate', expDate)
        yield localStorage.setItem('userId', response.data.localId);
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch (err) {
        // console.log("auth error: ", err);
        yield put(actions.authFail(err.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if (!token) {
        yield put(actions.logout());
    } else {
        const expDate = yield new Date(localStorage.getItem('expDate'));
        // console.log("expDate: ", expDate, " new Date: ", new Date());
        if (expDate > new Date()) {
            const userId = yield localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout((expDate.getTime() - new Date().getTime()) / 1000));
        } else {
            yield put(actions.logout())
        }
    }
}