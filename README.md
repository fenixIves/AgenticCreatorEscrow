# Agentic Creator Escrow

<div align="center">
  <img src="./Images/ACE1.png" width="50%" alt="EarnGift Hero" />
  <img src="./Images/ACE2.png" width="49%" alt="Strategy Selection" />
  <br/>
  <img src="./Images/ACE3.png" width="95%" alt="Deposit Flow" />
</div>

**Live Demo Website:** [https://agentic-creator-escrow.vercel.app/#overview](https://agentic-creator-escrow.vercel.app/#overview)  
**Video Walkthrough:** [Demo Video](https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1) <!-- Replace with actual link -->

> **ACE is an agent-native creator escrow for DAO and Web3 content operations.** A project gives a CAW-controlled Sponsor Agent a bounded campaign budget; Creator / Analyst Agents compete for the work; the Sponsor Agent can procure resources, verify delivery, and settle payouts through a pact-scoped wallet flow.

**ACE 是一个面向 DAO / Web3 内容运营场景的 Agent 原生任务托管产品。** 项目方把有限预算交给由 Cobo Agentic Wallet 控制的 Sponsor Agent；Creator / Analyst Agents 竞标执行任务；Sponsor Agent 可以在授权边界内采购资源、验收交付并完成结算。

---

## 1. Product Thesis / 产品定位

Most AI-agent demos stop at recommendations: the agent can write, rank, summarize, or suggest, but it cannot safely move money. Creator campaigns in Web3 are exactly where this gap hurts: briefs, proposals, resource purchases, delivery proofs, and payout operations are scattered across Discord, spreadsheets, bounty boards, and manual wallet transfers.

ACE turns that workflow into an **Agentic Commerce loop**:

```text
Fund campaign -> Agent proposals -> Select winner -> Buy resources -> Submit delivery -> Settle payout
```

在大多数 Agent Demo 里，AI 只能给建议，不能安全地执行资金动作。但 Web3 内容任务本身就需要资金流：预算托管、创作者报价、素材采购、交付证明、验收付款。ACE 把这些环节组合成一个完整的 **Agentic Commerce 闭环**：

```text
预算托管 -> Agent 竞标 -> 选择胜者 -> 资源采购 -> 提交交付物 -> 结算付款
```

The core idea is simple: **do not give an agent an unlimited hot wallet; give it a CAW pact that only allows the economic actions required by one campaign.**

核心思想很简单：**不要给 Agent 一个无限权限热钱包，而是给它一个 CAW pact，让它只能执行某个具体任务所需的资金动作。**

---

## 2. What We Built / 我们做了什么

ACE contains three working layers:

ACE 由三层组成：

1. **Product UI / 产品前端**  
   A judge-facing static web app with a fluid shader landing page and a six-stage campaign workbench.

   一个面向评委展示的静态 Web 应用，包含动态流体首页和六步任务操作台。

2. **JobEscrow smart contract / JobEscrow 合约**  
   A Sepolia-native escrow contract for funded creator jobs, proposal records, supplier payments, delivery hashes, and final payout splits.

   一个部署在 Sepolia 的任务托管合约，支持预算托管、方案记录、供应商付款、交付 hash 和最终分账。

3. **Local Agent Runner / 本地 Agent 执行器**  
   A local allowlisted runner that connects the browser workbench to `caw` CLI and `cast`. Sponsor money-moving steps go through Cobo Agentic Wallet; creator-side proposal and delivery records use test creator wallets.

   一个本地 allowlist 执行器，把浏览器操作台连接到 `caw` CLI 和 `cast`。Sponsor 资金动作通过 Cobo Agentic Wallet 执行；创作者提交 proposal / delivery 使用测试钱包。

---

## 3. Why CAW Is Critical / 为什么 CAW 是关键组件

CAW is not a decorative wallet in this project. It is the **fund execution and permission-control layer**.

CAW 在本项目中不是展示用钱包，而是 **资金执行与权限控制层**。

Sponsor actions that move or control funds are designed to go through CAW:

需要移动或控制资金的 Sponsor 动作会通过 CAW：

- `createJob`: escrow campaign budget into `JobEscrow`.
- `assignCreatorFromProposal`: record the selected creator and reserve payout.
- `paySupplier`: purchase resources from campaign budget.
- `acceptAndPay`: settle creator payout, platform fee, and sponsor refund.

CAW adds the safety properties that make the agent usable:

CAW 提供了让 Agent 可以真正管钱的安全边界：

- **Pact approval / Pact 授权**: the human owner approves the agent's allowed scope.
- **Target allowlist / 合约 allowlist**: calls are limited to the deployed `JobEscrow` contract.
- **Chain and action scope / 链与操作范围限制**: demo sponsor actions are constrained to Sepolia SETH and specific contract calls.
- **Transaction-count cap / 交易次数上限**: the demo pact can cap sponsor calls for one lifecycle.
- **Wallet isolation / 钱包隔离**: browser code never receives CAW credentials or private keys.
- **Auditability / 可审计性**: confirmed transactions are shown with Sepolia explorer links.

Without CAW, the same product would either need a dangerous hot private key or manual wallet clicks for every payment. With CAW, the agent can execute real economic actions inside a human-approved boundary.

如果没有 CAW，这个产品要么需要危险的热钱包私钥，要么每一步都回到人工钱包点击。有了 CAW，Agent 才能在人工授权的边界内执行真实经济活动。

---

## 4. Demo Scenario / Demo 场景

The demo uses a DAO growth campaign:

Demo 模拟一个 DAO 增长内容任务：

- **Project / 项目方**: NebulaDAO Growth Team.
- **Task / 任务**: create a 60-second Web3 protocol explainer package.
- **Budget / 预算**: `0.001 SETH`.
- **Creator Agents / 创作者 Agent**: two proposal candidates with different angles and payout asks.
- **Supplier / 供应商**: a chart-pack or research-resource provider.
- **Delivery / 交付物**: script, shot list, thumbnail copy, source notes, delivery URI, delivery hash.

The important point is that the campaign is not only a content workflow. It is a **money workflow**:

关键点是：它不只是内容流程，而是 **资金流程**：

```text
DAO funds budget
-> agents compete for paid work
-> Sponsor Agent selects a winner
-> Sponsor Agent pays supplier
-> Creator Agent submits verifiable delivery
-> Sponsor Agent settles payout and refund
```

---

## 5. Smart Contract Lifecycle / 合约生命周期

`JobEscrow` supports one funded job lifecycle:

`JobEscrow` 支持一个完整的任务资金生命周期：

1. **Create funded job / 创建并托管预算**  
   Sponsor creates a job with native SETH and records title + brief URI.

2. **Submit proposals / 提交方案**  
   Creator / Analyst Agents submit proposal URI, proposal hash, and requested payout.

3. **Assign creator / 选择创作者**  
   Sponsor selects a proposal and reserves creator payout + platform fee.

4. **Pay supplier / 支付供应商**  
   Sponsor pays for resources, while the contract prevents supplier spend from consuming reserved creator/platform funds.

5. **Submit delivery / 提交交付物**  
   Selected creator submits delivery URI and delivery hash.

6. **Accept and pay / 验收并结算**  
   Sponsor accepts delivery. Contract pays creator, pays platform fee, and refunds unused budget to sponsor.

7. **Reject / refund path / 驳回与退款路径**  
   Sponsor can reject delivery and refund remaining escrow.

Key contract file:

核心合约文件：

```text
packages/contracts/src/JobEscrow.sol
```

---

## 6. Architecture / 技术架构

```text
apps/web
  Static product UI:
  - WebGL fluid shader overview
  - Six-stage workbench
  - Sepolia transaction proof links

apps/agent-runner
  Local execution bridge:
  - Serves the frontend locally
  - Exposes allowlisted /api/runner endpoints
  - Calls caw CLI for sponsor money actions
  - Calls cast for creator proposal/delivery actions

packages/contracts
  Foundry contract project:
  - JobEscrow.sol
  - Tests

scripts
  Demo helpers:
  - caw-jobescrow-calldata.sh
  - caw-submit-jobescrow-pact.sh
```

```text
apps/web
  静态产品前端：
  - WebGL 流体动态首页
  - 六步 workbench
  - Sepolia 交易证明链接

apps/agent-runner
  本地执行桥：
  - 本地启动前端
  - 暴露 allowlisted /api/runner 接口
  - Sponsor 资金动作调用 caw CLI
  - Creator proposal / delivery 调用 cast

packages/contracts
  Foundry 合约项目：
  - JobEscrow.sol
  - 测试

scripts
  Demo 辅助脚本：
  - caw-jobescrow-calldata.sh
  - caw-submit-jobescrow-pact.sh
```

---

## 7. Live Demo Flow / 现场演示流程

The workbench has six product stages:

Workbench 有六个产品阶段：

1. **Campaign brief**: DAO defines task requirements and campaign budget.
2. **Agent competition**: Creator / Analyst Agents submit proposals.
3. **Review winner**: DAO reviews proposals; Sponsor Agent records winner through CAW.
4. **Buy resources**: Sponsor Agent pays a supplier under CAW policy.
5. **Delivery package**: Creator Agent submits URI and hash.
6. **Settlement**: Sponsor Agent accepts delivery and triggers payout split.

In the UI, confirmed transactions appear in the receipt panel with Sepolia Scan links. If the local runner is offline, the workbench still supports preview mode for the presentation path.

在 UI 中，已确认交易会出现在 receipt panel，并带有 Sepolia Scan 链接。如果本地 runner 没有启动，workbench 仍然可以用 preview mode 展示完整产品流程。

---

## 8. Running Locally / 本地运行

### Static product UI / 静态产品页

Open:

```text
apps/web/index.html
```

or use the local runner:

也可以通过本地 runner 打开：

```bash
node apps/agent-runner/server.js
```

Then visit:

```text
http://127.0.0.1:4180/#workbench
```

### Contract build and tests / 合约构建与测试

```bash
forge build
forge test -vv
```

### Vercel static deployment / Vercel 静态部署

This repo includes a minimal Vercel config:

本仓库已包含最小 Vercel 配置：

```text
package.json
vercel.json
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Vercel deployment is intended for the product overview and previewable workbench. Real CAW execution should remain local because it depends on CAW CLI pairing, `cast`, `.env`, and test private keys.

Vercel 版本适合展示产品首页和可预览的 workbench。真实 CAW 执行建议保留在本地，因为它依赖 CAW CLI 配对、`cast`、`.env` 和测试私钥。

---

## 9. Live CAW Setup / CAW 真实执行配置

Copy the environment template:

复制环境变量模板：

```bash
cp .env.example .env
```

Required values for a live Sepolia run:

Sepolia 真实运行需要：

- `SEPOLIA_RPC_URL`
- `DEPLOYER_PRIVATE_KEY`
- `JOB_ESCROW`
- `SRC`: paired CAW DEV wallet address.
- `PLATFORM`
- `CREATOR`
- `SUPPLIER`
- `PACT_ID`
- `CREATOR_A_PRIVATE_KEY`
- `CREATOR_B_PRIVATE_KEY`

Deploy `JobEscrow`:

部署 `JobEscrow`：

```bash
forge script script/DeployJobEscrow.s.sol:DeployJobEscrowScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --broadcast
```

Submit a new CAW pact:

提交新的 CAW pact：

```bash
scripts/caw-submit-jobescrow-pact.sh
```

Start the local runner:

启动本地执行器：

```bash
node apps/agent-runner/server.js
```

Open:

```text
http://127.0.0.1:4180/#workbench
```

For a full runbook, see:

完整操作文档见：

```text
docs/deploy-and-live-demo.md
docs/caw-jobescrow-demo.md
```

---

## 10. Judge Criteria Alignment / 评审标准对齐

### Scenario Fit / 场景贴合度

ACE clearly shows Agentic Commerce: agents are not only generating content. They participate in economic activity by competing for paid work, buying resources, recording delivery, and triggering settlement.

ACE 清楚体现 Agentic Commerce：Agent 不只是生成内容，还参与经济活动，包括竞标、资源采购、交付记录和结算。

### CAW Criticality / CAW 关键性

CAW is required for sponsor-side fund actions. It controls which wallet can call which contract, under what pact, and within what execution boundary.

CAW 是 Sponsor 侧资金动作的关键执行层，控制哪个钱包可以调用哪个合约、在什么 pact 下、以什么边界执行。

### Funding Flow Completeness / 资金流程完整度

The demo covers the complete path from task funding to final payout:

Demo 覆盖从任务资金托管到最终付款的完整路径：

```text
fund -> propose -> assign -> procure -> deliver -> settle
```

### Demonstrability / 可演示性

The product has a stable visual workbench, preview mode, local live runner, Sepolia transaction links, and a focused five-minute demo narrative.

产品具备稳定的可视化 workbench、preview mode、本地 live runner、Sepolia 交易链接，以及适合 5 分钟展示的 Demo 叙事。

---

## 11. MVP Boundaries / MVP 边界

This is intentionally scoped for a hackathon demo:

本项目刻意控制在黑客松 MVP 范围内：

- Native SETH is used instead of ERC20 settlement for demo reliability.
- AI scoring is represented in the product UI; accepted proposal records are written on-chain.
- Supplier service is represented by a controlled wallet and receipt URI.
- Full DAO voting, ERC20 payouts, multi-round dispute resolution, and production-grade identity are future extensions.
- Vercel deployment is static; live CAW execution runs locally for safety and credential isolation.

---

## 12. Important Files / 重要文件

```text
apps/web/index.html
apps/web/app.js
apps/web/styles.css
apps/agent-runner/server.js
packages/contracts/src/JobEscrow.sol
script/DeployJobEscrow.s.sol
scripts/caw-jobescrow-calldata.sh
scripts/caw-submit-jobescrow-pact.sh
docs/deploy-and-live-demo.md
docs/product-scope.md
docs/demo-flow.md
```

---

## 13. One-Sentence Summary / 一句话总结

**ACE lets a DAO give an AI agent a real but bounded campaign budget, so the agent can fund work, buy resources, verify delivery, and settle contributors through Cobo Agentic Wallet.**

**ACE 让 DAO 可以把真实但受限的任务预算交给 AI Agent，使其通过 Cobo Agentic Wallet 完成发包、采购、交付验证和付款结算。**
