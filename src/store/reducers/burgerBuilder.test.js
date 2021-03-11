import reducer from './burgerBuilder';
import * as actionTypes from '../actions/actionTypes';

const ingrs = {
    salad: 2,
    cheese: 2,
    meat: 8,
    bacon: 2
}

describe('burger reducer', () => {
    it('should return the init state', () => {
        expect(reducer(undefined, {})).toEqual({
            ingredients: null,
            totalPrice: 15.50,
            error: false,
            building: false
        });
    });

    // it('should add ingredients', () => {
    //     expect({
    //         'salad': 0,
    //         'cheese': 0,
    //         'meat': 0,
    //         'bacon': 0
    //     }, {
    //         type: actionTypes.ADD_INGREDIENT, 
    //         'salad': 3,
    //         'meat': 5
    //     }).toEqual({
    //         'salad': 3,
    //         'cheese': 0,
    //         'meat': 5,
    //         'bacon': 0
    //     })  
    // })
});