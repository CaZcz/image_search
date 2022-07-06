const app = getApp()

Page({
  data: {
    update: '',
    basic: {},
    today: {},
    tomorrow: {},
    afterTomor: {},
    todyIcon: '../../images/icons/999.svg',
    tomorrowIcon: '../../images/icons/999.svg',
    afterTomorIcon: '../../images/icons/999.svg',
    geo_location: "116.480881,39.989410",
    weather_now: "",
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  onShow: function () {
    this.getLocation();
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getWeatherInfo(latitude, longitude);
        // 逆地理编码获取省市区
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo?parameters',
          data:{
            key: 'ee4776c6af367a2346340399d32ee9a6',
            location:res.longitude + ',' + res.latitude
          },
          success(res){
            // 将省市区存入
            console.log("当前逆地理编码",res.data.regeocode.addressComponent)
            
            const city = res.data.regeocode.addressComponent.city
            const district = res.data.regeocode.addressComponent.district
            that.setData({
              region:[city,district]
            })
            console.log(that.data)
          }
        })
      }
    })
  },
  
  getWeatherInfo: function (latitude, longitude) {
    var _this = this;
    var key = '3ebadea7b76c4a8ca42933a6353679b4';//你自己的key
    //需要在微信公众号的设置-开发设置中配置服务器域名
    var url = 'https://devapi.qweather.com/v7/weather/3d?key=' + key + '&location=' + longitude + ',' + latitude;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log('tianqi', res)
        var daily_forecast_today = res.data.daily[0];//今天预报
        var daily_forecast_tomorrow = res.data.daily[1];//明天天预报
        var daily_forecast_afterTomor = res.data.daily[2];//后天预报

        var update = res.data.updateTime;//更新时间
        _this.setData({
          update: update,

          today: daily_forecast_today,
          tomorrow: daily_forecast_tomorrow,
          afterTomor: daily_forecast_afterTomor,
          todyIcon: '../../images/icons/' + daily_forecast_today.iconDay + '.svg', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
          tomorrowIcon: '../../images/icons/' + daily_forecast_tomorrow.iconDay + '.svg',
          afterTomorIcon: '../../images/icons/' + daily_forecast_afterTomor.iconDay + '.svg'
        });
      }
    })
  }
  
})
