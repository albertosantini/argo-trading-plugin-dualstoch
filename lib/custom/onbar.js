"use strict";

module.exports = onbar;

var util = require("util"),
    barsUtil = require("../util/bars"),
    stoch = require("../indicators/stoch"),
    ema = require("../indicators/ema"),
    orderUtil = require("../util/order");

var SETUP = {
    instruments: {
        "EUR_USD": true,
        "USD_JPY": true,
        "GBP_USD": true,
        "EUR_GBP": true,
        "EUR_JPY": true,
        "USD_CAD": true,
        "AUD_USD": true,
        "GBP_JPY": true
    },

    granularity: "M5",
    count: 100,
    units: 100
};

function onbar(bar) {
    var instruments = SETUP.instruments,
        granularity = SETUP.granularity,
        count = SETUP.count,
        units = SETUP.units,
        instrument = bar.instrument;

    if (!instruments[instrument] || bar.granularity !== granularity) {
        return;
    }

    util.log(bar.time, instrument, bar.granularity, bar.volume);

    barsUtil.getHistBars({
        instrument: instrument,
        granularity: granularity,
        count: count + 1
    }, function (err, bars) {
        var closes,
            lastClose,
            highs,
            lows,
            slowStoch,
            fastStoch,
            lastSlow,
            lastFast,
            emaSeries,
            lastEma,
            side;

        if (err) {
            util.log(err);
            return;
        }

        bars.splice(0, 1); // remove first element, because it is incomplete
        bars = bars.reverse(); // we need oldest-0 / newest-last

        closes = bars.map(function (x) {
            return x.closeMid;
        });
        lastClose = closes.slice(-1)[0];

        highs = bars.map(function (x) {
            return x.highMid;
        });

        lows = bars.map(function (x) {
            return x.lowMid;
        });

        slowStoch = stoch(closes, highs, lows, 21, 4);
        fastStoch = stoch(closes, highs, lows, 5, 2);
        lastSlow = slowStoch.d.slice(-1)[0];
        lastFast = fastStoch.k.slice(-1)[0];

        util.log("Hist Bars loaded for", instrument,
            "slow", lastSlow.toFixed(2), "fast", lastFast.toFixed(2));

        if (lastSlow < 20 && lastFast > 80) {
            side = "sell";
        }
        if (lastSlow > 80 && lastFast < 20) {
            side = "buy";
        }

        if (!side) {
            return;
        }

        emaSeries = ema(closes, 20);
        lastEma = emaSeries.slice(-1)[0];

        util.log("Testing with EMA", instrument, side,
            "close", lastClose.toFixed(2), "ema", lastEma.toFixed(2));

        if ((side === "sell" && lastClose < lastEma) ||
            (side === "buy" && lastClose > lastEma)) {

            orderUtil.fillOrder({
                instrument: instrument,
                type: "market",
                side: side,
                units: units,
                trailingStop: 20
            }, function (orderErr, trade) {
                if (!orderErr) {
                    util.log(trade.time, instrument, side, trade.price);
                } else {
                    util.log(orderErr);
                }
            });
        }
    });
}
