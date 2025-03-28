const dateRangeLocalizations = {
    ranges: {
        [dateRangesLocalization.Today]: [moment(), moment()],
        [dateRangesLocalization.Yesterday]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.Last_7_Days]: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.Last_30_Days]: [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.This_Month]: [moment().startOf('month'), moment().endOf('month')],
        [dateRangesLocalization.Last_Month]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    },
    locale: {
        'customRangeLabel': dateRangesLocalization.Custom_Range,
        "applyLabel": dateRangesLocalization.apply,
        "cancelLabel": dateRangesLocalization.cancel,
    }
};

const dateRangeLocalization = {
    dateLimit: { days : '30' },
    minDate : moment().subtract(180, 'days'),
    ranges: {
        [dateRangesLocalization.Today]: [moment(), moment()],
        [dateRangesLocalization.Yesterday]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.Last_7_Days]: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.Last_30_Days]: [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
        [dateRangesLocalization.This_Month]: [moment().startOf('month'), moment().endOf('month')],
        [dateRangesLocalization.Last_Month]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    locale: {
        'customRangeLabel': dateRangesLocalization.Custom_Range,
        "applyLabel": dateRangesLocalization.apply,
        "cancelLabel": dateRangesLocalization.cancel,
    }

};

