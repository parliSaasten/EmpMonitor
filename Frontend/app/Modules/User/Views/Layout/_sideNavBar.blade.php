<div class="secondary-sidebar">
    <div class="secondary-sidebar-bar">
        <a href="{{route('dashboard',(new App\Modules\User\helper())->getHostName()) }}" class="logo-box">
            <img src="../assets/images/logos/{{ md5($_SERVER['HTTP_HOST']) }}.png" class="img-fluid" />
            <!-- <img src="../assets/images/logos/icon.png" class="img-fluid"/>
            <img src="../assets/images/logos/Logo.png" class="img-fluid"/> -->
        </a>
    </div>
    <div class="secondary-sidebar-menu">
        <ul class="accordion-menu" id="sidebar_menus">
         
        @if(Session::get('admin_session'))
            <li>
                <a href="#">
                    <i class="menu-icon icon-users"
                       title="{{ __('messages.employee') }}"></i><span>{{ __('messages.employee') }}</span>
                    <i class="accordion-icon fas fa-angle-left"></i>
                </a>
                <ul class="sub-menu">
                    <li id="main-step4" class="main-step"><a title="{{ __('messages.employee-details') }}"
                            href="{{ route('employee-details', (new App\Modules\User\helper())->getHostName()) }}">{{ __('messages.employee-details') }}</a>
                    </li>  
                </ul>
            </li>
            @endif
            <li>
                <a href="{{ route('attendance-history', (new App\Modules\User\helper())->getHostName()) }}">
                    <i class="menu-icon far fa-calendar-alt"
                        title="{{ __('messages.timesheets') }}"></i><span>{{ __('messages.timesheets') }}</span>
                </a>
            </li>
        </ul>
    </div>
</div>

