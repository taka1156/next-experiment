import { z } from 'zod';
import { createCanvas, loadImage } from 'canvas';
import QRCode, { QRCodeSegment, QRCodeRenderersOptions } from 'qrcode';
import { apiHandler } from '@/app/api/helpers/handler';
const logoUrl = 'src/static/qrIcon/47517002.jpeg';

export type QrResponse = Blob;

const generateQrSchema = z.object({
  code: z.string().nullish(),
});

const headers = new Headers();
headers.set('Content-Type', 'Image/png');

/**
 *
 * @param baseEdgeSize {QRコード画像(大元)の一辺のサイズ}
 * @returns
 */
const resizeLogo = async (baseEdgeSize: number) => {
  const logoEdgeSize = baseEdgeSize / 4;
  const canvas = createCanvas(logoEdgeSize, logoEdgeSize);
  const ctx = canvas.getContext('2d');
  const logo = await loadImage(logoUrl);
  ctx.drawImage(logo, 0, 0, logoEdgeSize, logoEdgeSize);
  return canvas.toDataURL();
};

/**
 *
 * @param data {QRコードの内容}
 * @param edgeSize {QRコード画像の一辺のサイズ}
 * @returns
 */
const generateQrCode = async (
  data: string,
  edgeSize = 150
): Promise<string> => {
  const canvas = createCanvas(edgeSize, edgeSize);

  const segment: QRCodeSegment[] = [{ data: data }];
  const options: QRCodeRenderersOptions = {
    margin: 1,
    width: edgeSize,
    errorCorrectionLevel: 'H',
  };

  // canvas、QR生成
  const ctx = canvas.getContext('2d');
  await QRCode.toCanvas(canvas, segment, options);

  // ロゴサイズ調整
  const resizeLogoImg = await resizeLogo(edgeSize);
  const logo = await loadImage(resizeLogoImg);

  // ロゴの位置調整
  const left = Math.floor((canvas.width - logo.width) / 2);
  const top = Math.floor((canvas.height - logo.height) / 2);

  ctx.drawImage(logo, left, top);

  return canvas.toDataURL();
};

export const GET = apiHandler.create({
  authentication: false,
  inputSchema: generateQrSchema,
  headers,
  handler: async ({ session, input }): Promise<QrResponse> => {
    const code = input.code || 'https://www.taka1156.site';
    const qrDataUrl = await generateQrCode(code);
    const qrBlob = (await fetch(qrDataUrl)).blob();

    return qrBlob;
  },
});
