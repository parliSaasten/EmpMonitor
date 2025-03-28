const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebAppActivitySchema = new Schema({
    organization_id: { type: Number, required: true },
    employee_id: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String },
    yyyymmdd: { type: Number, required: true },
    application_name: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
}, { timestamps: true });

WebAppActivitySchema.index({ organization_id: 1, employee_id: 1 });

const WebAppActivityModel = mongoose.model('web-app-activity', WebAppActivitySchema);

module.exports = WebAppActivityModel;
