function modelMocker(model, objList) {
    class modelMock {

        static objList = objList || []

        constructor(params) {
            this.obj = new model(params)
            this._doc = this.obj._doc
            for (const key in this.obj._doc) {
                this[key] = this.obj._doc[key];
            }
        }

        save() {
            return this.obj.validate().then(() => {
                return this
            }).catch(err => {
                throw err
            })
        }

        static async find(params) {
            return this.objList.map(obj => new this(obj))
        }

        static async findOne(params) {
            if(this.objList.length > 0) {
                return new this(this.objList[0])
            }
            return null
        }

        static async findOneAndUpdate(params) {
            if(this.objList.length > 0) {
                let obj = new this(this.objList[0])
                return obj.save()
            }
            return null
        }
    }
    return modelMock
}

module.exports = modelMocker