const parser = require('./parser');
const sendMap = require('./sendMap');
const scheduleKeyboard = require('./scheduleKeyboard');
const initialKeyboard = require('./initialKeyboard');
const settingsKeyboard = require('./settingsKeyboard');
const users = require ('../models/users');
var state = ['initial'];

module.exports = async function (command, userID) {
    const payload = {};
    const userMessage = command.toLowerCase();
    const user = await users.findOne({"user_id": `${userID}`});
    //const state = user.state && ['initial'];
    if (user) {
        state = user.state;
        var group = user.group_number.toUpperCase();
        console.log(group);
        console.log('state', user.state);
    }

    switch (state[state.length - 1]) {
        case 'initial':
            if (userMessage == 'расписание' ) {
                if (user) {
                    state.push('schedule')
                    await users.update(
                        {user_id: userID},
                        {state: state}
                    )
                }
                else {
                    state.push('schedule');
                }
                payload.message = 'Выберите тип расписания(тупо звучит, надо переделать)';
                payload.keyboard = scheduleKeyboard();
                
                //state.push('schedule');
            } else if (userMessage == 'настройки') {
                if (user) {
                    state.push('settings');
                    await users.update(
                        {user_id: userID},
                        {state: state}
                    )
                }
                else {
                    state.push('settings');
                }
                payload.message = '*тут будут настройки*';
                payload.keyboard = settingsKeyboard();
               
                //
            } else if (userMessage == 'карта') {
                payload.message = '*тут будет карта*';
                payload.attachment = sendMap();
            } else if (userMessage == 'об авторах') {
                payload.message = '*тут будет об авторах*';
                //state.push('authors');
            } else {
                payload.message = 'введите команду 2'
            }
            break;
        case 'schedule':
            if (userMessage == 'сегодня' && group) {
                let schedule = await parser(`${group}`, 'today');
                let lessons = '';
                //console.log(schedule);
                if (schedule) {
                    schedule.lessons.forEach(el => {
                        lessons += `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    });
                    payload.message = `&#128197; ${schedule.date} - ${schedule.dayOfWeek}<br><br>${lessons}<br>`;
                    return payload
                } else {
                    payload.message = 'Пар сегодня нет';
                    return payload
                }

            } else if (userMessage == 'завтра') {
                let schedule = await parser(`${group}`, 'tomorrow');
                let lessons = '';
                if (schedule) {
                    schedule.lessons.forEach(el => {
                        lessons += `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    });
                    payload.message = `&#128197; ${schedule.date} - ${schedule.dayOfWeek}<br><br>${lessons}<br>`;
                    return payload
                } else {
                    payload.message = 'Пар завтра нет';
                    return payload
                }
            } else if (userMessage == 'на неделю') {
                let schedule = await parser(`${group}`, 'current week');
                payload.message = '';

                schedule.forEach(el => {
                    let lessons = '';
                    let daySchedule = '';
                    el.lessons.forEach(el => {
                        lessons += `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    })
                    daySchedule = `&#128197; ${el.date} - ${el.dayOfWeek}<br><br>${lessons}<br>`;
                    payload.message += daySchedule;
                })
                return payload
            } else if (userMessage == 'на следующую неделю') {
                let schedule = await parser(`${group}`, 'next week');
                payload.message = '';

                schedule.forEach(el => {
                    let lessons = '';
                    let daySchedule = '';
                    el.lessons.forEach(el => {
                        lessons += `&#128344; ${el.time} - ${el.type}<br>&#128214; ${el.title}<br>&#127891; ${el.lecturer}<br>&#127970; ${el.location}<br><br>`;
                    })
                    daySchedule = `&#128197; ${el.date} - ${el.dayOfWeek}<br><br>${lessons}<br>`;
                    payload.message += daySchedule;
                })
                return payload

            } else if (userMessage == 'назад') {
                if (user) {
                    state.pop()
                    await users.update(
                        {user_id: userID},
                        {state: state}
                    )
                }
                else {
                    state.pop();
                }
                payload.message = 'Главное меню(тупо звучит, надо переделать)';
                payload.keyboard = initialKeyboard();
                
            } else {
                payload.message = 'введите команду 1';
            }
            break;
        case 'settings':
            if (userMessage == 'группа') {
                if(user) {
                    payload.message = `Ваша группа ${group}, можете сменить ее отправив название группы в формате: М4О-104М-18`;
                }
                else {
                    payload.message = 'Вы не ввели группу';
                }
	        } else if (userMessage == 'назад') {
                if (user) {
                    state.pop();
                    await users.update(
                        {user_id: userID},
                        {state: state}
                    )  
                }
                else {
                    state.pop();
                }
                payload.message = '*тут назад*';
                payload.keyboard = initialKeyboard();
                
            } else {
                if (user) {
                    await users.update(
                        {group_number: `${group.toLowerCase()}`},
                        {group_number: userMessage}
                    )
                    payload.message = 'группа обновлена';
                }
                else {
                    users.create({
                        user_id: userID,
                        group_number: userMessage,
                        state: state
                    }).then(user => console.log(user))
                    payload.message = 'группа введена, можно использовать расписание';
                }
                
            }
            break;
        default:
            payload.message = 'введите команду 0';
            break;
    }


    return payload;
}
