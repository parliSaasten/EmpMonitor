<style>
    /* width */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #0e84ff;
    }

    .notification_brw{
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        overflow-y: auto;
        z-index: 1000;
    }

    .toast-header {
        padding: .1rem .4rem !important;
    }

</style>
{{--    This Model of Notification is not using     --}}
<div class="modal fade" id="notification" tabindex="-1" role="dialog" aria-labelledby="notification" aria-hidden="true">
    <div class="modal-dialog modal-dialog-slideout" role="document" style="width: 370px">
        <div class="modal-content">
            <div class="modal-header bg-transparent">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h5 class="modal-title" id="exampleModalLabelHeader">{{ __('messages.notificationList') }}</h5>
            </div>
            <div class="modal-body bg-transparent" id="newAlerts">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">{{ __('messages.close') }}</button>
            </div>
        </div>
    </div>
</div>

{{-- new notification UI --}}

<span id="listLink" value="<?php echo (new App\Modules\User\helper)->getHostName() === 'employee' ? 'employee-alerts-list' : 'alerts-list' ?>" hidden></span>

<div aria-live="polite" aria-atomic="true" id="cssBlur"
     class="cssBlur">
    <!-- Position it -->
    <div class="notification_brw" id="toastList">
        <div class="toast" data-autohide="false" role="alert" aria-live="assertive" aria-atomic="true" id="toastHeader">
            <div class="toast-header">
                <div class="col">
                    <a type="button" href="<?php echo (new App\Modules\User\helper)->getHostName() === 'employee' ? 'employee-alerts-list' : 'alerts-list' ?>" class="btn" onclick="markAsRead(ALERT_LIST, 2)">
                        <span aria-hidden="true"
                              data-toggle="tooltip" title="{{ __('messages.viewAllAlerts') }}"><i
                                class="far fa-eye text-dark"></i></span>
                    </a>
                </div>
                <div class="col">
                    <button type="button" class="btn" class="close float-left" onclick="showPreviousAlerts()">
                        <span aria-hidden="true" data-toggle="tooltip"
                              title="{{ __('messages.todayOldNotify') }}"><i
                                class="fa fa-list-alt text-primary"></i></span>
                    </button>
                </div>
                <div class="col">
                    <button type="save" class="btn" onclick="markAsRead(ALERT_LIST, 2)">
                        <span aria-hidden="true" data-toggle="tooltip" title="{{ __('messages.readAll') }}"><i
                                class="fab fa-readme text-primary"></i></span>
                    </button>
                </div>
                <div class="col">
                    <button type="button" class="btn" class="close float-right" data-dismiss="toast" aria-label="Close"
                            data-toggle="tooltip" title="{{ __('messages.close') }}" onclick="closeToast()">
                        <span aria-hidden="true"><i class="far fa-times-circle text-danger"></i></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>let LOCALE = '<?php echo \Illuminate\Support\Facades\Session::get("locale"); ?>';</script>
