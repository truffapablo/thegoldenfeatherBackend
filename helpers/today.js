const moment = require('moment');

const iniDay = (date) => {
    if(date){
      try {
        date = new Date(date);
        let dateToIso = date.toISOString();
        return `${dateToIso.split('T')[0]}T00:00:00.000Z`;
        
      } catch (error) {
        return null
      }
    }
    return null;
}

const endDay = (date) => {
    
    try {
      if(date){
        date = new Date(date);
        let dateToIso = date.toISOString();
        return `${dateToIso.split('T')[0]}T23:59:59.999Z`;
     }
    } catch (error) {
      return null
    }
  
    return null
  };

const today = () => {
  return moment().format('YYYY-MM-DD');

}

module.exports = {
    iniDay,
    endDay,
    today
}