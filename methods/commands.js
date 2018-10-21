const parser = require('./parser');
const sendMap = require('./sendMap');
const scheduleKeyboard = require('./scheduleKeyboard');
const initialKeyboard = require('./initialKeyboard');
const settingsKeyboard = require('./settingsKeyboard');
const mapKeyboard = require ('./mapKeyboard');
const users = require ('../models/users');
var state = ['initial'];

module.exports = async function (command, userID, coordinates) {
    console.log('COORDINATES', coordinates);
    const payload = {};
    const userMessage = command.toLowerCase();
    const user = await users.findOne({"user_id": `${userID}`});
    //const state = user.state && ['initial'];
    if (user) {
        state = user.state;
        var group = user.group_number.toUpperCase();
        console.log('GROUP', group);
    }

    switch (state[state.length - 1]) {
        case 'initial':
            if (userMessage == 'расписание' && group ) {
                state.push('schedule')
                await users.update(
                    {user_id: userID},
                    {state: state}
                )
                payload.message = 'Выберите тип расписания из предложенных ниже в клавиатуре или введите одну из комманд самостаятельно: <br>Сегодня <br>Завтра <br>На неделю <br>На следующую неделю <br>Назад (чтобы вернутсья в главное меню) ';
                payload.keyboard = scheduleKeyboard();
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
                payload.message = 'Меню настроек.<br>Здесь указать или зименить группу, для этого введите группу в формате: М4О-104М-18 или посмотреть какая группа установлена текущей, для этого введите группа';
                payload.keyboard = settingsKeyboard();
            } else if (userMessage == 'карта') {
                if (user) {
                    state.push('map');
                    await users.update(
                        {user_id: userID},
                        {state: state}
                    )
                }
                else {
                    state.push('map');
                }
                payload.message = 'Для того чтобы построить маршрут до корпуса прикрепите ваше местоположение и нужный вам корпус (в формате: 24Б, ГАК, 10 и тд) в одном сообщении. <br>Для того чтобы вернуться в главное меню введите "назад"';
                payload.keyboard = mapKeyboard();
                //payload.message = sendMap();
            } else if (userMessage == 'об авторах') {
                payload.message = '*тут будет об авторах*';
                //state.push('authors');
            } else {
                payload.message = 'Введена неправильная команда, или вы пока не ввели группу для того чтобы пользоваться расписанием.'
            }
            break;
        case 'schedule':
            if (userMessage == 'сегодня') {
                let schedule = await parser(`${group}`, 'today');
                let lessons = '';
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
                state.pop()
                await users.update(
                    {user_id: userID},
                    {state: state}
                )
                payload.message = 'Главное меню.<br>Выберите команду из предложенных ниже в клавиатуре или введите одну из комманд самостоятельно:<br>Расписание <br>Настройки <br>Карта';
                payload.keyboard = initialKeyboard();
                
            } else {
                payload.message = 'введите команду 1';
            }
            break;
        case 'map':
            console.log('USER MESSAGE',userMessage);
            console.log('COORDINATES', coordinates);
            if(coordinates && userMessage) {
                payload.message = sendMap(coordinates, userMessage);
            }
            else if (userMessage == 'назад') {
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
                payload.message = 'Main menu';
            }
            else {
                payload.message = 'Отправьте вашу геопозицию';
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
                payload.message = 'Главное меню.<br>Выберите команду из предложенных ниже в клавиатуре или введите одну из комманд самостоятельно:<br>Расписание <br>Настройки <br>Карта';
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

    /*Небольшая пасхалка*/
    if (userMessage == 'маи это я!') {
        payload.message = 'МАИ ЭТО МЫ!<br>МАИ ЭТО ЛУЧШИЕ ЛЮДИ СТРАНЫ!';
        payload.attachment = 'photo-172453892_456239019';
    }
    /*==================*/

    return payload;
}
