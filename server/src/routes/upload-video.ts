import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prsima';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.post('/videos', async (req: FastifyRequest, reply: FastifyReply) => {
    const data = await req.file();

    if (!data) return reply.status(400).send({ error: 'Missing file input' });

    const extension = path.extname(data.filename);
    if (extension !== '.mp3')
      return reply.status(400).send({ error: 'Invalid input type, please upload MP3' });

    const fileBaseName = path.basename(data.filename, extension);

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadDir = path.resolve(__dirname, '../', '../', 'tmp', fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDir));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDir,
      },
    });

    return { video };
  });
}
