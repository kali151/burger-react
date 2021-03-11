export const updateObject = (old, updatedProps) => {
    return {
        ...old,
        ...updatedProps
    };
};


export const validateForm = (value, rules) => {
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
};