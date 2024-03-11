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
 * @param baseWidth {大元のキャンバスの横幅}
 * @param baseHight {大元のキャンバスの縦幅}
 * @returns 
 */
const resizeLogo = async (baseWidth: number, baseHight: number) => {
  const canvas = createCanvas(baseWidth / 4, baseHight / 4);
  const ctx = canvas.getContext('2d');
  const logo = await loadImage(logoUrl);
  ctx.drawImage(logo, 0, 0, baseWidth / 4, baseHight / 4);
  return canvas.toDataURL();
};


const generateQrCode = async (
  data: string,
  edgeSize = 500
): Promise<string> => {
  const canvas = createCanvas(edgeSize, edgeSize);

  const segment: QRCodeSegment[] = [
    { data: data},
  ];
  const options: QRCodeRenderersOptions = {
    margin: 1,
    width: edgeSize,
  };

  // canvas、QR生成
  const ctx = canvas.getContext('2d');
  await QRCode.toCanvas(canvas, segment, options);

  // ロゴサイズ調整
  const resizeLogoImg = await resizeLogo(canvas.width, canvas.height);
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
    const code = input.code || "https://www.taka1156.site";
    const qrDataUrl = await generateQrCode(code);
    const qrBlob = (await fetch(qrDataUrl)).blob();

    return qrBlob;
  },
});

// 型 '({ session, input }: Context<ZodObject<{ code: ZodString; }, "strip", ZodTypeAny, { code: string; }, { code: string; }>, false>) => Promise<QrResponse>' を型 '((ctx: Context<ZodObject<{ code: ZodString; }, "strip", ZodTypeAny, { code: string; }, { code: string; }>, false>) => ResponseJson | Promise<...> | Promise<...>) | ((ctx: Context<...>) => ResponseJson | ... 1 more ... | Promise<...>)' に割り当てることはできません。
// 型 '({ session, input }: Context<ZodObject<{ code: ZodString; }, "strip", ZodTypeAny, { code: string; }, { code: string; }>, false>) => Promise<QrResponse>' を型 '(ctx: Context<ZodObject<{ code: ZodString; }, "strip", ZodTypeAny, { code: string; }, { code: string; }>, false>) => ResponseJson | Promise<...> | Promise<...>' に割り当てることはできません。
// 型 'Promise<QrResponse>' を型 'ResponseJson | Promise<ResponseJson> | Promise<Blob>' に割り当てることはできません。
// 型 'Promise<QrResponse>' を型 'Promise<ResponseJson>' に割り当てることはできません。
// 型 'QrResponse' を型 'ResponseJson' に割り当てることはできません。
//           型 'string' is missing in type 'QrResponse' のインデックス シグネチャがありません。
