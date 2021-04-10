module.exports = {
    formatDate: function(date, format) {
        var newDate = new Date(date);
        // console.log({date, newDate});
        var dd = newDate.getDate();
        var mm = newDate.getMonth()+1; 
        var yyyy = newDate.getFullYear();
        
        if(dd<10){
            dd='0'+dd;
        } 

        if(mm<10) {
            mm='0'+mm;
        } 
        switch (format) {
            case 'mm-dd-yyyy':
                newDate = mm + '-' + dd + '-' + yyyy;
                break; 

            case 'yyyy-mm-dd':
                newDate = yyyy + '-' + mm + '-' + dd;
                break;
                 
            default:
                newDate = mm + '-' + dd + '-' + yyyy;
                break;
        }
        
        return newDate;
    },
    newDate: function(date){
        date = new Date(date)
        var newDate = new Date(date.setDate(date.getDate() + 1));
        return this.formatDate(newDate);
    }
}