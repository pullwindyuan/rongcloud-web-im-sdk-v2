describe "Navi Test",->
  it "1",->
    #rongSDK为判断是否向服务器发起请求条件之一，本应该设置通道连接成功之后，没有联调，所以设置于此
    RongIMLib.CookieHelper.createStorage().setItem "rongSDK","WebSocket"
    nvai = new RongIMLib.Navigate()
    callback =
      onSuccess: ->
        console.log "connect---successs"

      onError: ->
        console.log "connect--error"

    nvai.connect  "cpj2xarlj5cdn","0Qs6YHRj2p45jxfKS40Io3U1lgYP6zEv1OpCrfDse9JiBi4BNyqa2E2dH7xIEfEE9lfCByjdxCqYNAuDFMk66A==",callback
    setTimeout(->
        console.log RongIMLib.Navigate.Endpoint.host
        done();
    ,1000)
