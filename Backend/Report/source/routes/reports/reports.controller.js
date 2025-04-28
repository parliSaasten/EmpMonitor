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
                let dataId = moment.utc(e.dataId);
                for (const app of e.appUsage) {
                    let start_time = moment.utc(dataId).add(app.start, 'second');
                    let end_time = moment.utc(dataId).add(app.end, 'second');

                    let keystrokesCount = e.activityPerSecond.keystrokes.slice(app.start, app.end).filter((e) => +e !== 0).length;
                    let mouseMovementsCount = e.activityPerSecond.mouseMovements.slice(app.start, app.end).filter((e) => +e !== 0).length;
                    let buttonClicks = e.activityPerSecond.buttonClicks.slice(app.start, app.end).filter((e) => +e !== 0).length;

                    let resp = await ReportModel.addAppUsage({
                        employee_id: user.id,
                        application_name: app.app,
                        title: app.title,
                        url: app.url,
                        start_time: start_time.toISOString(),
                        end_time: end_time.toISOString(),
                        yyyymmdd: dataId.format('YYYYMMDD'),
                        keystrokes: app.keystrokes ?? "",
                        keystrokesCount,
                        mouseMovementsCount,
                        buttonClicks,
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