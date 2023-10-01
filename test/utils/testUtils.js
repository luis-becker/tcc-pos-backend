testUtils = function() {
    function isDeepEqual(obj1, obj2){
        obj1Keys = Object.keys(obj1)
        if(obj1Keys.length === 0) return obj1 === obj2

        return obj1Keys.reduce((acc, key) => {
            return isDeepEqual(obj1[key], obj2[key]) && acc
        }, true)
    }

    return {
        isDeepEqual
    }
}

module.exports = testUtils