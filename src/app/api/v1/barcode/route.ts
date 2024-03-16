import { z } from 'zod';
import { createCanvas } from 'canvas';
import JsBarcode from 'jsbarcode';
import { apiHandler } from '@/app/api/helpers/handler';

export type BarResponse = Blob;

const generateQrSchema = z.object({
  code: z.string().nullish(),
});

const generateBarCode = (data: string, edgeSize = 150) => {
  const canvas = createCanvas(edgeSize, edgeSize);
  const options: JsBarcode.Options = {
    format: "EAN13",
    flat: true,
    height: 60,
  };
  JsBarcode(canvas, data, options);
  return canvas.toDataURL();
};

export const GET = apiHandler.create({
  authentication: false,
  inputSchema: generateQrSchema,
  handler: async ({ session, input }): Promise<BarResponse> => {
    const code = input.code || '123456789012';
    const barCodeDataUrl = generateBarCode(code);
    const barCodeBlob = (await fetch(barCodeDataUrl)).blob();

    return barCodeBlob;
  },
});
