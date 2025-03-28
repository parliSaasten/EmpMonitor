const ReportModel = require('./reports.model');
const moment = require('moment-timezone');

class ReportsController {
    async addData (req, res, next) {
        let user = req.user;
        try {
            let { ...rest } = req.body;
            let data = {
                employee_id: user.id,
                ...rest
            };
            let response = [];
            for (const e of data.data) {
                // let start_time = 
                let dataId = moment.utc(e.dataId);
                for (const app of e.appUsage) {
                    let start_time = moment.utc(dataId).add(app.start, 'second');
                    let end_time = moment.utc(dataId).add(app.end, 'second');
                    let resp = await ReportModel.addAppUsage({
                        employee_id: user.id,
                        application_name: app.app,
                        title: app.title,
                        url: app.url,
                        start_time: start_time.toISOString(),
                        end_time: end_time.toISOString(),
                        yyyymmdd: dataId.format('YYYYMMDD')
                    });
                    response.push(resp);
                }
            }
            // let response = await ReportModel.addData(data);
            return res.status(200).json({
                code: 200,
                message: 'Data added successfully',
                data: response
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportsController();