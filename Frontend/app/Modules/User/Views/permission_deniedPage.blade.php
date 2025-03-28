@extends('User::Layout._layout')
@section('title')
    <title>@if((new App\Modules\User\helper)->checkHost() )
            {{env('WEBSITE_TITLE')}} | @endif Denied </title>
@endsection

<head>
    <!-- Title -->
    <title>EmpMonitor</title>
    <!-- Favicons-->
    <link rel="icon" href="../assets/images/empmonitor_icon.png" />
    <!-- Theme Styles -->
    <link href="../assets/css/concept.css" rel="stylesheet" />
    <link href="../assets/css/custom.css" rel="stylesheet" />

</head>

<body>
        @section('content')
        <div class="page-inner no-page-title">
            <div id="main-wrapper">
                <div class="content-header">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb breadcrumb-style-1">
                            <li class="breadcrumb-item"><a href="dashboard" style="color: #0686d8;font-weight: 500;">
                                    {{__('messages.home')}}</a></li>
                            <li class="breadcrumb-item" aria-current="page">
                                {{__('messages.deniedMsg')}}
                            </li>
                        </ol>
                    </nav>
                    <div>

                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body text-center">


                                <h4 class="text-danger"> {{__('messages.permissionDeniedMsg')}}</h4>
                                <p>{{__('messages.askPermission')}}</p>
                                <img class="mx-auto d-block" src="../assets/images/permission_denied.png" alt="permission_denied"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endsection
</body>

