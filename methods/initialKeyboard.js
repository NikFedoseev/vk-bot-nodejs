module.exports = () => {
    return { 
        "one_time": false, 
        "buttons": [ 
          [{ 
            "action": { 
              "type": "text", 
              "payload": "{\"button\": \"1\"}", 
              "label": "Расписание"
            }, 
            "color": "positive"
          }],
            [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"1\"}",
                    "label": "Настройки"
                },
                "color": "primary"
            },
                {
                    "action": {
                        "type": "text",
                        "payload": "{\"button\": \"1\"}",
                        "label": "Карта"
                    },
                    "color": "primary"
                }],
            [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"1\"}",
                    "label": "Об авторах"
                },
                "color": "default"
            }]
        ] 
      };
}