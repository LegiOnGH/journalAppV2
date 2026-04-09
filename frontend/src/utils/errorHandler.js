export function parseError(error){
    const response = error?.response;
    const data = response?. data;

    let message = "Something went wrong...";
    let fieldErrors = {};
    let status = response?.status;

    if(data?.errors){
        message = data.message || "Validation failed";
        fieldErrors = data.errors;
    }else if(data?.message){
        message = data.message;
    }
    return { message, fieldErrors, status,
        isValidationError:  !!data?.errors,
        isBadRequest: status === 400 && !data?.errors,
        isUnauthorized: status === 401,
        isForbidden: status === 403,
        isNotFound: status === 404,
        isServerError: status >= 500
     };
}