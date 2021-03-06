const varExtractor = new RegExp("return (.*);");
export function getVariableName<TResult>(name: () => TResult) {
    const  m = varExtractor.exec(name + "");
    if (m == null) throw new Error("The function does not contain a statement matching 'return variableName;'");
    return m[1];
}