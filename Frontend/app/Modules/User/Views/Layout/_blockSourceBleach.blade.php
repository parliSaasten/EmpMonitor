<script type="text/javascript">
    function disableCtrlKeyCombination(e) {
        let forbiddenKeys = new Array('a', 'x', 'u');
        let key, isCtrl;
        if (window.event) {
            key = window.event.keyCode;
            (window.event.ctrlKey) ? isCtrl = true : isCtrl = false;
        } else {
            key = e.which;
            (e.ctrlKey) ? isCtrl = true : isCtrl = false;
        }

        if (isCtrl) {
            for (let i = 0; i < forbiddenKeys.length; i++) {
                if (forbiddenKeys[i].toLowerCase() == String.fromCharCode(key).toLowerCase()) {
                    return false;
                }
            }
        }
        return true;
    }

    $(document).keydown(function (event) {
        if (event.keyCode === 123) {
            return false;
        } else if ((event.ctrlKey && event.shiftKey && event.keyCode === 67) ||
            (event.ctrlKey && event.shiftKey && event.keyCode === 73) ||
            (event.ctrlKey && event.shiftKey && event.keyCode === 74)) {
            return false;
        }
    });

    (() => {
        let a, b;
        (a = () => {
            try {
              if(!localStorage.getItem('BROWSE_VERSION')) {
                  (b = (i) => {
                          if (('' + (i / i)).length !== 1 || i % 20 === 0) {
                              (() => {
                              }).constructor('debugger')()
                          } else {
                              debugger
                          }
                          b(++i)
                      }
                  )(0)
              }
            } catch (e) {
                setTimeout(a, 2000)
            }
        })()
    })();

    window.oncontextmenu = () => false;
    document.onkeydown = (e) => {
        if (window.event.keyCode == 123 || e.button == 2) return false;
    };

</script>

