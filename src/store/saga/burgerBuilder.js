import { put } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* initIngredientsSaga() {
    try {
        const response = yield axios.get( 'https://react-burger-b8545-default-rtdb.firebaseio.com/ingredients.json' )
        yield put(actions.setIngredients(response.data));
    } catch (err){
        yield put(actions.fetchIngredientsFailed(err));
    }
    
}