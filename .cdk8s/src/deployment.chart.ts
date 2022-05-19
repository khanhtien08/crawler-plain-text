import { Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { ImagePullPolicy, IResource } from 'cdk8s-plus-17';
import { AdvancedChartProps, IngressRoute } from '@messenger/api.cdk';
import { AdvancedDeployment } from '@messenger/api.cdk';
import * as path from 'path';

let hostName: string;

const chartProps: AdvancedChartProps = {
    service: [
        { port: 3000, name: 'http' },
        { port: 5000, name: 'grpc' },
    ],
    container: {
        ports: [
            { containerPort: 3000, name: 'http' },
            { containerPort: 5000, name: 'grpc' },
        ],
        resources: {
            limits: { cpu: '1', memory: '1Gi' },
            requests: { cpu: '1', memory: '1Gi' },
        },
    },
    hpa: { minReplicas: 1, maxReplicas: 2 },
    dockerImage: {
        image: '',
        imagePullPolicy: ImagePullPolicy.ALWAYS,
    },
    secrets: {
        imagePullSecrets: 'harbor-live',
        ingressRouteTls: 'messenger-tls-cert',
        ingressRouteMiddlewareAuth: 'msgr-auth-v2',
    },
};

/**
 * Kind: Generate Deployment chart
 */
export class DeploymentChart extends Chart {
    constructor(scope: Construct, ns: string, chartName: string, env: string = 'development', repo: string = '') {
        super(scope, ns);

        switch (env) {
            case 'development':
                chartProps.secrets.imagePullSecrets = 'harbor-dev';
                hostName = 'msgr-gw-dev.hlapis.com';
                break;
            case 'sandbox':
                chartProps.secrets.imagePullSecrets = 'harbor-dev';
                hostName = 'msgr-gw-sb.hlapis.com';
                chartProps.container.resources = {
                    limits: { cpu: '1', memory: '2Gi'},
                    requests: { cpu: '500m', memory: '1Gi' },
                };
                chartProps.hpa = { minReplicas: 1, maxReplicas: 1 };
                break;
            case 'production':
                chartProps.secrets.imagePullSecrets = 'harbor-live';
                hostName = 'msgr-gw.hlapis.com';
                chartProps.container.resources = {
                    limits: { cpu: '1', memory: '2Gi'},
                    requests: { cpu: '500m', memory: '1Gi' },
                };
                chartProps.hpa = { minReplicas: 1, maxReplicas: 1 };
                break;
            default:
                chartProps.secrets.imagePullSecrets = '';
                break;
        }

        const objRepo = Object.freeze({ image: `${repo}` });

        const deploy = new AdvancedDeployment(this, chartName, {
            appEnvironmentConfig: path.resolve(`../env.${env}.yaml`),
            appEnvironmentType: env,
            imagePullSecrets: [{ name: chartProps.secrets.imagePullSecrets }],
            resources: chartProps.container.resources,
            hpa: chartProps.hpa,
            ports: chartProps.container.ports,
            containers: [{ ...objRepo, imagePullPolicy: chartProps.dockerImage.imagePullPolicy }],
        });

        const service = deploy.exposeMultiplePorts(chartProps.service);

        const ingressRoute = new IngressRoute(this, `${chartName}-`, { tls: chartProps.secrets.ingressRouteTls });
        const middlewares: IResource[] = [{ name: chartProps.secrets.ingressRouteMiddlewareAuth }];

        ingressRoute.addRoute(
            'Host(`' +
                hostName +
                '`) && PathPrefix(`/v2/crawler`)',
            [{ service, name: 'http' }],
        );
        ingressRoute.addRoute(
            'Host(`' + hostName + '`) && PathPrefix(`/v2/crawler/_docs`)',
            [{ service, name: 'http' }],
            middlewares,
        );
    }
}
