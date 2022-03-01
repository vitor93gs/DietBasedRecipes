async function checkDisabled(model, user){
    const isEnabled = await model.findOne({ _id : user._id })
    if(isEnabled.isDisabled){
        return false
    }
    return true
}
module.exports = checkDisabled