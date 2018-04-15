const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTopicTab = topic => {
  var tabs = {
    share: "分享",
    dev: "客户端测试",
    ask: "问答",
    job: "招聘"
  };
  var tabRes = [];
  if (topic.top) {
    tabRes.push("置顶");
  }
  if (topic.good) {
    tabRes.push("精华");
  }
  if (tabs[topic.tab] != undefined) {
    tabRes.push(tabs[topic.tab]);
  }
  if (tabRes.length == 0) {
    return ""
  } else {
    return `[${tabRes.join("|")}]`;
  }
}

module.exports = {
  formatTime: formatTime,
  formatTopicTab: formatTopicTab
}
