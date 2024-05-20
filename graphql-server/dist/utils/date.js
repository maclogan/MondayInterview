export const dateToString = (date, dateLocale = 'en-US') => {
    return date.toLocaleDateString(dateLocale);
};
export const stringToDate = (date) => {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
};
