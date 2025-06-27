export const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  export const isValidShortcode = (code) =>
    /^[a-zA-Z0-9]{3,10}$/.test(code);
  
  export const isPositiveInteger = (str) =>
    /^[1-9][0-9]*$/.test(str);