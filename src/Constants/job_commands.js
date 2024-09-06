// List of job types and their corresponding commands
const jobCommands = {
    selenium_stage_smoke: '/selenium_stage_smoke',
    selenium_stage_regression: '/selenium_stage_regression',
    selenium_prod_smoke: '/selenium_prod_smoke',
    selenium_prod_regression: '/selenium_prod_regression',
    cypress_stage_smoke: '/cypress_stage_smoke',
    cypress_stage_regression: '/cypress_stage_regression',
    cypress_prod_smoke: '/cypress_prod_smoke',
    cypress_prod_regression: '/cypress_prod_regression',
    pw_stage_smoke: '/pw_stage_smoke',
    pw_stage_regression: '/pw_stage_regression',
    pw_prod_smoke: '/pw_prod_smoke',
    pw_prod_regression: '/pw_prod_regression',
    all_prod_smoke: '/all_prod_smoke',
    all_stage_smoke: '/all_stage_smoke',
    all_stage_smokes_and_regs: '/all_stage_smokes_and_regs'
};

module.exports = jobCommands;