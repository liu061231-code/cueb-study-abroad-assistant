import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

const compactRecommendations = (recommendations: unknown) => {
  if (!recommendations || typeof recommendations !== "object") return recommendations;
  return recommendations;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "DeepSeek API Key 未配置。请在 Vercel 环境变量中设置 DEEPSEEK_API_KEY。"
    });
  }

  const { profile, recommendations, cases } = req.body ?? {};

  if (!profile || !recommendations) {
    return res.status(400).json({ error: "缺少用户背景或推荐结果。" });
  }

  const caseList = Array.isArray(cases) ? cases : [];
  const caseContext =
    caseList.length > 0
      ? caseList.slice(0, 35)
      : "案例库暂无对应样本";

  const prompt = `
你是首经贸留学选校分析助手。请只基于用户背景、当前系统推荐结果、本地案例库进行分析。

硬性规则：
1. 不允许编造录取案例、学校数据、成功率或未提供的背景。
2. 如果案例库没有对应样本，必须明确写出“案例库暂无对应样本”。
3. 不要替换页面已有的冲刺校、匹配校、保底校，只能解释和建议。
4. 输出中文，结构清晰，适合本科生阅读。

请按以下结构输出：
- 当前背景优势
- 当前短板
- 冲刺校风险
- 匹配校建议
- 保底校建议
- 申请材料提升方向
- 时间规划

用户背景：
${JSON.stringify(profile, null, 2)}

当前系统推荐结果：
${JSON.stringify(compactRecommendations(recommendations), null, 2)}

本地案例库数据：
${JSON.stringify(caseContext, null, 2)}
`;

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是严格基于已给数据分析的留学选校顾问，不编造案例。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        stream: false
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: payload?.error?.message || "DeepSeek API 调用失败。"
      });
    }

    return res.status(200).json({
      analysis: payload?.choices?.[0]?.message?.content || "DeepSeek 暂未返回分析内容。"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "DeepSeek API 请求异常。";
    return res.status(500).json({ error: message });
  }
}
