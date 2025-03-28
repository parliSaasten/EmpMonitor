

<div class="row mb-3">
    <div class="align-self-center">
        <p class="mb-0">Show <select class="" id="ShowEntriesList">
                <option id="10" selected>10</option>
                <option id="25">25</option>
                <option id="50">50</option>
                <option id="100">100</option>
                <option id="200">200</option>
            </select> Entries
        </p>
    </div>
    <div class="col-sm">
        <button class="btn btn-primary float-right" id="ExportButton"
                onclick="ExportEmployeeSheet()">
            Exports
        </button>
        <div id="LoaderIcon" style="display: none" class="loaderIcon mr-2"
             style="display:block"></div>

    </div>
    <div class="col-md-3 input-group">
        <input type="text" class="form-control" placeholder="Search..." value=""
               id="SearchTextField" onkeypress="return runScript(event)">
        <div class="input-group-append">
            <button class="btn btn-primary" type="button" id="SearchButton"
                    onclick="SearchText()">
                <i class="fa fa-search"></i>
            </button>
        </div>
    </div>
    <div class="col-12 text-right"><p class="mb-0" style="color: red"
                                      id="SearchErrorMsg"></p></div>
</div>

@yield('TableContent')


<div id="wrapper" class="row">
    <div class="col-md-6 align-self-center">
        <p class="mb-0" id="showPageNumbers"></p>
    </div>
    <div class="col-md-6">
        <div class="gigantic pagination" id="PaginationShow">
            <a href="#" class="first" data-action="first">&laquo;</a>
            <a href="#" class="previous" data-action="previous">&lsaquo;</a>
            <input type="text" readonly="readonly"/>
            <a href="#" class="next" data-action="next">&rsaquo;</a>
            <a href="#" class="last" data-action="last">&raquo;</a>
        </div>
    </div>
</div>
