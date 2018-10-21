module.exports = () => {
    return {
        "one_time": false,
        "buttons": [

            [{
                    "action": {
                        "type": "text",
                        "payload": "{\"button\": \"1\"}",
                        "label": "Сегодня"
                    },
                    "color": "positive"
                },
                {
                    "action": {
                        "type": "text",
                        "payload": "{\"button\": \"1\"}",
                        "label": "Завтра"
                    },
                    "color": "positive"
                }
            ],
            [{
                    "action": {
                        "type": "text",
                        "payload": "{\"button\": \"1\"}",
                        "label": "На неделю"
                    },
                    "color": "primary"
                },
                {
                    "action": {
                        "type": "text",
                        "payload": "{\"button\": \"1\"}",
                        "label": "На следующую неделю"
                    },
                    "color": "primary"
                }
            ],
            [{
                "action": {
                    "type": "text",
                    "payload": "{\"button\": \"1\"}",
                    "label": "Назад"
                },
                "color": "default"
            }]
        ]
    };
}