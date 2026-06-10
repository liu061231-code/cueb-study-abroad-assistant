import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDeepSeekAnalysis } from "../src/lib/deepseekPrompt";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "DeepSeek API Key 未配置。请在部署平台环境变量中设置 DEEPSEEK_API_KEY。"
    });
  }

  const { profile, recommendations, cases } = req.body ?? {};

  if (!profile || !recommendations) {
    return res.status(400).json({ error: "缺少用户背景或推荐结果。" });
  }

  try {
    const analysis = await getDeepSeekAnalysis({
      apiKey,
      profile,
      recommendations,
      cases
    });

    return res.status(200).json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "DeepSeek API 请求异常。";
    return res.status(500).json({ error: message });
  }
}
