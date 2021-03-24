import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

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

    useEffect(() => {
        console.log(props);
        props.onInitIngredients();
    }, [])

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
        if (props.isAuth) {
            setPurchasing(true)
        } else {
            props.onSetAuthRedirectPath('/checkout');
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
        props.onInitPurchase();
        props.history.push({
            pathname: '/checkout'
        });
    }

    const disabledInfo = {
        ...props.ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls
                    ingredientAdded={props.onIngrAdded}
                    ingredientRemoved={props.onIngrRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuth}
                    price={props.prc} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={props.ings}
            price={props.prc}
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        prc: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null,

    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngrAdded: (ingName) => dispatch(actionsTypesBurger.addIngredient(ingName)),
        onIngrRemoved: (ingName) => dispatch(actionsTypesBurger.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actionsTypesBurger.initIngredients()),
        onInitPurchase: () => dispatch(actionsTypesBurger.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionsTypesBurger.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));