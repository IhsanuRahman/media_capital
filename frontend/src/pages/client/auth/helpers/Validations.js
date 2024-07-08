import moment from "moment"

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
        if (userData.first_name.length > 15) {
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
    } else if ( moment(userData.dob, "YYYY/MM/DD").isAfter()){
        errors.dob = 'enter your real date of birth'
    }else {
        errors.dob = ''
    }
    if (userData.password.trim() === '') {
        errors.password = 'password is required'
        is_valid = false
    }else if (userData.password.length<4){
        errors.password='password needs atleast 4 characters'
    } else {
        errors.password = ''
    }
    if (userData.confirm_password.trim() === '') {
        errors.confirm_password = 'confirm password is required'
        is_valid = false
    } else {
        errors.confirm_password = ''
    }
    if (userData.password!==userData.confirm_password){
        errors.confirm_password ='passwords are not match'
        is_valid=false
    }
    
    return is_valid
}


export function ProfileValidator(errors, userData) {
    let is_valid = true
    if (userData.username.trim() === '') {
        errors.username = 'username is required'
        is_valid = false
    }
    else {
        if (userData.username.trim().includes(' ')) {
            errors.username = 'space is not allowed in username'
        } else {
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
    // if (userData.email.trim() === '') {
    //     errors.email = 'email is required'
    //     is_valid = false
    // } else {
    //     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    //     if (!regex.test(userData.email.trim())) {
    //         errors.email = 'enter a valid email'
    //         is_valid = false
    //     }else if (userData.email.length < 5) {
    //         errors.email = 'minimum 5 chacters need in email'
    //         is_valid=false
    //     } else {
    //         errors.email = ''
    //     }
    // }
    if (userData.dob === '' || userData.dob === null) {
        errors.dob = 'date of birth is required'
        is_valid = false
    } else {
        errors.dob = ''
    }
    
    return is_valid
}
export default SignupValidator 

export class Validater{
    constructor(fieldValue){
        this.value=fieldValue
        this.is_valid=true
    }
    required(message){
        if (this.value==='' || this.value===null){
            this.is_valid=false
            return message
        }
        this.is_valid=true
        return ''
    }
    maxLength(length,message){
        if (this.value.length>length){
            this.is_valid=false
            return message
        }
        this.is_valid=true
        return ''
    }
    minLength(length,message){
        if (this.value.length<length){
            this.is_valid=false
            return message
        }
        this.is_valid=true
        return ''
    }
    regexTest(regex,message){
        if (regex.test(this.value)){
            this.is_valid=false
            return message
        }
        this.is_valid=true
        return ''
    }

}