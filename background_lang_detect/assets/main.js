var client = ZAFClient.init(); //init ZenDesk API Client


//Тут инитим либу для детекта языка
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType('iso2');



//Триггер Ticket Created на создании Тикета отправляет нам JSON вида:
//{
//    "app_id": 0,
//    "event": "startLangDetectEvent",
//    "body": "{¾ticket_id¾: ¾{{ticket.id}}¾, ¾ticket_text¾: ¾{{ticket.latest_comment}}¾}"
//}
//body передается фейк JSONом, чтобы избежать проблем с двойными кавычками. Все кавычки заменены на ¾.




client.on('api_notification.startLangDetectEvent', function(data) {
    data.body = data.body.replace(/¾/g, '"'); //восстанавливаем нормальный JSON
    //далее черная магия регекспа, чтобы убрать все ссылки из текста
    data.body = data.body.replace(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,'');
    data.body = data.body.replace(/(\r\n|\n|\r)/gm, ""); //убираем переносы строк

    console.log(data.body);
    ticketData = JSON.parse(data.body);
    
    console.log('ticketID = ' + ticketData.ticket_id);
    console.log('ticketText = ' + ticketData.ticket_text); //где-то после этого ловим ебейшую ошибку, если в тексте включен скриншот (не аттачментом)

    //либа не умеет в японский, поэтому чекаем сами. Если есть попадание - вернет не null
    var containsJapanese = ticketData.ticket_text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/);


    //теперь определяем язык
    var ticketLanguage = lngDetector.detect(ticketData.ticket_text);
    try {
        ticketLanguage = ticketLanguage[0].toString()
    } catch (error) {
        ticketLanguage = 'en';
    }; //to do: японский здесь выбивает null, из-за чего прилка ловит TypeError.
    
    ticketLanguage = ticketLanguage.substring(0, 2);

    //Наш ZD поддерживает только такие языки из коробки, следовательно всё остальное = английский
    if (ticketLanguage != 'de' && ticketLanguage != 'fr' && ticketLanguage != 'it' && ticketLanguage != 'jp' && ticketLanguage != 'es' && ticketLanguage!= 'ru' && ticketLanguage!= 'pt') {
        ticketLanguage = 'en';
    }
    if (containsJapanese != null) {
        ticketLanguage = 'jp';
    }

    console.log('ticketLanguage = ' + ticketLanguage);

    //добавляем тег через запрос к ZD API
    var options = {
        url: "/api/v2/tickets/" + ticketData.ticket_id + "/tags",
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            "tags": [ticketLanguage]
          }),
      };

      client.request(options).then((response) => {
        console.log(response);
      });
});