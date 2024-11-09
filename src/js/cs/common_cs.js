export const cs_toCsErrType = async (errCode) => {
  if (errCode == 0) {
    return 'Etc';
  } else if (errCode == 1) {
    return 'MathContents';
  } else if (errCode == 2) {
    return 'MathResource';
  } else if (errCode == 3) {
    return 'MathDocs';
  } else if (errCode == 4) {
    return 'MathEditor';
  } else {
    return 'HwpConvert';
  }
};
