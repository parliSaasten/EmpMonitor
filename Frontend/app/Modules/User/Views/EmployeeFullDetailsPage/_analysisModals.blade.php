    <!-- The Modal Domain detail view -->
<div class="modal fade" id="domainUrlModal">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">URLs</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="" id="urlList">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!-- The Modal Sentiment Score -->
<div class="modal fade" id="SentimentModal">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ __('messages.senti') }} {{ __('messages.score') }}</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <table id="sentiment_table" class="table table-bordered tabdata">
                    <thead>
                    <tr class="table-primary">
                        <th>{{ __('messages.app') }}</th>
                        <th>{{ __('messages.date') }}</th>
                        <th>{{ __('messages.positive') }} {{ __('messages.sentence') }}</th>
                        <th>{{ __('messages.negative') }} {{ __('messages.sentence') }}</th>
                    </tr>
                    </thead>
                    <tbody id="bodySentimentModal">
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">{{ __('messages.close') }}</button>
            </div>
        </div>
    </div>
</div>
<!-- The Modal Conversation Score -->
<div class="modal fade" id="ConversationModal">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ __('messages.convo') }} {{ __('messages.score') }}</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table id="conversation_table" class="table table-bordered tabdata">
                        <thead>
                        <tr class="table-primary">
                            <th>{{ __('messages.app') }}</th>
                            <th>{{ __('messages.date') }}</th>
                            <th>{{ __('messages.offensive') }} {{  trans_choice('messages.word', 10) }}</th>
                        </tr>
                        </thead>
                        <tbody id="bodyConversationModal">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">{{ __('messages.close') }}</button>
            </div>
        </div>
    </div>
</div>
<!-- sentiment inner list -->
<div class="modal fade" id="morelist" data-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="moreListTitle"></h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div><div class="container"></div>
            <div class="modal-body">
                <table class="table table-bordered">
                    <thead>
                    <tr class="table-primary">
                        <th id="moreListHeader"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <ul class="mb-0" id="moreListBody">
                            </ul>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <a href="#" data-dismiss="modal" class="btn btn-danger btn-sm">Cancel</a>
            </div>
        </div>
    </div>
</div>


