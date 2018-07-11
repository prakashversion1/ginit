const files = require('./lib/files');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const inquirer = require('./lib/inquirer');
const github = require('./lib/github');
const repo = require('./lib/repo');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('GINIT',{horizontalLayout:'full'})
    )
);

const run = async () => {
    try{
        // retieve and set authentication token
        const token = await getGithubToken();
        github.gethubAuth(token);

        // create remote repository
        const url = await repo.createRemoteRepo();

        //create .gitignore file
        await repo.createGitignore();

        // set up local repository and push to remote
        const done = await repo.setupRepo(url);
        if(done){
            console.log(chalk.green('All Done !!!'));
        }
    } catch(err){
        if(err){
            switch(err.code){
                case 401:
                    console.log(chalk.red('Coudn\'t log you in. Please provide corrent credentials'));
                    break;
                case 422:
                    console.log(chalk.red('There already exists a remote repository with the same name'));
                    break;
                default:
                    console.log(err);
            }
        }
    }
};

const getGithubToken = async() => {
    let token = github.getStoredGitHubToken();
    if(token){
        return token;
    }
    // no token found,
    await github.setGitHubCredentials();
    token = await github.registerNewToken();
    return token;
};



run();
// if(files.directoryExists('.git')){
//     console.log(chalk.red('Already a git repository exists'));
//     process.exit();
// }else{
//     console.log(chalk.green('No git repository exists'));
//     process.exit();
// }