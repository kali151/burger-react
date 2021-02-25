import React from 'react';
import classes from './Input.css'

const input = (props) => {
    let inputEl = null;

    switch (props.elementType) {
        case ('input'):
            inputEl = <input
                className={classes.InputEl}
                {...props.elementConfig}
                value={props.value} 
                onChange={props.changed}/>;
            break;
        case ('textarea'):
            inputEl = <input
                className={classes.InputEl}
                {...props.elementConfig}
                value={props.value} 
                onChange={props.changed}/>;
            break;
        case ('select'):
            inputEl = (
            <select
                className={classes.InputEl}
                value={props.value} 
                onChange={props.changed}>
                {props.elementConfig.options.map(option => (
                    <option key={option.value}
                        value={option.value}>
                        {option.displayValue}
                    </option>
                ))}
            </select>
            );
            break;            
        default:
            inputEl = <input
                className={classes.InputEl}
                {...props.elementConfig}
                value={props.value} 
                onChange={props.changed}/>;
            break;
    }

    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputEl}
        </div>
    )

};

export default input;