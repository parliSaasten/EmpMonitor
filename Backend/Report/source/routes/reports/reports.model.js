const WebAppModel = require('../../model/web_app_activity.model');

class ReportsModel {
    addAppUsage(data) {
        return new WebAppModel(data).save();
    }
}

module.exports = new ReportsModel();