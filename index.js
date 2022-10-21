let isValid = function isValid(value) {
    return value !== undefined && value !== null;
};

let capitalize = function capitalize(s) {
    return !isValid(s) || typeof s !== "string"
        ? ""
        : s.charAt(0).toUpperCase() + s.slice(1);
};

let callPrototypeToString = function callPrototypeToString(value) {
    let _Object$prototype$toS;

    return String(
        (_Object$prototype$toS = Object.prototype.toString.call(value)) !==
        null && _Object$prototype$toS !== void 0
            ? _Object$prototype$toS
            : ""
    );
};

let isValidValueWithTypeOf = function isValidValueWithTypeOf(value, _typeof) {
    return (
        isValid(value) &&
        callPrototypeToString(value) ===
        "[object ".concat(capitalize(_typeof), "]")
    );
};

function schema(keys) {
    let validators = {
        value: null,
        object: function (objectToVerifyKeys) {
            function ifNeedThrowInvalidArgumentException(requiredKeys) {
                if (!Array.isArray(requiredKeys) || typeof validators.value !== "object") {
                    const requiredKeysType = typeof validators.value,
                        objectToVerifyKeysType = typeof requiredKeys;
                    validators.value = null;
                    throw new Error("requiredKeys  must be a array of index, but given: " + requiredKeysType + ". objectToVerifyKeys must be a object, but given: " + objectToVerifyKeysType);
                }
            }

            validators.value = objectToVerifyKeys;
            ifNeedThrowInvalidArgumentException([]);
            return {
                every: function (requiredKeys) {
                    ifNeedThrowInvalidArgumentException(requiredKeys);
                    for (var index = 0; index < requiredKeys.length; index++) if (
                        !validators.value.hasOwnProperty(requiredKeys[index])
                    ) return false;

                    return !!requiredKeys;
                },
                some: function objectHasSomeKey(requiredKeys) {
                    ifNeedThrowInvalidArgumentException(requiredKeys);
                    return Object.keys(validators.value).reduce(function (hasSomeKey, key) {
                        return requiredKeys.includes(key) || hasSomeKey;
                    }, false);
                }
            };
        }
    };
    return {
        hasKeys: (object) => validators.object(object).every(keys),
        hasSomeKey: (object) => validators.object(object).some(keys)
    }
}

module.exports = {schema}
