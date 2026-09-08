# KiwiCart 优化与 AI 功能规划 — 2026-08-27 工作记录

## 一、项目当前问题总览

### 🔴 紧急修复（安全/可用性）

| 问题 | 位置 | 影响 |
|------|------|------|
| ESLint 配置引用不存在的包 | `package.json` 中 `"extends": "@devacademy/eslint-config-react"` | `npm run lint` 完全不能用。正确路径是 `@devacademy/eslint-config/react` |
| DELETE 接口缺 admin 权限 | `server/routes/products.ts:214` | 任意登录用户可删产品（Node 后端）。.NET 后端已有 `[Authorize(Roles = "admin")]` |
| CORS 未配置时默认允许所有来源 | `server/server.ts:14-19` | `CORS_ORIGIN` 未设时 fallback `true`，等于允许任何来源 |
| Feedback 接口泄露 user_id | `server/routes/feedback.ts` | GET 返回完整数据库记录包括 user_id |
| .env 文件未被 .gitignore 排除 | `.env.node`, `.env.dotnet`, `.env.local` 等 | 密钥可能被提交到仓库 |
| CSP 完全关闭 | `server/server.ts` helmet 配置 | XSS 防护缺失 |
| 数据库 SSL `rejectUnauthorized: false` | `knexfile.ts:39-53` | 生产环境中间人攻击风险 |

### 🟡 架构与性能

| 问题 | 说明 |
|------|------|
| 购物篮 N×3 外部 API 调用 | 10 个商品 = 30 次请求，无并发限制、超时、熔断 |
| 附近商店全表扫描 | 加载全部 store 到内存做 Haversine 计算 |
| 缓存写入非原子 | 先查再插/更新，有并发重复写入问题 |
| Token 缓存无 TTL | Foodstuffs token 只在 401 时刷新 |
| 缓存 stale 时阻塞响应 | 等外部 API 返回才响应，应 stale-while-revalidate |
| 前端 JS 首包 ~582KB | Vite 已发拆包警告，缺路由级 lazy loading |
| 三套后端并存（Node/.NET/Java） | 行为已不一致，维护成本高 |

### 🟢 代码质量与测试

| 问题 | 说明 |
|------|------|
| 测试覆盖薄 | 仅 19 个测试，权限/CORS/隐私/边界场景无覆盖 |
| 无输入校验 | 搜索词、radius、篮子数据缺 schema 验证（zod 已装未用） |
| 错误响应格式不统一 | 有时 string、有时 object，无全局错误中间件（Node） |
| 巨型组件 | `ProductComparison.tsx` 27KB，应拆分 |
| React Query 未使用 | 已安装但全用原生 fetch + useEffect |
| 依赖放错位置 | react/react-dom 在 devDeps 而非 deps |

---

## 二、修复方案（已确定优先级）

### 1. ESLint 配置修复
- **文件**: `package.json`
- **修改**: `"extends": "@devacademy/eslint-config-react"` → `"extends": "@devacademy/eslint-config/react"`
- **原因**: 包 `@devacademy/eslint-config` 里有 `react.js` 文件，正确的引用是 subpath
- **额外**: ignorePatterns 加上 `dist`、`server-java`、`server-dotnet`

### 2. DELETE 接口加 admin 权限（Node 后端）
- **文件**: `server/routes/products.ts`
- **修改**: 在 checkJwt 之后检查 Auth0 自定义 claim 中的 roles
```typescript
router.delete('/:id', checkJwt, async (req, res) => {
  const roles = req.auth?.payload['https://kiwicart.com/roles'] as string[] | undefined
  if (!roles || !roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden: admin role required' })
  }
  // ... rest of delete logic
})
```

### 3. CORS 修复
- **文件**: `server/server.ts`
- **修改**: fallback 从 `true` 改为 `false`（拒绝跨域）
```typescript
server.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN || false)
    : 'http://localhost:5173',
}))
```

### 4. Feedback 隐私修复
- **文件**: `server/routes/feedback.ts`
- **修改**: 只返回 `id`、`user_name`、`message`、`created_at`，不返回 `user_id`

### 5. .gitignore 修复
- **文件**: `.gitignore`
- **添加**:
```
.env*
!.env.example
!.env.java.example
```

---

## 三、AI 功能规划

### 功能方向
- Phase 1: 食材提取 + 自动比价（用户输入"做咖喱"→ 返回食材清单 + 各食材最低价）
- Phase 2: 个性化推荐（基于收藏历史的省钱建议）
- Phase 3: 对话式购物助手（多轮对话 + 流式响应 + 操作购物篮）

### Ticket 拆分

#### Phase 0: 基础设施准备（3 tickets, ~8h）
| # | Ticket | 估时 |
|---|--------|------|
| 0.1 | 统一错误处理中间件 | 2h |
| 0.2 | 输入校验中间件（Zod） | 3h |
| 0.3 | Gemini API 集成基础（SDK/封装/重试） | 3h |

#### Phase 1: 食材提取 + 自动比价（6 tickets, ~17h）
| # | Ticket | 估时 |
|---|--------|------|
| 1.1 | 后端：`POST /api/v1/ai/meal-plan` 端点骨架 | 2h |
| 1.2 | 后端：Gemini prompt 设计 - 食材提取 | 3h |
| 1.3 | 后端：食材列表 → 批量比价 | 3h |
| 1.4 | 后端：响应组装与缓存 | 2h |
| 1.5 | 前端：AI 推荐入口 UI | 3h |
| 1.6 | 前端：推荐结果展示 + 加购物篮 | 4h |

#### Phase 2: 个性化推荐（5 tickets, ~14h）
| # | Ticket | 估时 |
|---|--------|------|
| 2.1 | 用户购买/收藏历史聚合 | 3h |
| 2.2 | `GET /api/v1/ai/suggestions` 端点 | 3h |
| 2.3 | 价格变动检测 | 3h |
| 2.4 | 前端：个性化推荐卡片 | 3h |
| 2.5 | My Kitchen 页面集成 | 2h |

#### Phase 3: 对话式购物助手（7 tickets, ~26h）
| # | Ticket | 估时 |
|---|--------|------|
| 3.1 | 对话上下文管理 | 4h |
| 3.2 | SSE 流式响应端点 | 3h |
| 3.3 | Function calling 设计 | 4h |
| 3.4 | 对话安全防护 | 3h |
| 3.5 | 前端：Chat UI 组件 | 5h |
| 3.6 | 前端：AI 操作确认交互 | 3h |
| 3.7 | 集成测试 + E2E | 4h |

**总计：21 个 tickets，约 65 小时**

---

## 四、在 .NET 后端实现 AI 功能的注意事项

### 架构适配

遵循现有三层分离（Core / Infrastructure / Api）：

```
KiwiCart.Core/Interfaces/IAiService.cs          # 接口
KiwiCart.Core/DTOs/MealPlanRequest.cs            # DTO
KiwiCart.Infrastructure/Services/GeminiClient.cs # 实现
KiwiCart.Api/Controllers/AiController.cs         # 端点
```

### SDK 选择

| 方案 | 说明 |
|------|------|
| 直接用 HttpClient 调 REST API（推荐） | 跟现有 StoreClient 模式一致，完全可控 |
| `Mscc.GenerativeAI` 社区包 | 简单但非官方维护 |
| `Google.Cloud.AIPlatform.V1` | 官方但需 GCP 项目配置 |

### 关键配置

```csharp
// Program.cs - HttpClient 注册
builder.Services.AddHttpClient("Gemini", c =>
{
    c.BaseAddress = new Uri("https://generativelanguage.googleapis.com/");
    c.Timeout = TimeSpan.FromSeconds(30);
})
.AddPolicyHandler(retryPolicy)
.AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(25)));

// Rate Limiting - AI 独立策略
options.AddFixedWindowLimiter("ai", opt =>
{
    opt.Window = TimeSpan.FromMinutes(1);
    opt.PermitLimit = 5;
    opt.QueueLimit = 0;
});
```

```json
// appsettings.json
{
  "Gemini": {
    "ApiKey": "",
    "Model": "gemini-1.5-flash",
    "MaxOutputTokens": 1024,
    "Temperature": 0.3
  }
}
```

### 与现有服务集成模式

```csharp
public class MealPlanService : IMealPlanService
{
    private readonly IGeminiClient _gemini;
    private readonly IPriceComparisonService _priceComparison; // 复用已有服务

    public async Task<MealPlanResponse> PlanAsync(string userInput, CancellationToken ct)
    {
        // Step 1: AI 提取食材
        var ingredients = await _gemini.ExtractIngredientsAsync(userInput, ct);
        
        // Step 2: 复用现有比价逻辑（缓存、熔断、降级全部自动生效）
        var priceResults = new List<IngredientPrice>();
        foreach (var ingredient in ingredients)
        {
            var prices = await _priceComparison.CompareAsync(ingredient.Name, ct);
            priceResults.Add(new IngredientPrice(ingredient, prices.FirstOrDefault()));
        }
        
        return new MealPlanResponse(ingredients, priceResults);
    }
}
```

### .NET 后端优势（相比 Node）

| 方面 | Node 后端 | .NET 后端 |
|------|-----------|-----------|
| 错误处理 | 各路由独立 try/catch | ✅ GlobalExceptionHandler + ProblemDetails |
| 限流 | 全局一个策略 | ✅ 可按端点配置不同策略 |
| 超时/熔断 | 无 | ✅ Polly 已就位 |
| 认证/权限 | checkJwt 无 admin | ✅ `[Authorize(Roles = "admin")]` |
| API 文档 | 无 | ✅ Swagger |
| 日志 | console.log | ✅ Serilog 结构化日志 |

### 注意事项

1. **Gemini API 区域延迟**：部署在 Azure NZ/AU 时确认端点延迟
2. **Token 计费可见性**：日志中记录每次 AI 调用的 token 用量
3. **API 路径一致**：确保 `/api/v1/ai/meal-plan` 路径前后端统一
4. **不把价格传给 AI**：AI 只做意图解析，真实价格从自己的服务获取
5. **API Key 管理**：生产用 Azure Key Vault，本地用 `dotnet user-secrets`
6. **独立熔断策略**：AI 的 Polly 策略不要和超市 API 共用
7. **CancellationToken 传递**：用户关页面时取消 AI 请求，节省 API 额度

---

## 五、当前验证状态

- `npm test -- --run`：✅ 通过（19 个测试）
- `npm run build`：✅ 通过（有首包过大警告）
- `tsc --noEmit`：✅ 通过
- `npm run lint`：❌ 失败（ESLint 配置包路径错误）

## 六、建议实施顺序

1. 先修 lint、权限、CORS、env 文件（安全基线）
2. 统一后端接口契约
3. 实现 AI Phase 0 基础设施
4. 实现 AI Phase 1 核心功能
5. 处理缓存、数据库查询优化和前端拆包
