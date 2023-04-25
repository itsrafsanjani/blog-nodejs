import appConfig from "../config/app";

/**
 * Method for removing object properties
 * Example: removeObjectProperties(objOpts, ["option1", "option2"]);
 *
 */
const removeObjectProperties = (obj: any, props: any) => {
  for (let i = 0; i < props.length; i++) {
    delete obj[props[i]];
  }
};

/**
 * Method for getting url
 */
const url = (path: string = "") => {
  if (appConfig.port !== 80) {
    return `${appConfig.appUrl}:${appConfig.port}${path}`;
  }

  return appConfig.appUrl + path;
};

/**
 * Method for getting asset path
 */
const asset = (path: string) => {
  if (!path.startsWith("/")) {
    return url("/" + path);
  }

  return url();
};

export { removeObjectProperties, url, asset };
