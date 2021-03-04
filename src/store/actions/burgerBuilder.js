import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import {updateObject} from '../utility';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = (ings) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ings
    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients = () => {
    return dispatch => {
        axios.get( 'https://react-burger-b8545-default-rtdb.firebaseio.com/ingredients.json' )
        .then( response => {
            dispatch(setIngredients(response.data));
        } )
        .catch( error => {
            dispatch(fetchIngredientsFailed());
        } );
    }
}