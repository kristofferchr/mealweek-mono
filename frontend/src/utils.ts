export {}


const getWeekNumber = (date: Date) => {
  // Copy date so don't modify original
  date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(
    date.getUTCDate() + 4 - (date.getUTCDay() || 7)
  );

  // Get first day of year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 +
      1) /
      7
  );

  // Return array of year and week number
  return weekNo;
};

export const getMondayOfWeek = (date: Date): Date => {
  const newDate = date
  const dateDay = date.getDay()
  if(dateDay !== 1) {
    if(dateDay === 0) {
      newDate.setDate(date.getDate() - 1)
    } else {
      const difference = dateDay - 1
      newDate.setDate(date.getDate() - difference)
    }
  }

  return newDate
}

export default getWeekNumber;
