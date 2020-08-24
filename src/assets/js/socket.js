let websock = null;
let globalCallback = null;

// 初始化weosocket
function initWebSocket() {
  const token = sessionStorage.getItem("sessionId");
  let ws = `ws://192.168.0.102:9876?access_token=${JSON.parse(
    token
  )}&loginType=system`;
  websock = new WebSocket(ws);
  websock.onmessage = function(e) {
    websocketonmessage(e);
  };
  websock.onclose = function(e) {
    websocketclose(e);
  };
  websock.onopen = function() {
    websocketOpen();
  };

  // 连接发生错误的回调方法
  websock.onerror = function() {
    console.log("WebSocket连接发生错误");
  };
}

// 实际调用的方法
function sendSock(agentData, callback) {
  globalCallback = callback;
  if (websock.readyState === websock.OPEN) {
    // 若是ws开启状态
    websocketsend(agentData);
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback);
    }, 1000);
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback);
    }, 1000);
  }
}
// 数据接收
function websocketonmessage(e) {
  var reader = new FileReader();
  if (e.data instanceof Blob) {
    reader.readAsText(e.data, "UTF-8");
    reader.onload = () => {
      let str = JSON.parse(reader.result);
      globalCallback(str);
      console.log(str);
    };
  } else {
    globalCallback(JSON.parse(e.data));
  }
}

// 数据发送
function websocketsend(agentData) {
  websock.send(JSON.stringify(agentData));
}

// 关闭
function websocketclose(e) {
  console.log("connection closed (" + e.code + ")");
}

// 创建 websocket 连接
function websocketOpen() {
  console.log("连接成功");
}

initWebSocket();

export { sendSock };