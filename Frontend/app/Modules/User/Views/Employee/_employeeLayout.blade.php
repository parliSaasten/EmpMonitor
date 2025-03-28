<!DOCTYPE html>
<html>
<head>
    @include('User::Layout._header')
    @yield('extra-style-links')
    <style>
        i.fas.fa-chalkboard-teacher.nav-link.text-primary:hover {
            cursor: pointer;
        }
    </style>
    @yield('page-style')
</head>

<body>
<div class="page-container">
    <div class="page-content">
        {{--    To include Side Section Nav Bar     --}}
        @include('User::Employee._employeeSideBar')
        {{--    To include Top Section Nav Bar     --}}
        @include('User::Employee._employeeNavBar')
        {{--    To include Body Section (Main = Center Content)   --}}
        @yield('content')
        {{--        To Include the Toasts ( Notifications )     --}}
        @include('User::Layout._alertsAndNotifications')
    </div>
</div>
</body>
{{--    pre load scripts   --}}
@include('User::Layout._scripts')
{{--    post load scripts   --}}
@yield('post-load-scripts')

{{--    for the script code    --}}
@yield('page-scripts')
{{--    for the Footer section code ( common script code )    --}}
@include('User::Employee._employeeFooter')
</html>

