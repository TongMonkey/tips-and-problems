/*
 * @Author: your name
 * @Date: 2020-10-15 19:13:06
 * @LastEditTime: 2020-10-15 19:22:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /SpringLightCmsFe/Users/dl/Documents/private/tips-and-problems/src/Demos/Express_Mock/request.js
 */
// 请求数据
function request(host, uri, method, params, contentType) {
  var parameter;
  var contentType = contentType || 'application/json';
  if (contentType === 'multipart/form-data') {
    parameter = params;
  } else {
    // params is null
    if (!params && typeof params !== 'undefined' && params !== 0) {
      parameter = params;
    } else {
      parameter = JSON.stringify(params);
    }
  }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var res = JSON.parse(xhr.responseText);
            if (res.code === 500) {
              if (res.message) showAlert(res.message);
            } else {
              resolve(JSON.parse(xhr.responseText));
            }
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.open(method, host + uri, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(parameter);
  });
}