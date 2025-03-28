// This file is to convert seconds to any other format

/**
 * secToHMFormat
 * TODO : To convert seconds to Hours and minutes  H:M format
 * @param seconds --> It'll take seconds as input
 * @author Satya
 */
let secToHMFormat = (seconds = '0') => {
    let s = parseInt(s);
    let h = Math.floor(s / 3600) ; //Get whole hours
    s -= h * 3600;
    let m = Math.floor(s / 60); //Get remaining minutes
    return (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m);  // H:M format
};

/**
 * secToHMSFormat
 * TODO : To convert seconds to Hours and minutes  H:M:S format
 * @param seconds --> It'll take seconds as input
 * @author Satya
 */
function secondsToHms(seconds) {

    let d = Number(seconds);
    if(d <= 0){
        return '00:00:00'
    }else{
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h <= 9 ? '0'+ h+':' : h+ ":";
        let mDisplay = m <= 9 ? '0'+ m+':' : m+ ":";
        let sDisplay = s <= 9 ? '0'+ s : s;


        return hDisplay + mDisplay + sDisplay;

    }
}
let secToHMSFormat = secondsToHms;