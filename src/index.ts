#!/usr/bin/env node

import {program} from "commander";
import {Submitter} from "./submitter";

(async () => {
    let defaultExecutable = '/usr/bin/chromium-browser';
    defaultExecutable = process.platform === "win32" ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : defaultExecutable;
    defaultExecutable = process.platform === "darwin" ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : defaultExecutable;
    program
        .name('dr-auto-submit')
        .usage('-a <accountId> -u <username> -p <password> -s <mode1l>:<raceHash1> -s <model2>:<raceHash2>')
        .requiredOption('-a, --account <accountId>', 'Account Id to use for autosubmission. Sample: -a 6817631413')
        .requiredOption('-u, --username <username>', 'Username used for submission. Sample: -u Aihsadhahl')
        .requiredOption('-p, --password <password>', 'Password used to login to console. Sample: -p iuasdadgad12')
        .requiredOption('-s, --submit <model>:<raceHash>', 'Model and race to submit to, you can provide multiple submissions. -s awesome-model:races/arn%3Aaws%3Adeepracer%3A%3A%3Aleaderboard%2F55234c74-2c48-466d-9e66-242ddf05e04d', (v, p) => p.concat(v), [])
        .option('-e, --executable', `Location of your chrome binary file. Default ${defaultExecutable}`, defaultExecutable)
        .option('-d, --debug', 'Enable debug')
        .option('--no-headless', 'Disable headless mode')
        .helpOption('-h, --help', 'Read more information');
    program.parse(process.argv);
    let options: any = program.opts();
    let {account, username, password, submit, headless, debug, executable} = options;
    if (debug) {
        console.log('Options:', options);
    }
    let submissions: { model: string, hash: string }[] = []
    for (let i = 0; i < submit.length; i++) {
        let s = submit[i];
        let a: string[] = s.split(':')
        //if (a.length != 2) {
        //    console.log("Invalid submission: ", a.join(':'))
        //    program.outputHelp()
        //    return;
        //}
        //submissions.push({model: a[0], hash: a[1]})
        if (a.length != 2) {
            console.log('Model:',a[0]);
            submissions.push({model: a[0], hash: "races/arn%3Aaws%3Adeepracer%3A%3A549828897912%3Aleaderboard%2Ff1ff4d1e-0da2-43ba-aa74-0f13bd627414"});
        }else
        {
            submissions.push({model: a[0], hash: a[1]})
        }
    }
    executable = executable ?? defaultExecutable;
    if (submissions.length == 0) {
        console.log(`Please provide at least 1 valid submission.`);
        return;
    }
    await new Submitter({account, username, password, submissions, headless, debug, executable}).submit()
})();
