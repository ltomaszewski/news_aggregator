module.exports = {
    apps: [
        {
            "name": "NEWS_AGGREGATOR",
            "script": "dist/index.js",
            "args": "--runmode=producation",
            "exp_backoff_restart_delay": 10000,
            "cron_restart": '0 1 * * *'
        }
    ]
};
