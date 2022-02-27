import Payment from 'payment';

/**
 * For check and format credit Number valid formation
 * @param {string} creditCardNumbers 
 */
export function controlAndShapeCreditCardNumber(creditCardNumbers) {
    if (!creditCardNumbers) {
        return creditCardNumbers;
    }
    // check all creditCardNumbers string with regex to avoid any char except number
    const clearValue = purgeNumber(creditCardNumbers);
    if(parseInt(clearValue.slice(0, 1)) === 4 || parseInt(clearValue.slice(0, 1)) === 5 ){
        let nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8, )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;
        return nextValue.trim();
    } else {
        return false;
    }
   
}

/**
 * For formatting CVC number
 * @param {*} value 
 * @param {*} prevValue 
 * @param {*} allValues 
 */
export function controlAndShapeCVC(value, prevValue, allValues = {}) {
    const clearValue = purgeNumber(value);
    let maxLength = 3;

    if (allValues.number) {
        const issuer = Payment.fns.cardType(allValues.number);
    }

    return clearValue.slice(0, maxLength);
}

/**
 * For checking and shaping expiration date
 * We already checked with regular expression on the Input
 * @param {*} value 
 */
export function controlAndShapeExpirationDate(value) {
    const clearValue = purgeNumber(value);
    if (clearValue.length > 3) {
        if(parseInt(clearValue.slice(2, 4)) > 22 && parseInt(clearValue.slice(0, 2)) < 13) {
            return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
        } else {
            return false;
        }
    }

    return clearValue;
}

/**
 * Map form data for showing
 * @param {*} data 
 */
export function controlAndShapeFormData(data) {
    return Object.keys(data).map(d => `${d}: ${data[d]}`);
}


/**
 * For clearize number
 * This regex matches any character that's not digit
 * @param {*} value 
 */
function purgeNumber(value = '') {
    const regex = /\D+/g;
    return value.replace(regex, '');
}

