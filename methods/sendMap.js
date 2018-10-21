module.exports = (coordinates, corp) => {
    console.log(coordinates);
    let corpCoordinates;
    switch (corp) {
        case '24б':
            corpCoordinates = {
                latitude: 55.814012,
                longitude: 37.499225
            }
            break;
        case '24а':
            corpCoordinates = {
                latitude: 55.812447,
                longitude: 37.502047
            }
            break;
        case '24в':
            corpCoordinates = {
                latitude: 55.813393,
                longitude: 37.499389
            }
            break;
        case '11':
            corpCoordinates = {
                latitude: 55.813699,
                longitude: 37.500210
            }
            break;
        case '1':
            corpCoordinates = {
                latitude: 55.812809,
                longitude: 37.500345
            }
            break;
        case '16':
            corpCoordinates = {
                latitude:  55.812357, 
                longitude: 37.501048
            }
            break;
        case '10':
            corpCoordinates = {
                latitude: 55.812139, 
                longitude: 37.500375
            }
            break;
        case '9':
            corpCoordinates = {
                latitude: 55.812000, 
                longitude: 37.499828
            }
            break;
        case 'гак':
            corpCoordinates = {
                latitude: 55.811751, 
                longitude: 37.502576
            }
            break;
        default:
            break;
    }
    /*`https://yandex.ru/maps/?from=api-maps
    &l=map
    55.813393, 37.499389 // 24в
    55.813699, 37.500210 // 11
    55.812809, 37.500345 // 1
    55.812357, 37.501048 // 16
    55.812139, 37.500375 // 10
    55.812000, 37.499828 // 9
    55.811751, 37.502576 // гак

    &ll=37.541245%2C55.773325 центр карты
    &mode=routes
    &origin=jsapi_2_1_69
    &rtext=55.733842%2C37.588144~55.812765%2C37.494393
    &rtm=atm
    &rtt=pd
    &z=11`*/
    //return 'photo-172453892_456239017';
    return `https://yandex.ru/maps/?from=api-maps&l=map&ll=${coordinates.longitude}%2C${coordinates.latitude}&mode=routes&rtext=${coordinates.latitude}%2C${coordinates.longitude}~${corpCoordinates.latitude}%2C${corpCoordinates.longitude}`;
}

