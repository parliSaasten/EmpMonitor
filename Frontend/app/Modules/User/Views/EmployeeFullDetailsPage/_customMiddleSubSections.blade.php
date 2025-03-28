<style>
    img#canvas-img {
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-top: 10px;
    }
    #ScreenCast .card {
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        padding: 20px;
    }

    #ScreenCast .card-body {
        flex-direction: column;
        align-items: center;
    }
    .sidebar {
        width: 70px;
        padding: 0px;
        display: none;
    }

    .sidebar ul {
        list-style-type: none;
        padding: 0;
    }

    .sidebar ul li {
        margin: 10px 0;
    }

    .sidebar ul li a {
        text-decoration: none;
        color: #333;
    }
    #ScreenCast .btn {
        background-color: #55B0FE;
        border: none;
        color: white;
        padding: 12px 16px;
        font-size: 16px;
        cursor: pointer;
    }

    /* Darker background on mouse-over */
    #ScreenCast  .btn:hover {
        background-color: RoyalBlue;
    }
    .sidebar-row {
        /*flex-direction: row;*/
        /*display: flex;*/
    }
    .tooltip ol {
        list-style-type: decimal !important;
        padding-left: 10px;
    }
    .tooltip-inner {
        max-width: 400px !important;
        white-space: normal !important;
        text-align: left !important;
        padding: 10px;
    }
</style>
<div class="row">
    <div class="col-md-12">

        <!-- Nav tabs -->
        <div class="card">
       <div class="card-body">
           <div class="btn-group nav nav-tabs tab-action-wrapper">

               <a type="button" class="btn btn-info nav-link" data-toggle="tab" href="#Screenshots"
                  id="ScreenshotsTab"
                  onclick="loadScreenShotData()" title=" {{ __('messages.ss') }}"><i
                       class="far fa-images mr-2"></i>{{ __('messages.ss') }}</a>
               @if(Session::has(env('Admin')))
                   @if((new App\Modules\User\helper)->checkEnvPermission('SCREEN_CAST_FEATURE'))
                       <a type="button" class="btn btn-info nav-link" data-toggle="tab" href="#ScreenCast"
                          id="ScreenRecordingTab" title="{{__('messages.ScreenCast')}}">
                           <i class="fas fa-video mr-2"></i>Screen Cast <span class="hrms-beta-text"><span
                                   class="c-article__title">BETA</span></span></a>
                   @endif
               @endif
           </div>
       </div>
       </div>
    </div>
    <div class="col-md-12">
        <!-- Tab panes -->
        <div class="tab-content mt-0">
            <div id="Screenshots" class="tab-pane fade">
                <div class="card" id="Screenshot">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4" style="padding-bottom: 0px !important;">
                                <label>{{ __('messages.select') }} {{ __('messages.date') }}</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                                    <span class="input-group-text" for="select_ss_date"><i
                                                            class="far fa-calendar-alt"></i></span>
                                    </div>
                                    <input type="text" class="form-control"
                                           id="select_ss_date"
                                           placeholder="{{ __('messages.select') }} {{ __('messages.date') }}">
                                </div>
                            </div>
                            <div class="col-md-3" style="padding-bottom: 0px !important;">
                                <div class="form-group">
                                    <label>{{ __('messages.frmTime') }} </label>
                                    <select class="form-control" id="fromTime" name="fromTime">
                                        @for($i=0;$i<=9;$i++)
                                            <option id="fromTime{{"0$i"}}">{{"0$i:00"}}</option>
                                        @endfor
                                        @for($i=10;$i<24;$i++)
                                            <option id="fromTime{{"$i"}}">{{"$i:00"}}</option>
                                        @endfor
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3" style="padding-bottom: 0px !important;">
                                <div class="form-group">
                                    <label> {{ __('messages.toTime') }} <i class="fa fa-info-circle text-primary ml-2 toTimeInfo"
                                                                           data-toggle="tooltip"
                                                                           title="{{__('messages.toTimeIfo')}}"></i></label>
                                    <select class="form-control" id="toTime" name="toTime">
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-2" style="padding-bottom: 0px !important;">
                                <div class="form-group">
                                    <label style="visibility: hidden">{{ __('messages.search') }}</label>
                                    <button type="submit" id="oneSearch" onclick="loadScreenShotData()"
                                            class="btn btn-info btn-block srch-btn"
                                            data-placement="top" title="{{ __('messages.search') }}"
                                            class="SearchClass">
                                        <input type="hidden" class="SearchClass" value="1">
                                        <i class="fas fa-search"></i> {{ __('messages.search') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" id="appendSSData">
                    </div>
                </div>
            </div>
            <div id="ScreenCast" class="tab-pane fade">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <p id="access_token"
                               class="d-none"><?php echo Session::get((new App\Modules\User\helper)->getHostName())['token']['data'] ?></p>
                            <p id="my_user_id" class="d-none"><?php echo $user_details['data']['u_id'] ?></p>
                            <div class="col-md-4" style="padding-bottom: 0px !important;">
                            </div>
                            <div class="col-md-3" style="padding-bottom: 0px !important;">
                                <button class="btn btn-primary" id="button_connect_ws" type="submit"
                                        onclick="screenCast(1)">Connect
                                </button>&nbsp;&nbsp;
                                <button class="btn btn-danger" id="button_disconnect_ws" type="submit" disabled
                                        onclick="screenCast(2)">Disconnect
                                </button>&nbsp;&nbsp;
                                <button class="btn btn-primary" id="button_connect_ws" type="submit"
                                        onclick="runLatencyTest()">Test latency
                                </button>&nbsp;&nbsp;
                                <div id="agent_connection_status" style="margin-top: 10px;"></div>
                                <div style="flex-direction: row; display: flex;">
                                    <div id="latency_test_id" style="margin-top: 10px;"></div>
                                    &nbsp;&nbsp;
                                    <div id="latency_test_agent" style="margin-top: 10px;"></div>
                                </div>
                            </div>
                            <div class="col-md-2" style="padding-bottom: 0px !important;">
                                <select id="screenSize"  class="form-control" onchange="setScreenSize()" disabled>
                                    <option>Select Screen Size</option>
                                    <option value="500">Low</option>
                                    <option value="700">Medium</option>
                                    <option value="800">High</option>
                                </select>
                            </div>
                            <div class="col-md-3" style="padding-bottom: 0px !important;">
                                <div class="form-group">
                                    <label id="pdfNote" class="pt-3" data-toggle="tooltip" data-placement="left"
                                           data-html="true" title="<ol>
                                                    <li>1. A minimum internet bandwidth of 10 Mbps is required for effective screen connectivity for both end users and administrators.</li>
                                                    <li>2. We recommend a latency of under 200 ms for optimal performance; higher latency may lead to a laggy experience.</li>
                                                    <li>3. You can connect to only one system at a time.</li>
                                                    <li>4. EmpMonitor may consume 7-8% more CPU resources than normal when connected to a user's system.</li>
                                                    <li>5. This feature is in beta so some issues may arise.</li>
                                                    <li>6. We plan to release it in production after the beta phase. During that time, you may need to reinstall the agents to access all features fully.</li>
                                                </ol>
                                              "
                                           style="font-weight: 700;color: #646464 !important; width: 100px">{{__('messages.note')}}
                                        : <i
                                            class="fas fa-comment-dots ml-2"></i>
                                    </label>
                                </div>
                            </div>
                            <div class="userMessage" style="color: red;text-align: center !important;margin-left: 500px;font-size:20px"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body" style="display: flex">
                        <div class="row">
                            @if((new App\Modules\User\helper)->checkEnvPermission('SCREEN_CAST_CONTROL_FEATURE'))
                                <div class="sidebar">
                                    <ul class="sidebar-row">
                                        <li><a onclick="customButtonPress(1)" title="Windows"><img
                                                    src="../assets/images/logos/win.png" alt="windows-image"/></a></li>
                                        <li><a onclick="customButtonPress(2)" title="File Explorer"><img
                                                    src="../assets/images/logos/file.png" alt="file-image"/></a></li>
                                        <li><a onclick="customButtonPress(3)" title="Windows Run"><img
                                                    src="../assets/images/logos/run.png" alt="run-image"/></a></li>
                                        <li><a onclick="customButtonPress(4)" title="Copy"><img
                                                    src="../assets/images/logos/copy.png" alt="copy-image"/></a></li>
                                        <li><a onclick="customButtonPress(5)" title="Paste"><img
                                                    src="../assets/images/logos/paste.png" alt="paste-image"/></a></li>
                                        <li><a onclick="customButtonPress(6)" title="Lock"><img
                                                    src="../assets/images/logos/lock.png" alt="lock-image"/></a></li>
                                        <li><a onclick="customButtonPress(7)" title="Restart"><img
                                                    src="../assets/images/logos/restart.png" alt="restart-image"/></a>
                                        </li>
                                        <li><a onclick="customButtonPress(8)" title="Shutdown"><img
                                                    src="../assets/images/logos/shutdown.png" alt="shutdown-image"/></a>
                                        </li>
                                    </ul>
                                </div>
                            @endif
                                <div id="canvas-container"></div>
                                @if((new App\Modules\User\helper)->checkEnvPermission('SCREEN_CAST_CONTROL_FEATURE'))
                                    <div class="sidebar">
                                        <ul class="sidebar-row">
                                            <li><a title="Screenshot"><img
                                                        src="../assets/images/logos/camra.png" id="captureButton"/></a>
                                            </li>
                                            <li><a onclick="startStopScreenRecord()" title="Screen Recording"><img
                                                        src="../assets/images/logos/start.png" id="screenRecordStatus"/></a>
                                            </li>
                                        </ul>
                                    </div>
                                @endif
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
let USER_IS_MOBILE = `@if($user_details['data']['is_mobile']) $user_details['data']['is_mobile'] @endif`;
let CUSTOM_TIMESHEET = '<?php echo (new App\Modules\User\helper)->specialEmployeeWithCustomTimesheet(); ?>';
let SCREEN_CONTROL = '<?php echo (new App\Modules\User\helper)->checkEnvPermission('SCREEN_CAST_CONTROL_FEATURE'); ?>';
</script>
