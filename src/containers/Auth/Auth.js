import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { updateObject, validateForm } from '../../shared/utility';

const auth = props => {

    const [authForm, setAuhForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true,
                isEmail: true
            }
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true,
                minLength: 6
            }
        }
    });

    const [isSignup, setIsSignup] = useState(true)

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;
    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                valid: validateForm(event.target.value, authForm[controlName].validation),
                touched: true
            })
        });
        setAuhForm(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup)
    }

    const formElements = [];
    for (let key in authForm) {
        formElements.push({
            id: key,
            config: authForm[key]
        });
    }
    let form = formElements.map(el => (
        <Input
            key={el.id}
            elementType={el.config.elementType}
            elementConfig={el.config.elementConfig}
            value={el.config.value}
            invalid={!el.config.valid}
            shouldValidate={el.config.validation}
            touched={el.config.touched}
            changed={(event) => inputChangedHandler(event, el.id)}
        />
    ));

    if (props.loading) {
        form = <Spinner />
    }

    let errorMsg = null;
    if (props.error) {
        errorMsg = (
            <p>{props.error.message}</p> //firebase only
        )
    }

    let authRedirect = null;
    if (props.isAuth) {
        authRedirect = <Redirect to={props.authRedirectPath} />;
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMsg}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
            </Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(auth);