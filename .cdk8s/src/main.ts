import { App } from 'cdk8s';
import * as yargs from 'yargs';
import { DeploymentChart } from './deployment.chart';

const argv = yargs
    .option('chart', {
        alias: 'c',
        description: 'chart name',
        type: 'string',
    })
    .option('namespace', {
        alias: 'n',
        description: 'custom namespace',
        type: 'string',
    })
    .option('env', { alias: 'e', description: 'env-prepare parameters for deployment (dev/sb/live)', type: 'string' })
    .option('repo', { alias: 'r', description: 'determine repository to push image', type: 'string' })
    .demandOption(['chart'], 'Please provide both chart name & namespace arguments.')
    .help()
    .alias('help', 'h')
    .default('namespace', 'msgr').argv;

if (argv.chart && argv.namespace && argv.env) {
    const app = new App({ outdir: `./cdk8s` });
    new DeploymentChart(app, argv.namespace, argv.chart, argv.env, argv.repo);
    app.synth();
}
