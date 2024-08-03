
// 숫자 판별
export const isNumber = (value : any) => {
  if (value) {
    const numberPattern = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    return numberPattern.test(value);
  } else {
    return false;
  }
};

// uuid 생성
export const uuid = () => {
  return "xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : r & (0x3 | 0x8);
    return v.toString(16);
  });
}


