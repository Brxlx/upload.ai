import { streamToResponse, OpenAIStream } from 'ai';

import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prsima';
import { z } from 'zod';
import { openai } from '../lib/openai';

export async function generateAiCompletionRoute(app: FastifyInstance) {
  app.post('/ai/generate', async (req, reply) => {
    const bodySchema = z.object({
      videoId: z.string().cuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, prompt: template, temperature } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    if (!video?.transcription)
      reply.status(400).send({ error: 'Video transcription was not generated yet.' });

    const promptMessage = template.replace('{transcription}', video.transcription!);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        {
          role: 'user',
          content: promptMessage,
        },
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);

    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  });
}
