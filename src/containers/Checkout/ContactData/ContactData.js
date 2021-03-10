import React, { Component } from 'react';
import {connect} from 'react-redux'

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
// import { purchaseBurger } from '../../../store/actions/order';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'your name'
                },
                value: 'Coco',
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
                        {value: 'fastest', displayValue: 'Fast'},
                        {value: 'cheapest', displayValue: 'Cheap'}
                    ]
                },
                valid: true,
                value: 'fastest',
                validation: {
                    // required: false
                }
            }
        },
        formIsValid: false
    }

    
    orderHandler = ( event ) => {
        event.preventDefault();
        const formData = {};

        for (let formEl in this.state.orderForm) {
            formData[formEl] = this.state.orderForm[formEl].value;
        }
      //  console.log("form data: ", formData);

        const order = {
            ingredients: this.props.ings,
            price: this.props.prc,
            orderData: formData
        }

        this.props.onOrder(order, this.props.token)
    }

    validateForm(value, rules) {
        let isValid= true;

        if (!rules) {
            return true;
        }

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
         
        return isValid;
    }

    inputChangedHandler = (event, inputId) => {
        //console.log(event.target.value);
        const updatedForm = {
            ...this.state.orderForm
        };
        //clone deeply
        const updatedElement = {
            ...updatedForm[inputId]
        };
        updatedElement.value = event.target.value;
        // validation
        updatedElement.touched = true;
        updatedElement.valid = this.validateForm(updatedElement.value, updatedElement.validation);
        updatedForm[inputId] = updatedElement;

        let formValid = true;
        for (let el in updatedForm) {
            formValid = updatedForm[el].valid && formValid;
        }
        console.log("updatedForm: ", updatedForm.zipCode.valid);
        this.setState({orderForm: updatedForm,
            formIsValid: formValid});
    }

    render () {
        // obj to array
        const formElements = [];
        for (let key in this.state.orderForm) {
            formElements.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
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
                        changed={(event) => this.inputChangedHandler(event, el.id)}/>
                )

                )}
                {/* <Input inputtype="input" type="email" name="email" placeholder="Your Mail" />
                <Input inputtype="input" type="text" name="street" placeholder="Street" />
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" /> */}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        prc: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrder: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));