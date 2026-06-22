import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`✅ KodaPilot API listening on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to bootstrap:', err);
  process.exit(1);
});
