import { ConfigService, SentryInterceptor } from '@halonext/msgr-api-common';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { GrpcModule } from './grpc/grpc.module';
import { HttpModule } from './http/http.module';
import { COMMON_ROUTES } from './routes';

const logger = new Logger('Bootstrap');
const configs = new ConfigService();

const SERVICE_NAME = configs.get('service.name');
const SERVICE_PORT = configs.get('service.port');
const GLOBAL_PREFIX = configs.get('service.globalPrefix');
const LOG_LEVEL = configs.get('log.level', ['log', 'error', 'warn', 'debug', 'verbose'] as LogLevel[]);

const PACKAGE = configs.package('name');
const VERSION = configs.package('version');

const GRPC_CONFIGS = configs.get('grpc.configs');

async function bootstrap() {
    const grpcOptions = {
        transport: Transport.GRPC,
        options: {
            ...GRPC_CONFIGS,
            protoPath: require.resolve('@halonext/msgr-api-common/proto/crawler.proto'),
        },
        logger: LOG_LEVEL,
    };

    // gRPC
    const grpc = await NestFactory.createMicroservice(GrpcModule, grpcOptions);
    await grpc.listenAsync();

    const http = await NestFactory.create(HttpModule, {
        logger: LOG_LEVEL,
        cors: true,
    });

    http.setGlobalPrefix(GLOBAL_PREFIX);
    http.useGlobalInterceptors(new SentryInterceptor());
    http.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            // forbidUnknownValues: true,
        }),
    );

    // Swagger
    const options = new DocumentBuilder().setTitle(PACKAGE).setVersion(VERSION).addBearerAuth({ type: 'http' }).build();
    const document = SwaggerModule.createDocument(http, options);

    SwaggerModule.setup(`${GLOBAL_PREFIX}/${COMMON_ROUTES.DOCS}`, http, document, {
        swaggerOptions: {
            displayRequestDuration: true,
            tryItOutEnabled: true,
            persistAuthorization: true,
        },
    });

    await http.listen(SERVICE_PORT);
}

bootstrap().then(() => logger.log(`${SERVICE_NAME.toUpperCase()} started at ${SERVICE_PORT}`));
