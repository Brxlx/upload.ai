import { fastify } from 'fastify';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import fastifyMultipart from '@fastify/multipart';
import { fastifyCors } from '@fastify/cors';
import { uploadVideoRoute } from './routes/upload-video';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generateAiCompletionRoute } from './routes/generate-ai-completion';

const app = fastify();

// Configs
app.register(fastifyCors, { origin: '*' });
app.register(fastifyMultipart, {
  limits: {
    fileSize: 1_048_576 * 25, // 25mb
  },
});

// Routes
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAiCompletionRoute);

// Bootstrap
app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server Running');
  });
