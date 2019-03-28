/**
 * Function to check if a value if undefined or null
 * @param val value to be tested
 * @returns TRUE if the val is undefined or null; FALSE otherwise
 */
export const isUndefinedOrNull = val => {
  return val === undefined || val === null;
};

/**
 * Function to check if a value if undefined or null or empty
 * @param val value to be tested
 * @returns TRUE if the val is undefined or null or empty; FALSE otherwise
 */
export const isUndefinedOrNullOrEmpty = val => {
  return val === undefined || val === null || val === "";
};

/**
 * Function to check if a value if empty
 * @param val value to be tested
 * @returns TRUE if the val is defined ano non-null and empty; FALSE otherwise
 */
export const isEmpty = val => {
  return !isUndefinedOrNull(val) && val === "";
};

/**
 * Function to check if the value of any key in the object is undefined or null or empty
 * @param obj object to be checked
 * @returns TRUE if the value of any key of the object is undefined or null or empty; FALSE otherwise
 */
export const isAnyValueOfObjectUndefinedOrNullOrEmpty = obj => {
  let isInvalid = false;
  for (let key in obj) {
    if (isUndefinedOrNullOrEmpty(obj[key])) {
      isInvalid = true;
    }
  }
  return isInvalid;
};

export const assignEmptyStringToAllKeysInObj = obj => {
  if (!isUndefinedOrNull(obj)) {
    for (let key in obj) {
      obj[key] = "";
    }
  }
};

/**
 * Function to build URL parameters and append them to the given URL
 * @param requestUrl string containing the request URL
 * @param urlParametersObj object containing the key-value pairs of the URL parameters
 * @returns the URI-encoded string of the complete URL along with the URL parameters
 */
export const buildUrlWithParameters = (requestUrl, urlParametersObj) => {
  if (!isUndefinedOrNull(urlParametersObj)) {
    let parametersString = "";
    for (let key in urlParametersObj) {
      if (parametersString !== "") {
        parametersString += "&";
      }
      parametersString += key + "=" + encodeURIComponent(urlParametersObj[key]);
    }
    requestUrl += "?" + parametersString;
  }
  return requestUrl;
};

/**
 * Function to make an API call
 * @param requestUrl URL to which the API request is to be made
 * @param urlParametersObj object containing key-value pairs of the parameters to be sent along with the URL
 * @param requestDataBodyObj object containing the request data to be sent along with the body
 * @param apiCallRequestType enum for the type of the request to be made
 * @param requestHeadersObj object containing key-value pairs of the headers to be sent in the request
 * @param successCallback callback function to be executed when the API call is successful
 * @param failCallback callback function to be executed when the API call fails
 */
export const makeApiCall = (
  requestUrl,
  urlParametersObj,
  requestDataBodyObj,
  apiCallRequestType,
  requestHeadersObj,
  successCallback,
  failCallback
) => {
  let xhr = new XMLHttpRequest();
  xhr.open(
    apiCallRequestType,
    buildUrlWithParameters(requestUrl, urlParametersObj)
  );
  if (!isUndefinedOrNull(requestHeadersObj)) {
    for (let key in requestHeadersObj) {
      if (!isUndefinedOrNullOrEmpty(requestHeadersObj[key])) {
        xhr.setRequestHeader(key, requestHeadersObj[key]);
      }
    }
  }
  isUndefinedOrNull(requestDataBodyObj)
    ? xhr.send()
    : xhr.send(JSON.stringify(requestDataBodyObj));
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      if (xhr.status === 200) {
        if (!isUndefinedOrNull(successCallback)) {
          successCallback(this.responseText, this.getAllResponseHeaders());
        }
      } else {
        if (!isUndefinedOrNull(failCallback)) {
          failCallback(this.responseText);
        }
      }
    }
  });
};

/**
 * Function to format date
 * @param time time in seconds
 * @returns formatted date
 * @memberof Profile
 */
export const formatDate = time => {
  return (
    new Date(time * 1000).toLocaleDateString() +
    " " +
    new Date(time * 1000).toLocaleTimeString()
  );
};
