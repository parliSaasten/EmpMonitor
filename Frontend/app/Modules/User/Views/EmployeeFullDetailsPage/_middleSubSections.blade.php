
<div class="row">
    <div class="col-md-12">
  <!-- Nav tabs -->
        <div class="card">
       <div class="card-body">
               <div class="btn-group nav nav-tabs tab-action-wrapper">
                       <a type="button" class="btn btn-info nav-link" data-toggle="tab" onclick="loadWebAppHistory(2)"
                          href="#BrowserHistory"
                          id="BrowserHistoryTab" title="{{ __('messages.webHistory') }}"><i
                               class="fas fa-globe  mr-2"></i>{{ __('messages.webHistory') }}</a>
                    <a type="button" class="btn btn-info nav-link" data-toggle="tab" onclick="loadWebAppHistory(1)"
                              href="#AppHistory"
                              id="AppHistoryTab" title=" {{ __('messages.applicationHistory') }} "><i
                                   class="fas fa-mobile-alt mr-2"></i>{{ __('messages.applicationHistory') }}</a>
                 </div>
       </div>
       </div>
    </div>
    <div class="col-md-12">
        <!-- Tab panes -->
        <div class="tab-content mt-0">
            <div id="BrowserHistory" class="tab-pane fade">  
                <div class="col-md-12 p-0">
                    <div class="card">
                        <div class="card-body">
                            <table
                                id="browserHistoryTableId"
                                class="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>{{ __('messages.browser') }}</th>
                                    <th>{{ __('messages.title') }}</th>
                                    <th>{{ __('messages.browserURL') }}</th>
                                    <th>{{ __('messages.startTime') }}</th>
                                    <th>{{ __('messages.endTime') }}</th>
                                 </tr>
                                </thead>
                                <tbody id="browserHistoryDataTableData">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id="AppHistory" class="tab-pane fade"> 
                <div class="col-md-12 p-0">
                    <div class="card">
                        <div class="card-body">
                            <table
                                id="applicationHistoryTableId"
                                class="table table-striped table-bordered">
                                <thead>
                                <tr style="text-align: center">
                                    <th>{{ __('messages.app') }}</th>
                                    <th>{{ __('messages.title') }}</th>
                                    <th>{{ __('messages.startTime') }}</th>
                                    <th>{{ __('messages.endTime') }}</th> 
                                </tr>
                                </thead>
                                <tbody id="applicationHistoryDataTableData">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>