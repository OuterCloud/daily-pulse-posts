---
title: "DailyPulse · 调研 | 如何通过1个api key调用所有国内国外的大模型（修订版）"
date: 2026-05-09 09:00:00 +0800
categories:
  - Research
tags:
  - research
  - zh
---

## 1. 概述

通过统一 API Key 调用多个大模型的核心需求是**模型抽象层（Model Abstraction Layer）**的实现，用户无需管理多个平台凭证即可灵活切换 GPT-4、Claude、Gemini、国内的文心、讯飞等服务。这一需求源于企业级应用需要多模型容错、成本优化和功能互补，而当前各大模型 API 体系分散、认证机制差异大。目前市场处于**探索成熟期**，已有多个开源和商业方案涌现，但完全统一的标准尚未形成。

## 2. 核心技术解析

### **2.1 路由聚合模式（Router Aggregation）**
在应用层建立中间代理服务，统一接收请求后根据配置规则动态路由到不同模型 API。用户仅需保存单个代理 Key，所有下游平台凭证由代理层管理。

### **2.2 API 适配层（Adapter Pattern）**
每个模型 API 的请求/响应格式存在差异（如 OpenAI 的 `messages` 格式 vs Claude 的 `system` 角色区分），适配层负责格式转换和参数映射，实现接口统一化。

### **2.3 Token 管理机制**
- **成本追踪**：按模型维度计算 tokens，支持动态定价
- **限流策略**：单一 Key 背后可配置多个下游 Key 的速率限制
- **Fallback 容错**：模型调用失败时自动切换备选模型

### **2.4 认证透传**
采用 Bearer Token + 加密存储的方式，代理层持有各平台的真实凭证（加密保存），对用户端隐藏敏感信息。

---

## 3. 市场格局

| 方案名称 | 类型 | 支持模型数量 | 特点 | 开源状态 |
|---------|------|-----------|------|---------|
| **LiteLLM** | 开源库 | 100+ | 轻量级 SDK，Python 原生，支持本地部署 | ✅ Apache 2.0 |
| **LangChain** | 开源框架 | 50+ | 集成 LLM Chain 和 Memory，生态丰富 | ✅ MIT |
| **Ollama** | 本地推理 | 20+ | 离线运行开源模型，零成本推理 | ✅ MIT |
| **One API** | 商业 SaaS | 30+ | 国内主流，支持文心/讯飞/通义，UI 友好 | ❌ 商业 |
| **API2D** | 商业 SaaS | 20+ | 国内代理，支持 GPT-4 Turbo，低延迟 | ❌ 商业 |
| **FastGPT** | 开源应用 | 15+ | 知识库 + 多模型切换，企业级配置 | ✅ Apache 2.0 |
| **Dify** | 开源平台 | 25+ | 可视化工作流，内置模型管理 | ✅ Apache 2.0 |
| **vLLM** | 开源推理引擎 | 本地部署 | 高吞吐量推理，GPU 优化 | ✅ Apache 2.0 |

---

## 4. API Key 申请指南

### **4.1 国际模型平台**

#### **4.1.1 OpenAI (GPT-4、GPT-4o、GPT-3.5-turbo)**

**申请流程：**
1. 访问 [https://platform.openai.com](https://platform.openai.com)
2. 使用邮箱或 Google/Microsoft 账号注册
3. 进入 API Keys 页面 → "Create new secret key"
4. 复制密钥并安全保存（仅显示一次）

**前置要求：**
- 需绑定有效的国际支付方式（信用卡、PayPal）
- 国内用户需通过国际代理或海外支付服务
- 初始赠送 $5 测试额度，过期后需充值

**访问方式：**
- 直接访问：需科学上网或使用国内代理（如 API2D）
- 推荐额度：建议设置每月使用限额避免意外扣费

**关键配置参数：**
```
API_KEY: sk-proj-xxxxx (以 sk-proj- 开头)
BASE_URL: https://api.openai.com/v1
```

---

#### **4.1.2 Anthropic (Claude 2、Claude 3 系列)**

**申请流程：**
1. 访问 [https://console.anthropic.com](https://console.anthropic.com)
2. 使用邮箱注册或登录
3. 进入 API Keys 页面 → "Create Key"
4. 设置 Key 名称和权限范围
5. 复制密钥到安全位置

**前置要求：**
- 需验证邮箱
- 同样需要国际支付方式（信用卡）
- 初始额度通常为 $5（测试环境）或需自主充值

**访问方式：**
- 官方 API 需科学上网
- 支持通过国内代理服务（API2D、One API 等）间接调用
- 响应速度相比 OpenAI 略慢

**关键配置参数：**
```
API_KEY: sk-ant-xxxxx (以 sk-ant- 开头)
BASE_URL: https://api.anthropic.com
MODEL: claude-3-opus-20240229 等
```

---

#### **4.1.3 Google (Gemini Pro、Gemini Ultra)**

**申请流程：**
1. 访问 [https://ai.google.dev](https://ai.google.dev)
2. 点击 "Get API Key" → "Create API Key in Google Cloud Console"
3. 选择现有项目或新建项目
4. 自动生成 API Key（无需支付方式）
5. 启用 Generative Language API

**前置要求：**
- 需 Google 账号
- 需激活 Google Cloud 项目
- 免费配额为 60 次/分钟，超过需付费

**访问方式：**
- 官方 API 全球可访问
- 国内访问延迟相对较低
- 无需代理，直连稳定

**关键配置参数：**
```
API_KEY: AIzaSy-xxxxx (以 AIzaSy- 开头)
BASE_URL: https://generativelanguage.googleapis.com
MODEL: gemini-pro 或 gemini-1.5-pro
```

---

#### **4.1.4 Cohere (Command、Embed)**

**申请流程：**
1. 访问 [https://dashboard.cohere.com](https://dashboard.cohere.com)
2. 使用邮箱或 Google 账号注册
3. 进入 API Keys 页面 → "Generate new key"
4. 选择权限级别（推荐 Trial）
5. 复制并保存密钥

**前置要求：**
- 邮箱验证
- 免费额度为每月 100k tokens
- 若需更多额度需绑定支付方式

**访问方式：**
- 全球直连，无需代理
- 官方文档完善

**关键配置参数：**
```
API_KEY: xxxxx (格式灵活)
BASE_URL: https://api.cohere.ai/v1
MODEL: command-light 或 command
```

---

### **4.2 国内模型平台**

#### **4.2.1 百度文心 (ERNIE Bot、ERNIE 4.0)**

**申请流程：**
1. 访问 [https://console.bce.baidu.com/qianfan/ais/console/onlineServing](https://console.bce.baidu.com/qianfan/ais/console/onlineServing)
2. 使用百度账号登录（无账号则注册）
3. 进入"应用管理" → "创建应用"
4. 填写应用名称、描述，选择模型
5. 获取 Client ID 和 Client Secret
6. 获取 API Key（可通过 Client ID 和 Secret 换取）

**前置要求：**
- 实名认证（个人或企业）
- 新用户赠送免费额度（通常 50 万 tokens）
- 超额需充值

**访问方式：**
- 国内直连，延迟最低
- 支持通过 One API 等代理聚合
- 需使用特殊鉴权流程（OAuth 2.0）

**关键配置参数：**
```
CLIENT_ID: xxxxx
CLIENT_SECRET: xxxxx
API_KEY: 通过上述两者换取
BASE_URL: https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinyiyan
MODEL: ernie-3.5-8k-0205 或 ernie-4.0-8k-latest
```

---

#### **4.2.2 讯飞星火 (Spark)**

**申请流程：**
1. 访问 [https://console.xfyun.cn](https://console.xfyun.cn)
2. 使用邮箱或手机号注册讯飞账号
3. 进行企业实名认证（必需）
4. 进入"我的应用" → "创建应用"
5. 选择"讯飞星火认知大模型"
6. 获取 APP ID、API Key、API Secret

**前置要求：**
- 必须企业实名认证（个人用户通常不支持）
- 新应用有免费试用额度（通常 10-50 万 tokens）
- 超额使用需购买套餐

**访问方式：**
- 国内优化，延迟低
- 需使用 WebSocket 或 HTTP 接口
- 集成度较低，需定制适配

**关键配置参数：**
```
APP_ID: xxxxx
API_KEY: xxxxx
API_SECRET: xxxxx
BASE_URL: wss://spark-api.xf-yun.com/v3.5/chat (WebSocket)
MODEL: generalv3.5 或 generalv4
```

---

#### **4.2.3 阿里通义千问 (Qwen)**

**申请流程：**
1. 访问 [https://dashscope.console.aliyun.com](https://dashscope.console.aliyun.com)
2. 使用阿里云账号登录（或新建账号）
3. 进入"API-KEY 管理"页面
4. 点击"创建新的 API-KEY"
5. 设置 Key 名称和描述
6. 复制并保存 API Key

**前置要求：**
- 阿里云账号（推荐企业认证但个人也可）
- 初始赠送免费额度（通常 100 万 tokens）
- 超额按量付费

**访问方式：**
- 国内直连，支持 HTTP 和 WebSocket
- 推荐通过 SDK（Python、Java 等）调用
- 集成 One API 等代理方案支持度高

**关键配置参数：**
```
API_KEY: sk-xxxxx (以 sk- 开头)
BASE_URL: https://dashscope.aliyuncs.com/api/v1
MODEL: qwen-plus 或 qwen-max
```

---

#### **4.2.4 字节豆包 (ByteDance)**

**申请流程：**
1. 访问 [https://console.volcengine.com/ark/region:ark_cn_beijing](https://console.volcengine.com/ark/region:ark_cn_beijing)
2. 使用字节火山引擎账号登录（需注册）
3. 进入"API 密钥管理"
4. 创建新密钥，获取 Access Key 和 Secret Key
5. 在模型服务中创建端点（Endpoint）并关联模型

**前置要求：**
- 火山引擎账号
- 企业认证（推荐）
- 新用户有免费额度

**访问方式：**
- 国内优化
- 需使用特定 SDK 调用
- 代理支持相对较少

**关键配置参数：**
```
ACCESS_KEY: xxxxx
SECRET_KEY: xxxxx
ENDPOINT: epts-xxxxx
BASE_URL: https://ark.cn-beijing.volces.com/api/v3
MODEL: (需按 Endpoint 配置)
```

---

### **4.3 国内代理聚合平台**

#### **4.3.1 One API**

**申请流程：**
1. 访问 [https://www.openai-sb.com](https://www.openai-sb.com) 或 [https://one-api.com](https://one-api.com)
2. 注册账号（邮箱或手机）
3. 完成邮箱验证
4. 进入"渠道管理" → "新建渠道"
5. 选择下游模型（OpenAI、Claude、文心、讯飞等）
6. 输入对应平台的 API Key
7. 系统自动生成统一的 One API Key

**前置要求：**
- 邮箱或手机号
- 不需要国际支付（人民币结算）
- 首次充值通常有优惠

**One API Key 获取：**
- 后台"令牌管理" → "新建令牌"
- 设置 Key 额度和过期时间
- 复制生成的 Key（格式：sk-xxxxx）

**访问方式：**
```
BASE_URL: https://api.openai-sb.com/v1 或 https://api.one-api.com/v1
API_KEY: (从 One API 生成)
MODEL: 支持透传原始模型名（如 gpt-4、claude-3-opus 等）
```

**配置示例：**
```json
{
  "provider": "One API",
  "base_url": "https://api.openai-sb.com/v1",
  "api_key": "sk-xxxxxxxxxxxx",
  "models": [
    "gpt-4-turbo",
    "claude-3-opus-20240229",
    "ernie-3.5-8k-0205",
    "generalv3.5"
  ]
}
```

---

#### **4.3.2 API2D**

**申请流程：**
1. 访问 [https://api2d.com](https://api2d.com)
2. 使用邮箱注册账号
3. 完成邮箱验证和实名认证
4. 在"用户中心" → "API 密钥"生成密钥
5. 系统自动分配一个 API Key
6. 支持通过上传原始 OpenAI Key 来代理（可选）

**前置要求：**
- 邮箱注册
- 可选的实名认证（提升额度）
- 人民币充值

**API2D Key 类型：**
- **直接代理 Key**：API2D 生成的统一 Key（格式 fk-xxxxx）
- **转代理 Key**：用户提交的 OpenAI Key，API2D 代理转发

**访问方式：**
```
BASE_URL: https://openai.api2d.net/v1
API_KEY: fk-xxxxxxxxxx (直接代理) 或上传的原始 key
MODEL: 支持所有 OpenAI 模型和其他代理模型
```

---

#### **4.3.3 FastGPT 自部署方案**

**申请流程（自部署）：**
1. 下载 FastGPT 源码：[https://github.com/labring/FastGPT](https://github.com/labring/FastGPT)
2. 使用 Docker 或 Kubernetes 部署
3. 启动后访问 Web 界面
4. 在"系统设置" → "模型管理"添加下游 API Key
5. 创建"应用密钥"作为统一 Key 暴露给用户

**前置要求：**
- 有服务器或本地部署条件（Docker）
- 基础的运维知识
- 可选：云厂商 SaaS 托管服务

**FastGPT Key 管理：**
- 在 Web UI 中配置各大模型 API Key
- 生成应用级别的访问令牌
- 支持权限隔离和成本分配

---

#### **4.3.4 Dify 自部署方案**

**申请流程（自部署）：**
1. 访问 [https://github.com/langgenius/dify](https://github.com/langgenius/dify)
2. 使用 Docker Compose 快速部署
3. 访问 Web 界面（默认 localhost:3000）
4. 注册管理员账号
5. 进入"工作区设置" → "模型供应商"
6. 添加各平台 API Key（OpenAI、Claude、国内模型等）
7. 在"API 访问"中生成应用级别的 Key

**前置要求：**
- 有部署条件（Docker 或云服务器）
- 对界面操作有基本了解

**Dify Key 获取：**
```
在应用设置中生成 API Key → 暴露给调用端
支持 REST API 和 WebSocket 双向通信
```

---

### **4.4 LiteLLM 自部署方案**

**API Key 管理流程：**

1. **安装 LiteLLM**
```bash
pip install litellm
```

2. **配置各平台 Key（环境变量或配置文件）**
```bash
export OPENAI_API_KEY="sk-xxxxx"
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
export GOOGLE_API_KEY="AIzaSy-xxxxx"
export BAIDU_API_KEY="xxxxx"
export ALI_API_KEY="sk-xxxxx"
```

3. **启动 LiteLLM Proxy Server**
```bash
litellm --model gpt-4 --model claude-3-opus
```

4. **获取代理 Key（自签名令牌）**
```
默认代理 Key: temp-token-xxxx
或通过 --param_file 指定自定义 Key 映射表
```

**关键配置参数：**
```python
from litellm import completion
import litellm

litellm.api_base = "http://localhost:8000"
litellm.api_key = "temp-token-xxxx"

# 自动路由到对应模型的真实 API
response = completion(
    model="claude-3-opus",  # 自动从环境变量取对应 Key
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## 5. 典型应用场景

### **5.1 多模型容错系统**
关键业务需要最高可用性时，主模型出错自动 Fallback 到备选模型（如 GPT-4 → Claude 3），保证服务不中断。通过 One API 等方案可配置模型优先级和自动切换策略，无需改动应用代码。

### **5.2 成本优化引擎**
根据请求复杂度动态选择模型，简单任务用开源小模型/国内便宜模型，复杂任务才调用 GPT-4。单个 API Key 实现智能路由可节省 30-50% 成本，通过单一代理 Key 暴露降低密钥管理复杂度。

### **5.3 跨地域低延迟服务**
国内业务访问国外 API 延迟高，通过本地代理 + 国内模型（文心一言、通义千问）的混合方案，单一 Key 简化接入流程。国内用户直连文心/讯飞，国外用户透传 GPT-4/Claude，同一个应用 Key 自动路由。

### **5.4 AI 应用多模型评测**
开发者用同一套接口对比不同模型效果，LiteLLM + Prompt 自动化测试平台可快速部署 A/B 对标。通过单一 API Key 交替调用不同模型，减少集成成本。

### **5.5 企业内部 LLMOps 平台**
建立统一的模型管理后台，非技术人员可通过 UI 配置多模型策略、成本预算、访问权限。FastGPT 和 Dify 提供开箱即用的方案，将各平台 API Key 统一汇聚，对外暴露单一企业级 Key。

---

## 6. 优势与局限

### **✅ 优势**

- **运维简化**：一份凭证管理多个平台，降低密钥泄露风险和管理成本
- **成本优化**：灵活的模型选择和 Fallback 机制可降低 LLM 成本 30-50%
- **业务连续性**：单点故障不中断服务，模型不可用时自动切换
- **快速迭代**：应用层解耦，更换或新增模型无需改代码
- **生态兼容**：已有成熟方案和社区，学习成本相对较低
- **集中授权管理**：统一 Key 支持权限控制、访问审计、成本分配

### **⚠️ 局限**

- **延迟增加**：代理层引入网络往返，响应延迟增加 50-200ms
- **功能割裂**：各模型高级特性（如 Vision、Function Calling）映射复杂，无法 100% 兼容
- **成本不透明**：多层代理可能导致用户端对实际消耗的理解偏差
- **安全风险**：代理层持有所有下游凭证，成为蜜罐目标，需强加密和审计
- **模型差异**：不同模型的输出质量和稳定性差异大，统一接口掩盖了这些细节
- **Key 更新维护**：下游 Key 失效或过期需及时更新，多平台管理负担仍存

---

## 7. 最佳实践：多代理 Key 部署架构

为了充分利用多个代理方案的优势，建议采用**分层多代理架构**：

### **7.1 架构设计**

```
用户应用层
    ↓
统一接口 API (暴露单一 Key: user-key-xxx)
    ↓
本地适配层 (LiteLLM 或自研)
    ├─ 一级代理 (One API / FastGPT) ← 成本敏感任务
    ├─ 二级代理 (API2D) ← 需要 GPT-4 高延迟任务
    ├─ 原生 API (OpenAI / Claude) ← 关键业务直连
    └─ 本地推理 (Ollama) ← 离线备选
    ↓
下游真实 API Key (加密存储)
```

### **7.2 配置示例**

```yaml
# 统一代理配置文件
proxy_key: "user-key-xxx"

models:
  - name: "fast-llm"
    type: "cost-optimized"
    backends:
      - provider: "ollama"
        model: "mistral:7b"
        priority: 1
      - provider: "one-api"
        api_key: "${ONE_API_KEY}"
        model: "ernie-3.5-8k"
        priority: 2
      - provider: "one-api"
        api_key: "${ONE_API_KEY}"
        model: "gpt-3.5-turbo"
        priority: 3
  
  - name: "smart-llm"
    type: "balanced"
    backends:
      - provider: "api2d"
        api_key: "${API2D_KEY}"
        model: "gpt-4-turbo"
        priority: 1
      - provider: "one-api"
        api_key: "${ONE_API_KEY}"
        model: "claude-3-opus"
        priority: 2
      - provider: "openai"
        api_key: "${OPENAI_API_KEY}"
        model: "gpt-4-turbo"
        priority: 3
  
  - name: "premium-llm"
    type: "quality-first"
    backends:
      - provider: "openai"
        api_key: "${OPENAI_API_KEY}"
        model: "gpt-4-turbo"
        priority: 1
      - provider: "anthropic"
        api_key: "${ANTHROPIC_API_KEY}"
        model: "claude-3-opus"
        priority: 2
```

---

## 8. 趋势与建议

### **🔮 发展趋势**

1. **OpenAI API 标准化推进**：OpenAI 发布的 API 规范逐步成为业界事实标准，国内模型厂商加速适配
2. **MCP（Model Context Protocol）生态**：Anthropic 推出的标准协议有望在 2025 年成为多模型聚合的通用层
3. **本地推理 + 云服务混合**：Ollama、vLLM 等本地推理引擎与云 API 结合，形成"边缘计算 + 云中心"架构
4. **可观测性（Observability）加强**：监控、日志、成本分析从附加功能演进为必配能力
5. **企业级 SaaS 产品化**：One API 等国内方案快速迭代，向 AI PaaS 层演进
6. **Key 生命周期管理自动化**：自动轮换、过期告警、权限隔离成为标配

### **💡 实践建议**

**对于初创企业（<100 QPS）**
- 优先选择 **One API** SaaS 托管，快速上线，无需自部署运维
- 配置流程：
  1. 在 One API 后台添加 OpenAI/Claude/文心 API Key
  2. 生成一个统一的 One API Key
  3. 应用直接使用这个 Key 调用（BASE_URL 改为 One API 的地址）
- 配置简单的成本 + 延迟加权路由策略，重点关注 GPT-4 和文心的性价比

**对于中等规模应用（100-1000 QPS）**
- 部署 **FastGPT** 或 **Dify** 搭建内部 LLMOps 平台，支持 PM/运营自助配置
- 部署步骤：
  1. 购买云服务器或本地部署 Docker 容器
  2. 在 Web UI 中批量添加各平台 API Key
  3. 配置模型优先级和容错规则
  4. 生成应用级别的访问 Token 暴露给业务
- 结合本地 **Ollama** 运行轻量模型（如 Mistral），降低高峰期成本
- 实现完整的成本、延迟、准确度三维监控面板

**对于大型企业（1000+ QPS）**
- 考虑基于 **vLLM** 自建私有推理集群，部署开源模型和微调模型
- 实现步骤：
  1. 采购 GPU 服务器或云 GPU（如 AWS/阿里云）
  2. 部署 vLLM 推理引擎和模型
  3. 自研适配层聚合公有云 API 和私有集群
  4. 对外暴露单一企业级 Key（建议使用 Vault/KMS 管理）
- 通过自研代理层集成公有云 API，而非依赖第三方方案（避免被绑架）
- 在合规和安全框架下，建立模型多样性采购策略（不过度依赖单一厂商）

**通用建议**
- 始终保留 Fallback 链条，至少 2 个下游模型以确保可用性
- 加密存储所有 API Key，使用 Vault/KMS 等企业级密钥管理服务
  - 推荐工具：HashiCorp Vault、AWS Secrets Manager、阿里云密钥管理服务
- 定期进行成本和质量审计，识别"被遗忘的 Key"和冗余调用
- 关注 MCP 等新协议标准，为未来迁移预留架构灵活性
- **Key 更新策略**：
  - 设置 API Key 过期时间（30-90 天自动轮换）
  - 监控 Key 失效情况，自动告警和降级
  - 建立 Key 备份机制，防止单点故障

---

## 9. 故障排查与常见问题

### **9.1 常见错误及解决方案**

| 错误信息 | 常见原因 | 解决方案 |
|---------|--------|---------|
| `401 Unauthorized` | API Key 失效或格式错误 | 重新生成 Key；检查前缀是否匹配（sk-、fk-、AIzaSy- 等） |
| `403 Forbidden` | 账户余额不足或地域限制 | 充值余额；检查 IP 白名单；切换代理 |
| `429 Too Many Requests` | 超过速率限制 | 降低 QPS；使用不同的 Key；配置 Fallback 模型 |
| `503 Service Unavailable` | 下游 API 故障 | 自动切换 Fallback 模型；等待恢复 |
| `Timeout` | 网络延迟过高 | 切换到国内代理或本地模型；增加超时时间 |

### **9.2 Key 有效性检测脚本**

```python
import requests
import sys

def check_api_key(provider, api_key, base_url=None):
    """快速检测 API Key 是否有效"""
    
    checks = {
        "openai": {
            "url": "https://api.openai.com/v1/models",
            "headers": {"Authorization": f"Bearer {api_key}"}
        },
        "anthropic": {
            "url": "https://api.anthropic.com/v1/messages",
            "headers": {"x-api-key": api_key, "anthropic-version": "2023-06-01"}
        },
        "google": {
            "url": f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}",
        },
        "aliyun": {
            "url": "https://dashscope.aliyuncs.com/api/v1/models",
            "headers": {"Authorization": f"Bearer {api_key}"}
        },
        "one-api": {
            "url": f"{base_url or 'https://api.openai-sb.com'}/v1/models",
            "headers": {"Authorization": f"Bearer {api_key}"}
        }
    }
    
    if provider not in checks:
        print(f"❌ 不支持的提供商: {provider}")
        return False
    
    config = checks[provider]
    try:
        resp = requests.get(config["url"], headers=config.get("headers", {}), timeout=5)
        if resp.status_code == 200:
            print(f"✅ {provider} Key 有效")
            return True
        else:
            print(f"❌ {provider} Key 无效，状态码: {resp.status_code}")
            return False
    except Exception as e:
        print(f"❌ {provider} 检测失败: {str(e)}")
        return False

# 使用示例
check_api_key("openai", "sk-xxxxx")
check_api_key("one-api", "sk-xxxxx", base_url="https://api.openai-sb.com")
```

---

> **📝 说明**
> - 本报告数据截至 2024 年 12 月，部分产品迭代速度快，建议查阅最新版本文档
> - One API、API2D 等商业方案的具体功能对标信息来自公开宣传，未经第三方审证
> - 国内模型（文心 3.5、讯飞星火、通义千问）的 API 兼容性和价格需按官方最新公告为准
> - API Key 申请过程因平台政策变化可能有所不同，建议以官方文档为准
> - 请妥善保管 API Key，不要在代码仓库、日志中直接暴露，建议使用环境变量或密钥管理服务