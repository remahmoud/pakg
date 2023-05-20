#!/usr/bin/env node

const fs = require("node:fs");
const chalk = require("chalk");
const path = require("node:path");
const shell = require("shelljs");
const process = require("node:process");
const { Command } = require("commander");

// crete a new program
const program = new Command();

// set the version
program.version("1.0.0");

// set the description
program.description(
    chalk.blue.bold("A CLI tool to check and update outdated packages")
);

// set the options
program
    .option("-c --check", "check for outdated packages")
    .option("-u, --update", "update outdated packages");

// parse the arguments
program.parse(process.argv);

const options = program.opts();

// check if the user has provided any arguments
// if not, show the help
if (process.argv.length < 3) {
    program.help();
}

// check if the user has provided both the options
if (options.update && options.check) {
    console.log("Please provide only one option");
    process.exit(0);
}

// check if the user has provided any other argument
// update the packages if the user has provided the update option
if (options.update) {
    console.log(chalk.yellow("Updating packages..."));

    // check if the user is using yarn or npm
    if (isYarn()) {
        const output = shell.exec("yarn upgrade", { silent: true });

        if (output.stderr) {
            console.log(chalk.red("Error:"));
            console.log(output.stderr);
        } else {
            console.log(chalk.green("Packages updated successfully."));
        }
    } else {
        const output = shell.exec("npm update", { silent: true });

        if (output.stderr) {
            console.log(chalk.red("Error:"));
            console.log(output.stderr);
        } else {
            console.log(chalk.green("Packages updated successfully."));
        }
    }
}
if (options.check) {
    console.log(chalk.yellow("Checking for outdated packages..."));

    // check if the user is using yarn or npm
    if (isYarn()) {
        const output = shell.exec("yarn outdated", { silent: true });

        if (output.stdout) {
            console.log(chalk.red("Outdated packages found:"));
            console.log(output.stdout);
        } else {
            console.log(chalk.green("No outdated packages found."));
        }
    } else {
        const output = shell.exec("npm outdated", { silent: true });

        if (output.stdout) {
            console.log(chalk.red("Outdated packages found:"));
            console.log(output.stdout);
        } else {
            console.log(chalk.green("No outdated packages found."));
        }
    }
}

function isYarn() {
    return fs.existsSync(path.join(process.cwd(), "yarn.lock"));
}
