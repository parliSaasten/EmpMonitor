function setOrDeleteCookie(cName, cValue, expireDays) {
    if (expireDays < 0) {
        document.cookie = "" + cName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;secure;samesite=Strict";
    } else {
        document.cookie = cName + "=" + cValue + ";path=/;secure;samesite=Strict";
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// the below function we've to use wherever we want to check.
function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setOrDeleteCookie("username", user, 365);
        }
    }
}

