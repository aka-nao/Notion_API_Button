const prop = PropertiesService.getScriptProperties().getProperties();
const notion_api_token = prop.notion_api_token;
const database_id = prop.database_id;

function doGet(e) {
  var function_name = e.parameter['function'];
  var response;

  if (function_name == 'add_page') {
    var title="ボタンでページを作成";
    notion_make_page(title=title);
    response = { "message": "ページを作成しました" };
  } else if (function_name == 'add_page_trigger') {
    var title="トリガーでページを作成";
    notion_make_page(title=title);
    response = { "message": "ページを作成しました" };
  } else {
    response = { "message": "有効なfunctionを指定してください" };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
}

// HTML側にCORS回避の設定をしないとエラーする
// post_data = { "method": 'POST', 'Content-Type': 'application/x-www-form-urlencoded' , "body": JSON.stringify(body) }でfetch()する
function doPost(e) {
  var function_name = e.parameter['function'];
  var data = JSON.parse(e.postData.getDataAsString());
  var response;

  if (function_name == "add_url") {
    var title="フォームでページを作成";
    notion_make_page(title=title, url=data["url"],undefined);
    response = { "message": "ページを作成しました" };
  } else   if (function_name == "add_memo") {
    var title="フォーム（大）でページを作成";
    notion_make_page(title=title, undefined,memo=data["memo"]);
    response = { "message": "ページを作成しました" };
  } else {
    response = { "message": "有効なfunctionを指定してください" };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
}

function notion_make_page(title,url,memo){
  var post_data = {
    'parent': {'database_id': database_id},
    'properties': {}
  };

  if (title) {
    post_data.properties['名前'] = {
      'title': [
        {
          'text': {
            'content': title
          }
        }
      ]
    };
  }

  if (url) {
    post_data.properties['url'] = {
      'url': url
    };
  }

  if (memo) {
    post_data.properties['memo'] = {
      'rich_text': [
        {
          'text': {
            'content': memo
          }
        }
      ]
    };
  }

  var api_url = 'https://api.notion.com/v1/pages';
  var options = {
    "method" : "post",
    "headers" : {'Content-Type' : 'application/json; charset=UTF-8','Authorization': 'Bearer ' + notion_api_token, 'Notion-Version': '2022-06-28'},
    "payload" : JSON.stringify(post_data)
  };

  try {
    var res = UrlFetchApp.fetch(api_url, options);
    return 0;
  } catch(e) {
    return e.message;
  }
}