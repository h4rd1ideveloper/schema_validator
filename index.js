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
            validators.value = objectToVerifyKeys;

            function ifNeedThrowInvalidArgumentException(requiredKeys) {
                if ((
                        !isValidValueWithTypeOf(requiredKeys, 'array') &&
                        !isValidValueWithTypeOf(requiredKeys, 'object')
                    ) ||
                    !isValidValueWithTypeOf(validators.value, "object")
                ) {
                    const requiredKeysType = typeof validators.value,
                        objectToVerifyKeysType = typeof requiredKeys;
                    validators.value = null;
                    throw new Error("requiredKeys  must be a array of index, but given: " + requiredKeysType + ". objectToVerifyKeys must be a object, but given: " + objectToVerifyKeysType);
                }
            }

            ifNeedThrowInvalidArgumentException([]);
            return {
                every: function (requiredKeys) {
                    ifNeedThrowInvalidArgumentException(requiredKeys);
                    if (isValidValueWithTypeOf(requiredKeys, 'array')) {
                        for (const requiredKey of requiredKeys) if (
                            !validators.value.hasOwnProperty(requiredKey)
                        ) return false;
                    } else {
                        for (const [key, type] of Object.entries(requiredKeys)) if (!validators.value.hasOwnProperty(key)) {
                            return false;
                        } else if (!isValidValueWithTypeOf(type, 'function')) {
                            if (callPrototypeToString(type.prototype) !== callPrototypeToString(validators.value[key])) {
                                return false;
                            }
                        } else if (
                            isValidValueWithTypeOf(validators.value[key], 'object') && !(type(validators.value[key]))
                        ) {
                            return false
                        }
                    }

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
