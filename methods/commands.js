const parser = require ('./parser');
const sendMap = require ('./sendMap');
const scheduleKeyboard = require ('./scheduleKeyboard');
const initialKeyboard = require ('./initialKeyboard');
const settingsKeyboard = require ('./settingsKeyboard');
const state = ['initial'];

module.exports = async function (command) {
    let payload = {};
    let userMessage = command.toLowerCase();

    switch (state[state.length -1 ]) {
        case 'initial':         
            if (userMessage == 'расписание') {
                payload.message = 'Выберите тип расписания(тупо звучит, надо переделать)';
                payload.keyboard = scheduleKeyboard();
                state.push('schedule');
            }
            else if (userMessage == 'настройки') {
                payload.message = '*тут будут настройки*';
                payload.keyboard = settingsKeyboard();
                state.push('settings');
            }
            else if (userMessage == 'карта') {
                payload.message = '*тут будет карта*';
                payload.attachment = sendMap();
            }
            else if (userMessage == 'об авторах') {
                payload.message = '*тут будет об авторах*';
                //state.push('authors');
            }
            else {
                payload.message = 'введите команду'
            }
            break;
        case 'schedule':
            if (userMessage == 'сегодня') {
                let schedule = await parser('М4О-104М-18','today');
                let lessons = '';
                console.log(schedule);
                if(schedule) {
                    schedule.lessons.forEach(el => {
                        lessons+= `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    });
                    payload.message = `&#128197; ${schedule.date} - ${schedule.dayOfWeek}<br><br>${lessons}<br>`;
                    return payload
                }
                else {
                    payload.message = 'Пар сегодня нет';
                    return payload
                }
                
            }
            else if (userMessage == 'завтра') {
                let schedule = await parser('М4О-104М-18','tomorrow');
                let lessons = '';
                if(schedule) {
                    schedule.lessons.forEach(el => {
                        lessons+= `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    });
                    payload.message = `&#128197; ${schedule.date} - ${schedule.dayOfWeek}<br><br>${lessons}<br>`;
                    return payload
                }
                else {
                    payload.message = 'Пар завтра нет';
                    return payload
                }
            }
            else if (userMessage == 'на неделю') {
                let schedule = await parser('М4О-104М-18','current week');
                payload.message = '';
                
                schedule.forEach(el => {
                    let lessons = '';
                    let daySchedule = '';
                    el.lessons.forEach(el => {
                        lessons+= `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    })
                    daySchedule = `&#128197; ${el.date} - ${el.dayOfWeek}<br><br>${lessons}<br>`;
                    payload.message+= daySchedule;
                })
                return payload
            }
            else if (userMessage == 'на следующую неделю') {
                let schedule = await parser('М4О-104М-18','next week');
                payload.message = '';
                
                schedule.forEach(el => {
                    let lessons = '';
                    let daySchedule = '';
                    el.lessons.forEach(el => {
                        lessons+= `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    })
                    daySchedule = `&#128197; ${el.date} - ${el.dayOfWeek}<br><br>${lessons}<br>`;
                    payload.message+= daySchedule;
                })
                return payload

            }
            else if (userMessage == 'назад') {
                payload.message = 'Главное меню(тупо звучит, надо переделать)';
                payload.keyboard = initialKeyboard();
                state.pop();
            }
            else {
                payload.message = 'введите команду';
            }
            break;
        case 'settings' :
                if (userMessage == 'группа') {
                    payload.message = '*тут можно будет настроить группу *';
                }
                else if (userMessage == 'назад') {
                    payload.message = '*тут назад*';
                    payload.keyboard = initialKeyboard();
                    state.pop();
                }
                else {
                    payload.message = 'введите команду';
                }
            break;
        default :
            payload.message = 'введите команду';
            break;
    }


    return payload;
}
