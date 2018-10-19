module.exports = () => {
    return { 
        "one_time": false, 
        "buttons": [ 
          
            [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"1\"}",
                    "label": "Группа"
                },
                "color": "positive"
            }],
            [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"1\"}",
                    "label": "Назад"
                },
                "color": "default"
            }],

        ]
      } ;
}