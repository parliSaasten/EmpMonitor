<div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="empLabel" aria-hidden="true"
     aria-expanded="false">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addEmpLabel">Profile</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
            </div>
            <div>
                <div class="modal-body" id="profileShow">
                    <div class="row">
                        <div class="col col-md-12 text-center mb-3">
                            <img id="profile-image" src="../assets/images/avatars/avatar1.png"
                                 style="height: 104px;width: 104px; border-radius: 50% !important; display: initial !important;"
                                 class="profile-pic img-fluid rounded-circle "/>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="" style="color: #646464 !important; font-weight: bold">Full
                                    name:</label>

                                <p name="name" class="form-control" id="profile-name"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-email" style="color: #646464 !important; font-weight: bold">Email
                                    address:</label>

                                <p name="profile-email" class="form-control" id="profile-email"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-telephone" style="color: #646464 !important; font-weight: bold">Mobile
                                    No:</label>

                                <p name="profile-telephone" class="form-control" id="profile-telephone"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-empcode" style="color: #646464 !important; font-weight: bold">Emp
                                    Code:</label>

                                <p name="profile-empcode" class="form-control" id="profile-empcode"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-location" style="color: #646464 !important; font-weight: bold">Location:</label>

                                <p name="profile-location" class="form-control" id="profile-location"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-department"
                                       style="color: #646464 !important; font-weight: bold">Department:</label>

                                <p name="profile-department" class="form-control" id="profile-department"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="date_join" style="color: #646464 !important; font-weight: bold">Date of
                                    Joining:</label>

                                <p name="profile-date" class="form-control" type="profile-date"
                                   id="profile-date"></p>
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-address" style="color: #646464 !important; font-weight: bold">Address:</label>
                                <p name="profile-address" class="form-control" id="profile-address"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="resellerProfile" class="modal" data-easein="perspectiveDownIn" tabindex="-1" role="dialog"
     aria-labelledby="resellerProfileLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header text-center headStyle bg-info text-light" style="padding: 7px 10px">
                <h5 class="modal-title" id="addEmpLabel" style="margin-left: 360px; font-weight: 800">{{ __('messages.profile') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
            </div>
            <div>
                <div class="modal-body" id="profileShow">
                    <div class="row">
                        <div class="col col-md-12 text-center mb-3">
                            <img id="reseller-image" src="../assets/images/avatars/avatar1.png"
                                 style="height: 104px;width: 104px; border-radius: 50% !important; display: initial !important;" alt=""
                                 class="profile-pic img-fluid rounded-circle "/>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="" style="color: #646464 !important; font-weight: bold">{{ __('messages.firstName') }}:</label>
                                <input class="form-control" id="reseller-first-name" disabled />
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="" style="color: #646464 !important; font-weight: bold">{{ __('messages.lastName') }}:</label>
                                <input class="form-control" id="reseller-last-name" disabled />
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="" style="color: #646464 !important; font-weight: bold">{{ __('messages.userName') }}:</label>
                                <input class="form-control" id="reseller-user-name" disabled />
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-email" style="color: #646464 !important; font-weight: bold">{{ __('messages.emailAddress') }}:</label>
                                <input class="form-control" id="reseller-email" disabled />
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="reseller-user-name" style="color: #646464 !important; font-weight: bold">{{ __('messages.licenses') }}:</label>
                                <input type="text" class="form-control" id="reseller-licences" disabled />
                            </div>
                        </div>
                        <div class="col col-md-6">
                            <div class="form-group">
                                <label for="profile-location" style="color: #646464 !important; font-weight: bold">{{ __('messages.expiry_date') }}:</label>
                                <input type="text" class="form-control" id="reseller-expire-date" disabled />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
