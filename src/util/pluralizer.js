
// takes a number (int or float) and returns an 's' or empty str
module.export = (number) => {
  switch (number.toString()) {
    case '1':
      return '';
    default:
      return 's';
  }
}
