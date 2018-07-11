const inquirer = require('inquirer');
const files = require('./files');


module.exports = {

    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Github Username or e-mail address : ',
                validate: function(values){
                    if(values.length){
                        return true;
                    }else{
                        return 'Please enter your username or e-mail address.'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your Github Password :',
                validate: function(values){
                    if(values.length){
                        return true;
                    }else{
                        return 'Please enter your password.'
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type:'input',
                name:'name',
                message:'Enter a name for the repository',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function(value){
                    if(value.length){
                        return true;
                    } else {
                        return 'Please enter a name for the repository'
                    }
                }
        },
        {
            type: 'input',
            name: 'visibility',
            message: "Public or private: ",
            choices: ['Public','Private'],
            default: 'public'
        }
        ];
        return inquirer.prompt(questions);
    },
    askIgnoreFiles: (fileList) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files you wish to IGNORE',
                choices: fileList,
                default: ['node_modules','bower_components']
            }
        ];
        return inquirer.prompt(questions);
    }
};