import * as actionsTypes from '../actions/actionTypes'
import {updateObject} from '../utility';

const initialState = {
    ingredients: null,
    // {
    //     salad: 0,
    //     bacon: 0,
    //     cheese: 0,
    //     meat: 0
    // },
    totalPrice: 15.50,
    error: false,
    building: false
}

const INGREDIENT_PRICES = {
    salad: 2,
    cheese: 2,
    meat: 8,
    bacon: 3.5
};

const addIngredient = (state, action) => {
    const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1}
    const updatedIngs = updateObject(state.ingredients, updatedIng)
    const updatedState = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
    const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1}
    const updatedIngs = updateObject(state.ingredients, updatedIng)
    const updatedState = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject(state, updatedState);
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        totalPrice: 15.50,
        error: false,
        building: false
    })
}
const reducer = (state = initialState, action ) => {

    switch(action.type) {
        case actionsTypes.ADD_INGREDIENT:
            return addIngredient(state, action)
        case actionsTypes.REMOVE_INGREDIENT:
            return removeIngredient(state, action)
        case actionsTypes.SET_INGREDIENTS:
            return setIngredients(state, action)
        case actionsTypes.FETCH_INGREDIENTS_FAILED:
            return updateObject(state, {error: true})
        default: 
            return state;
    }
};

export default reducer