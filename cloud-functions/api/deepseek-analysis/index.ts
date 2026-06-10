import { getDeepSeekAnalysis } from "../../../src/lib/deepseekPrompt";

type EdgeOneRequest = Request & {
  json: () => Promise<{
    profile?: unknown;
    recommendations?: unknown;
    cases?: unknown;
  }>;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

export async function onRequest({
  request,
  env
}: {
  request: EdgeOneRequest;
  env: Record<string, string | undefined>;
}) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const apiKey = env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return jsonResponse(
      { error: "DeepSeek API Key 未配置。请在 EdgeOne Pages 环境变量中设置 DEEPSEEK_API_KEY。" },
      500
    );
  }

  const { profile, recommendations, cases } = await request.json();

  if (!profile || !recommendations) {
    return jsonResponse({ error: "缺少用户背景或推荐结果。" }, 400);
  }

  try {
    const analysis = await getDeepSeekAnalysis({
      apiKey,
      profile,
      recommendations,
      cases
    });

    return jsonResponse({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "DeepSeek API 请求异常。";
    return jsonResponse({ error: message }, 500);
  }
}
