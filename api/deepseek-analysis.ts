/// <reference types="node" />

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDeepSeekAnalysis } from "../src/lib/deepseekPrompt";

const sendJsonError = (res: VercelResponse, status: number, error: string) =>
  res.status(status).json({ error });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    return sendJsonError(res, 405, "Method not allowed");
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return sendJsonError(
      res,
      500,
      "DeepSeek API Key 未配置。请在 Vercel 环境变量中设置 DEEPSEEK_API_KEY。"
    );
  }

  const { profile, recommendations, cases } = req.body ?? {};

  if (!profile || !recommendations) {
    return sendJsonError(res, 400, "缺少用户背景或推荐结果。");
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
    return sendJsonError(res, 500, message);
  }
}
