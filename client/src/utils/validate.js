export const validate = (fieldName, value) => {
    let errors = {};
    let fieldValid = '';

    switch(fieldName){
        case 'username':
            if(!value)
                errors.username = 'Username is required';
            else if(!/^[a-zA-Z0-9_]*$/.test(value))
                errors.username = 'Username must contain alphanumeric characters only';
            else if(value.length < 5)
                errors.username = 'Username must contain atleast 5 characters';
            else
                errors.username = '';
            break;
        case 'email':
            fieldValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            errors.email = fieldValid ? '' : 'Email is invalid';
            break;
        case 'password':
            if(!value)
                errors.password = 'Password is required';
            else if(value.length < 6)
                errors.password = 'Password must contain atleast 6 characters';
            else
                errors.password = '';
            break;
        default:
            break;
    }

    return errors;
}