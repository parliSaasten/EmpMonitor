
{{--    Here we can keep footer code    --}}
<script>
    let WEBSOCKET_SERVER_URL = '{{env('WEBSOCKET_SERVER_URL')}}';
    let BROWSER = '<?php echo Session::get((new \App\Modules\User\helper)->getHostName())['token']['data']; ?>';
</script>
<script src="{{env('JS_BASE_PATH')}}_alertAndPushNotifications.js"></script>

