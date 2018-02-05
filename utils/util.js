let getFlag = (ctx, cb) => {
  let tableId = getApp().globalData.tableFlagId,
    Flags = new wx.BaaS.TableObject(tableId)

  Flags.find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

let addResult = (ctx, cb) => {
  let tableId = getApp().globalData.tableResultId
  let globalUser = getApp().globalData.userInfo

  let Result = new wx.BaaS.TableObject(tableId)
  let result = Result.create()
  let user = globalUser.nickName
  let flag = ctx.data.userFlag
  let city = getApp().globalData.cityName

  let data = {
    user,
    flag,
    city,
  }

  result.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))
}

function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

module.exports = {
  getFlag: getFlag,
  isEmptyObject: isEmptyObject,
  addResult: addResult,
}