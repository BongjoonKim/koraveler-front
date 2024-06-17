
// 숫자 판별
export const isNumber = (value : any) => {
  if (value) {
    const numberPattern = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    return numberPattern.test(value);
  } else {
    return false;
  }
};

