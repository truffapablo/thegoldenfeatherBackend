const isPositive = (value) => {
    if(!value) {
        return false;
    }
    if(value > 0) {
        return true;
    }else {
        return false;
    }
}

module.exports = {isPositive};