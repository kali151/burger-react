import React, { useState } from 'react';
import { connect } from 'react-redux'

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, validateForm } from '../../../shared/utility';

const contactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'your name'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true
            }
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'your street'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true
            }
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'your zip code'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            }
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'your country'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true
            }
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'your mail'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true
            }
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'fastest', displayValue: 'Fast' },
                    { value: 'cheapest', displayValue: 'Cheap' }
                ]
            },
            valid: true,
            value: 'fastest',
            validation: {
                // required: false
            }
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);


    const orderHandler = (event) => {
        event.preventDefault();
        const formData = {};

        for (let formEl in orderForm) {
            formData[formEl] = orderForm[formEl].value;
        }
        //  console.log("form data: ", formData);

        const order = {
            ingredients: props.ings,
            price: props.prc,
            orderData: formData,
            userId: props.userId
        }

        props.onOrder(order, props.token)
    }

    const inputChangedHandler = (event, inputId) => {
        //clone deeply
        const updatedElement = updateObject(orderForm[inputId], {
            value: event.target.value,
            valid: validateForm(event.target.value, orderForm[inputId].validation),
            touched: true
        });

        const updatedForm = updateObject(orderForm, {
            [inputId]: updatedElement
        });

        let formValid = true;
        for (let el in updatedForm) {
            formValid = updatedForm[el].valid && formValid;
        }
        // console.log("updatedForm: ", updatedForm.zipCode.valid);
        setOrderForm(updatedForm);
        setFormIsValid(formValid);
    }

    // obj to array
    const formElements = [];
    for (let key in orderForm) {
        formElements.push({
            id: key,
            config: orderForm[key]
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {/* <Input elementType="..." elementConfig="..." value="..." /> */}
            {formElements.map(el => (
                <Input
                    key={el.id}
                    elementType={el.config.elementType}
                    elementConfig={el.config.elementConfig}
                    value={el.config.value}
                    invalid={!el.config.valid}
                    shouldValidate={el.config.validation}
                    touched={el.config.touched}
                    changed={(event) => inputChangedHandler(event, el.id)} />
            )

            )}
            {/* <Input inputtype="input" type="email" name="email" placeholder="Your Mail" />
                <Input inputtype="input" type="text" name="street" placeholder="Street" />
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" /> */}
            <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
        </form>
    );

    if (props.loading) {
        form = <Spinner />;
    }
    return (
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        prc: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrder: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));