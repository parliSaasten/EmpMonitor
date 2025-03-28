
<div class="row">
    <div class="col-md-12">
  <!-- Nav tabs -->
        <div class="card">
       <div class="card-body">
               <div class="btn-group nav nav-tabs tab-action-wrapper">
                       <a type="button" class="btn btn-info nav-link" data-toggle="tab" onclick="loadBrowserHistory()"
                          href="#BrowserHistory"
                          id="BrowserHistoryTab" title="{{ __('messages.webHistory') }}"><i
                               class="fas fa-globe  mr-2"></i>{{ __('messages.webHistory') }}</a>
                    <a type="button" class="btn btn-info nav-link" data-toggle="tab" onclick="loadAppHistory()"
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
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col mb-3 p-0 alert-success">
                                    <p class="border p-2 w-100 text-center"><i
                                            class="fas fa-globe mr-2"></i> {{ __('messages.topws') }}</p>
                                </div>
                                <div id="browserHistoryTableLoader"
                                     style="display: block; text-align:center">
                                    <span class="text-primary">{{ __('messages.WebDataLoading') }} ... </span>
                                </div>

                                <table class="table table-striped table-usage">
                                    <thead>
                                    </thead>
                                    <tbody id="browserHistoryTable">
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <div class="col mb-3 p-0 alert-success">
                                    <p class="border p-2 w-100 text-center"> {{ __('messages.wsChart') }}</p>
                                </div>
                                <div id="webHistoryChartLoader" style="display: block; text-align:center">
                                    <span class="text-primary"> {{ __('messages.WebChartLoading') }} ... </span>
                                </div>
                                <div style="height: 540px; width: 100%;" id="webHistoryChart"></div>
                            </div>
                        </div>
                    </div>

                </div>

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
                                    <th>{{ __('messages.actTime') }}</th>
                                    <th>{{ __('messages.Idletimes') }}</th>
                                    <th>{{ __('messages.totalTime') }}</th>
                                        <th>{{ __('messages.keystrokesCount') }}</th>
                                    <th>{{ __('messages.mouseClickCount') }}</th>
                                    <th>{{ __('messages.mouseMovementCount') }}</th>
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
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="col-sm mb-3 p-0 alert-success">
                                    <p class="border p-2 w-100 text-center"><i
                                            class="fas fa-mobile-alt mr-2"></i>{{ __('messages.topau') }}</p>
                                </div>
                                <table class="table table-striped table-usage">
                                    <tbody id="appHistoryTable">
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <div class="col-sm mb-3 p-0 alert-success">
                                    <p class="border p-2 w-100 text-center">{{ __('messages.apChart') }}</p>
                                </div>
                                <div style="height: 520px; width: 100%; overflow-y: auto"
                                     id="chartApp"></div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    <th>{{ __('messages.actTime') }}</th>
                                    <th>{{ __('messages.Idletimes') }}</th>
                                    <th>{{ __('messages.totalTime') }}</th>
                                    <th>{{ __('messages.keystrokesCount') }}</th>
                                    <th>{{ __('messages.mouseClickCount') }}</th>
                                    <th>{{ __('messages.mouseMovementCount') }}</th>
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