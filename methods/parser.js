const needle = require ('needle');
const qs = require ('querystring');
const cheerio = require ('cheerio');

/*let schedule = [
    {
        date: '15.10',
        dayOfWeek: 'Пн',
        lessons: [
            {
                time: 'a',
                type: '',
                title: '',
                lecturer: '',
                location: ''
            },
            {
                time: 'b',
                type: '',
                title: '',
                lecturer: '',
                location: ''
            }
        ]   
    }
]*/

module.exports = (group, option) => {
    return new Promise(function(resolve, reject) {
        const date = new Date;
        const day = date.getDate();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        const nDate = new Date(year, month-1, day+1);
        const nDay = nDate.getDate();
        const nMonth = nDate.getMonth()+1;
        const currentDate = `${day}.${month}`;
        const nextDate = `${nDay}.${nMonth}`;
        console.log(currentDate);
        console.log(nextDate);
        const tarGroup = qs.stringify({group});
        const URL = `https://mai.ru/education/schedule/detail.php?${tarGroup}`;
        
        let schedule = [];

        function findWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        needle('get', `${URL}`)
            .then( function (res) {
                let currentWeek;
                let nextDayWeek;
                let newURL;
                //Здесь обработка даты, вернуть в следкющий then урл исходя из запроса или на неделю или на следщий день или на следующую неделю
                let $1 = cheerio.load(res.body);
                $1('.table a').each((i, elem) => {
                    let weekDates = $1(elem).text().split(' - ');
                    let weekDatesFirst = weekDates[0].split('.');
                    let weekDatesLast = weekDates[1].split('.');

                    if( day >= weekDatesFirst[0] && day <= weekDatesLast[0] && month >= weekDatesFirst[1] && month <= weekDatesLast[1] ) {
                        currentWeek = i+1;
                    }
                    if( nDay >= weekDatesFirst[0] && nDay+1 <= weekDatesLast[0] && nMonth >= weekDatesFirst[1] && nMonth <= weekDatesLast[1] ) {
                        nextDayWeek = i+1;
                    }
    
                });
                //console.log(currentWeek); // текущая неделя
                console.log(nextDayWeek); // 
                if (option == 'today') {
                    return `${URL}&week=${currentWeek}`;
                }
                if (option == 'tomorrow') {
                    newURL = `${URL}&week=${nextDayWeek}`;
                    return newURL;
                }
                if (option == 'current week') {
                    newURL = `${URL}&week=${currentWeek}`;
                    return newURL;
                }
                if (option == 'next week') {
                    newURL = `${URL}&week=${currentWeek+1}`;
                    return newURL;
                }
               
            })
            .then( function(newURL){
                //console.log(newURL);
                let $;
                return needle('get',newURL)
                .then(function(res) {
                    $ = cheerio.load(res.body);
                    return $
                })
            })
            .then(function ($) {
                $('.sc-container').each((i, elem) => {
                    let d = $('.sc-day-header').eq(i).text().split(/[А-Я]{1}[а-я]{1}/);
                    d.length = d.length - 1;
                    let dayOfWeek = $('.sc-day').eq(i).text();
                    let lessons = [];

                    $('.sc-table-detail').eq(i).children().each((i, elem) => {
                        let number = i;
                        let time = $(elem).find('.sc-item-time').text();
                        let type = $(elem).find('.sc-item-type').text();
                        let title = $(elem).find('.sc-item-title .sc-title').text();
                        let lecturer = $(elem).find('.sc-item-title .sc-lecturer').text();
                        let location = $(elem).find('.sc-item-location').text();
                        
                        lessons.push({ 
                            'time' : time,
                            'type' : type,
                            'title' : title,
                            'lecturer' : lecturer,
                            'location' : location  
                        });
                    })

                    schedule.push({
                        'date': ''+d,
                        'dayOfWeek': dayOfWeek,
                        'lessons': lessons
                    })
                    
                });
                if(option == 'today'){
                    let inx = findWithAttr(schedule, 'date', currentDate);
                    resolve(schedule[inx]);
                }
                if(option == 'tomorrow'){
                    let inx = findWithAttr(schedule, 'date', nextDate);
                    resolve(schedule[inx]);
                }
                else {
                    resolve(schedule);
                }
                console.log(findWithAttr(schedule, 'date', currentDate));
            });
    })

}
