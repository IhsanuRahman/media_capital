
function SignupValidator(errors, userData) {
    let is_valid = true
    if (userData.username.trim() === '') {
        errors.username = 'username is required'
        is_valid = false
    }
    else {
        if (userData.username.trim().includes(' ')) {
            errors.username = 'space is not allowed in username'
        } else {
            console.log(errors.username);
            if (errors.username.length > 15) {
                errors.username = 'only maximum 15 chacters is allowed in username'
            } else
                errors.username = ''
        }
    }
    if (userData.first_name.trim() === '') {
        errors.first_name = 'first name is required'
        is_valid = false
    } else {
        if (errors.first_name.length > 15) {
            errors.first_name = 'only maximum 15 chacters is allowed in first name'
        } else
            errors.first_name = ''
    }
    if (userData.last_name.trim() === '') {
        errors.last_name = 'last name is required'
        is_valid = false
    } else {
        if (errors.last_name.length > 15) {
            errors.last_name = 'only maximum 15 chacters is allowed in last name'
        } else
            errors.last_name = ''
    }
    if (userData.email.trim() === '') {
        errors.email = 'email is required'
        is_valid = false
    } else {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(userData.email.trim())) {
            errors.email = 'enter a valid email'
            is_valid = false
        }else if (userData.email.length < 5) {
            errors.email = 'minimum 5 chacters need in email'
            is_valid=false
        } else {
            errors.email = ''
        }
    }
    if (userData.dob === '' || userData.dob === null) {
        errors.dob = 'date of birth is required'
        is_valid = false
    } else {
        errors.dob = ''
    }
    if (userData.password.trim() === '') {
        errors.password = 'password is required'
        is_valid = false
    } else {
        errors.password = ''
    }
    if (userData.conform_password.trim() === '') {
        errors.conform_password = 'conform password is required'
        is_valid = false
    } else {
        errors.conform_password = ''
    }
    if (userData.password!==userData.conform_password){
        errors.conform_password ='passwords are not match'
        is_valid=false
    }
    return is_valid
}


export function ProfileValidator(errors, userData) {
    let is_valid = true
    console.log('firstname',userData.first_name);
    if (userData.username.trim() === '') {
        errors.username = 'username is required'
        is_valid = false
    }
    else {
        if (userData.username.trim().includes(' ')) {
            errors.username = 'space is not allowed in username'
        } else {
            console.log(errors.username);
            if (errors.username.length > 15) {
                errors.username = 'only maximum 15 chacters is allowed in first name'
            } else
                errors.username = ''
        }
    }
    if (userData.first_name.trim() === '') {
        errors.first_name = 'first name is required'
        is_valid = false
    } else {
        if (errors.first_name.length > 15) {
            errors.first_name = 'only maximum 15 chacters is allowed in first name'
        } else
            errors.first_name = ''
    }
    if (userData.last_name.trim() === '') {
        errors.last_name = 'last name is required'
        is_valid = false
    } else {
        if (errors.last_name.length > 15) {
            errors.last_name = 'only maximum 15 chacters is allowed in last name'
        } else
            errors.last_name = ''
    }
    if (userData.email.trim() === '') {
        errors.email = 'email is required'
        is_valid = false
    } else {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(userData.email.trim())) {
            errors.email = 'enter a valid email'
            is_valid = false
        }else if (userData.email.length < 5) {
            errors.email = 'minimum 5 chacters need in email'
            is_valid=false
        } else {
            errors.email = ''
        }
    }
    if (userData.dob === '' || userData.dob === null) {
        errors.dob = 'date of birth is required'
        is_valid = false
    } else {
        errors.dob = ''
    }
    
    return is_valid
}
export default SignupValidator 