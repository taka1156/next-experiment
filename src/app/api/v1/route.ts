import { apiHandler } from '@/app/api/helpers/handler';

export const GET = apiHandler.create({
  authentication: false,
  handler: async () => {
    return {
        statusMsg: "Running Server v1"
    };
  },
});
