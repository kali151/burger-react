import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import Aux from '../../hoc/Auxx/Auxx';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionsTypesBurger from '../../store/actions/index';
import axios from '../../axios-orders';

// export to make tests enabled
const burgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const prc = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuth = useSelector(state => state.auth.token !== null);

    const dispatch = useDispatch();
    const onIngrAdded = (ingName) => dispatch(actionsTypesBurger.addIngredient(ingName));
    const onIngrRemoved = (ingName) => dispatch(actionsTypesBurger.removeIngredient(ingName));
    // useCallback to stop recreating function at init
    const onInitIngredients = useCallback(() =>
        dispatch(actionsTypesBurger.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actionsTypesBurger.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actionsTypesBurger.setAuthRedirectPath(path));

    // const { onInitIngredients } = props;

    useEffect(() => {
        //console.log(props);
        onInitIngredients();
    }, [onInitIngredients])

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if (isAuth) {
            setPurchasing(true)
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }

    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        // alert('You continue!');

        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        onInitPurchase();
        props.history.push({
            pathname: '/checkout'
        });
    }

    const disabledInfo = {
        ...ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngrAdded}
                    ingredientRemoved={onIngrRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuth}
                    price={prc} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            price={prc}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;
    }
    // if ( this.state.loading ) {
    //     orderSummary = <Spinner />;
    // }
    // {salad: true, meat: false, ...}
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

}

export default withErrorHandler(burgerBuilder, axios);