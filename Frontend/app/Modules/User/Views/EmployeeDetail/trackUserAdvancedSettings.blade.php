
<style>
   .modal-footer .btn-sm{
        padding: 0.55rem .3rem;
        min-height: 0px;
    }
</style>
 

<!-- DLP :: Websites: Blocking Modal -->
<div class="modal fade" id="WebBlockModal" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{__('messages.websiteFull')}}: {{__('messages.edit')}} {{__('messages.settings')}}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <form id="userWebsitesAddEditForm">
                    @csrf  
                    <div class="form-group">
                        <label class="font-weight-bold">{{ __('messages.blockWeb') }}</label>
                        <select id="userWebsitesAddEditInput" name="userWebsitesAddEditInput[]" class="form-control js-example-tokenizer" multiple="multiple"></select>
                        <span id="WebsiteError4"></span>
                        <div class="error text-danger" id="userWebsitesAddEditError"></div>
                    </div>  
                </form>
            </div>
            <div class="modal-footer"> 
                <button type="submit" id="userWebsitesAddEditSaveButton" class="btn btn-primary btn-sm" onclick="userWebsitesAddEditSubmit(1);">{{ __('messages.save') }}</button>
                <a href="#" data-dismiss="modal" class="btn btn-danger btn-sm">{{ __('messages.cancel') }}</a>
            </div>
        </div>
    </div>
</div>


<!-- DLP :: Application: Blocking Modal -->
<div class="modal fade" id="AppBlockModal" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Application: {{__('messages.edit')}} {{__('messages.settings')}}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <form id="userApplicationsAddEditForm">
                    @csrf  
                    <div class="form-group">
                            <label class="font-weight-bold">{{ __('messages.blockApp') }}</label>
                            <select id="userApplicationsAddEdit" name="userApplicationsAddEdit[]" class="form-control js-example-tokenizer" multiple="multiple"></select>
                            <span id="WebsiteError5"></span>
                            <div class="error text-danger" id="userApplicationsAddEditError"></div>
                        </div> 
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" id="userApplicationsAddEditSaveButton" class="btn btn-primary btn-sm" onclick="userWebsitesAddEditSubmit(2);">{{ __('messages.save') }}</button>
                <a href="#" data-dismiss="modal" class="btn btn-danger btn-sm">{{ __('messages.cancel') }}</a>
            </div>
        </div>
    </div>
</div>



<!-- TRACKING :: Allow to login from other system -->
<div class="modal fade" id="TrackAdvanceSetting" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Advance : {{__('messages.edit')}} {{__('messages.settings')}}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <form id="TrackAdvanceSettingForm">
                @csrf  
                    <div class="form-group">
                        <input type="checkbox" id="login_from_other_system" ><label class="font-weight-bold ml-2">{{ __('messages.allowLoginOS') }}</label>
                    </div>
                    <div class="error text-danger" id="TrackAdvanceSettingError"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="submit" id="TrackAdvanceSettingSaveButton" class="btn btn-primary btn-sm" onclick="userWebsitesAddEditSubmit(3);">{{ __('messages.save') }}</button>
                <a href="#" data-dismiss="modal" class="btn btn-danger btn-sm">{{ __('messages.cancel') }}</a>
            </div>
        </div>
    </div>
</div>


<!-- DLP :: Bluetooth: Blocking Modal -->
<div class="modal fade" id="BluetoothBlockModal" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Bluetooth: {{__('messages.edit')}} {{__('messages.settings')}}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <form id="userBluetoothAddEditForm">
                    @csrf  
                    <div class="form-group">
                        <label class="font-weight-bold">Add Bluethooth Adress to Enbale</label>
                        <select id="userBluetoothAddEditInput" name="userBluetoothAddEditInput[]" class="form-control js-example-tokenizer" multiple="multiple"></select>
                        <span id="WebsiteError4"></span>
                        <div class="error text-danger" id="userBluetoothAddEditError"></div>
                    </div>  
                </form>
            </div>
            <div class="modal-footer"> 
                <button type="submit" id="userBluetoothAddEditSaveButton" class="btn btn-primary btn-sm" onclick="userWebsitesAddEditSubmit(4);">{{ __('messages.save') }}</button>
                <a href="#" data-dismiss="modal" class="btn btn-danger btn-sm">{{ __('messages.cancel') }}</a>
            </div>
        </div>
    </div>
</div>
