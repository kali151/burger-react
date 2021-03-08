import * as actionTypes from './actionTypes'
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (data) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: data
    }; 
};

export const authFail = (err) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err
    }; 
};

export const auth = (email, password) => {
    const API_KEY='AIzaSyCJzKukFMXVWKrQcd26UF0QRLh4jE5uzpU';

    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
 
    // let isSignUp = true;
    // if (!isSignUp) {
    //   url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    // }
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
        console.log("logging url: ", url, "authData: ", authData);
        axios.post(url, authData)
            .then(response => {
                console.log("auth ok: ", response);
                dispatch(authSuccess(response.data));
            })
            .catch(err => {
                console.log("auth error: ", err);
                dispatch(authFail(err));
            })
    }; 
};
