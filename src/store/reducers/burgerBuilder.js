import * as actionsTypes from '../actions/actionTypes'

const initialState = {
    ingredients: null,
    // {
    //     salad: 0,
    //     bacon: 0,
    //     cheese: 0,
    //     meat: 0
    // },
    totalPrice: 15.50,
    error: false
}

const INGREDIENT_PRICES = {
    salad: 2,
    cheese: 2,
    meat: 8,
    bacon: 3.5
};

const reducer = (state = initialState, action ) => {

    switch(action.type) {
        case actionsTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            };
        case actionsTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] -1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            };
        case actionsTypes.SET_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                totalPrice: 15.50,
                error: false
            }
        case actionsTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true
            }
        default: 
            return state;
    }
};

export default reducer