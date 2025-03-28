<!DOCTYPE html>
<html>
<head>
    @include('User::Layout._header')
    @yield('extra-style-links')

    @yield('page-style')
</head>
@if(env('APP_ENV') =='dev')
    <body>
    @else
        <body oncontextmenu="return false" onkeypress="return disableCtrlKeyCombination(event);"
              onkeydown="return disableCtrlKeyCombination(event)">
        @endif

<div class="page-container">
    <div class="page-content">
        {{--    To include Side Section Nav Bar     --}} 
            @include('User::Layout._sideNavBar') 
        {{--    To include Top Section Nav Bar     --}}
        @include('User::Layout._mainNavBar')
        {{--    To include Body Section (Main = Center Content)   --}}
        @yield('content') 
    </div>
    
    <footer class="footer">
        Copyright {{date('Y')}} © <a>EmpMonitor</a> All Rights Reserved
    </footer> 

</div>

</body>
{{--    pre load scripts   --}}
@include('User::Layout._scripts')
{{--    post load scripts   --}}
@yield('post-load-scripts')

{{--    for the script code    --}}
@yield('page-scripts')
{{--    for the Footer section code ( common script code )    --}}
@include('User::Layout._footer')
@if(env('APP_ENV') !== 'dev')  @include('User::Layout._blockSourceBleach') @endif
</html>
