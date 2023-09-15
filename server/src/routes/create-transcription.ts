import { createReadStream } from 'node:fs';

import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prsima';
import { z } from 'zod';
import { openai } from '../lib/openai';

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async req => {
    const paramsSchema = z.object({
      videoId: z.string().cuid(),
    });
    const { videoId } = paramsSchema.parse(req.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);

    const { path } = await prisma.video.findUniqueOrThrow({ where: { id: videoId } });

    const audioReadStream = createReadStream(path);

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    });

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription: response.text,
      },
    });

    return { transcription: response.text };
  });
}
