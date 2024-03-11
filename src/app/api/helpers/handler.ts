import { Session } from 'inspector';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { HttpException } from './HttpException.';

type ResponseJson = Record<string, any>;
type ResponseBlob = Blob;
type ErrorResponseJson = { message: string };

const switchingResponse = (
  handlerResult: ResponseBlob | ResponseJson,
  headers?: Headers
): NextResponse<ResponseBlob | ResponseJson> => {
  if (handlerResult instanceof Blob) {
    return new NextResponse(handlerResult, {
      status: 200,
      statusText: 'success',
      headers,
    });
  } else {
    return NextResponse.json(handlerResult, { status: 200 });
  }
};

type Context<S extends z.ZodSchema, A extends boolean = boolean> = {
  req: NextRequest;
  input: z.infer<S>;
  session: A extends true ? Session : Session | null;
};

type CreateArgs<S extends z.ZodSchema = z.ZodSchema<unknown>> =
  | {
      authentication?: false;
      headers?: Headers;
      inputSchema?: S;
      handler: (
        ctx: Context<S, false>
      ) => Promise<ResponseJson> | Promise<ResponseBlob> | ResponseJson;
    }
  | {
      authentication: true;
      headers?: Headers;
      inputSchema?: S;
      handler: (
        ctx: Context<S, true>
      ) => Promise<ResponseJson> | Promise<ResponseBlob> | ResponseJson;
    };

export const apiHandler = {
  create: <S extends z.Schema<unknown> = z.Schema<unknown>>({
    authentication,
    inputSchema,
    headers,
    handler,
  }: CreateArgs<S>) => {
    return async (
      req: NextRequest,
      { params }: { params: Record<string, unknown> }
    ): Promise<
      NextResponse<ResponseJson | ResponseBlob | ErrorResponseJson>
    > => {
      const session = await getServerSession();

      // 認証エラー
      if (authentication && !session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const context = {
        req,
        session,
      } as Context<S, true> & Context<S, false>;

      // urlパラメータ
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);
      // formの値
      const body = req.body
        ? ((await req.json()) as Record<string, unknown>)
        : {};

      const input = {
        ...searchParams,
        ...params,
        ...body,
      };

      // 要求がおかしい(バリデーションエラー、操作するための権限が足りないなど)
      if (inputSchema) {
        try {
          context.input = inputSchema.parse(input);
        } catch (err) {
          console.error(err);
          return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
        }
      } else {
        context.input = input;
      }

      // 正常処理、（もしくは処理できるところまで辿り着けたが失敗）
      try {
        const handlerResult = await handler(context);
        return switchingResponse(handlerResult, headers);
      } catch (err) {
        console.error(err);
        if (err instanceof HttpException) {
          return NextResponse.json(
            { message: err.message },
            { status: err.status }
          );
        }
      }

      // サーバー内部エラー
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    };
  },
};
