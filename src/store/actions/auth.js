import * as actionTypes from './actionTypes'
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }; 
};

export const authFail = (err) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err
    }; 
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expTime* 1000)
    }
}
export const auth = (email, password, isSignUp) => {
    const API_KEY='AIzaSyCJzKukFMXVWKrQcd26UF0QRLh4jE5uzpU';

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
 
    if (!isSignUp) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        console.log("logging url: ", url, "authData: ", authData);
        axios.post(url, authData)
            .then(response => {
                const expDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                console.log("auth ok: ", response);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expDate', expDate)
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log("auth error: ", err);
                dispatch(authFail(err.response.data.error));
            })
    }; 
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expDate = new Date(localStorage.getItem('expDate'));
            console.log("expDate: ", expDate, " new Date: ", new Date());
            if (expDate > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expDate.getTime() - new Date().getTime())/1000));
            } else {
                dispatch(logout())
            }
        }
    }
}