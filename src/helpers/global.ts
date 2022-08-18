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

export { removeObjectProperties };
