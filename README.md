## Harvest CLI

Harvest CLI is a command line interface for logging time to Harvest

## Installation

```bash
git clone https://github.com/donaldp/harvest-cli.git
cd harvest-cli
npm install
npm run build
npm install . -g
```

## Usage

```bash
harvest --help
```

## Configuration

```bash
harvest login
harvest list:projects --refresh
harvest list:tasks --refresh
```

## Commands

Command | Description
--- | ---
`harvest --help` | Show help
`harvest login` | Login to Harvest
`harvest logout` | Logout of Harvest
`harvest status` | Check if logged in
`harvest auto:run` | Automatically log time
`harvest list:accounts` | List all accounts
`harvest list:projects` | List all projects
`harvest list:tasks` | List all tasks
`harvest log:time` | Log time to Harvest
`harvest log:hibernate` | Stop the auto time logger
`harvest report:day` | Get a report for the day
`harvest report:yesterday` | Get a report for yesterday
`harvest report:week` | Get a report for the week
`harvest report:month` | Get a report for the month

## Auto time logger (coming soon)

To automatically log time, run the following command:

```bash
pm2 start harvest --name harvest-auto --cron "30 17 * * 1-5" -- --hours"8" --project="1234567"
pm2 save
```

The `--hours` flag is optional and defaults to `8` hours.

The `--project` flag is optional and defaults to the default project.

## Todo

- [ ] Add tests
- [ ] Allow for multiple accounts
- [ ] Commands
    - [x] `harvest login`
    - [x] `harvest logout`
    - [x] `harvest status`
    - [ ] `harvest auto:run`
    - [x] `harvest list:accounts`
    - [x] `harvest list:projects`
    - [x] `harvest list:tasks`
    - [x] `harvest log:time`
    - [ ] `harvest log:hibernate`
    - [ ] `harvest report:day`
    - [ ] `harvest report:yesterday`
    - [ ] `harvest report:week`
    - [ ] `harvest report:month`


Security
-------

If you discover any security related issues, please email donaldpakkies@gmail.com instead of using the issue tracker.

License
-------

The MIT License (MIT). Please see [License File](LICENSE) for more information.
