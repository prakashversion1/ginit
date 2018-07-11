const confingStore = require('configstore');
const pkg = require('../package.json');
const octokit = require('@octokit/rest')();
const _ = require('lodash');
const CLI = require('clui');
const spinner = CLI.Spinner;
const chalk = require('chalk');
const inquirer = require('./inquirer');

const conf = new confingStore(pkg.name);

module.exports =
    {
        getInstance: () => {
            return octokit;
        },

        getStoredGitHubToken: () => {
            return conf.get('github.token');
        },

        setGitHubCredentials: async () => {
            const credentials = await inquirer.askGithubCredentials();
            octokit.authenticate(
                _.extend(
                    {
                        type: 'basic',
                    },
                    credentials
                )
            );
        },

        registerNewToken: async () => {
            const status = new spinner('Authenticating you, please wait');
            status.start();
            try {
                const respone = await octokit.authorization.create({
                    scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                    note: 'ginits, the command-line tool for initalizing Git repos'
                });
                const token = respone.data.token;
                if (token) {
                    conf.set('github.token', token);
                    return token;
                }
                else {
                    throw new Error("Missing token", "Github token was not found in the response");
                }
            } catch (err) {
                throw err;
            } finally {
                status.stop();
            }
        },

        gethubAuth: (token) => {
            octokit.authenticate({
                type: 'oauth',
                token: token
            });
        },


        getStoredGitHubToken: () => {
            return conf.get('github.token');
        }
    };