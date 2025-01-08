function addMinutesToDate(date, minute){
    return new Date(date.getTime() + minute * 60_000)
}

module.exports = addMinutesToDate