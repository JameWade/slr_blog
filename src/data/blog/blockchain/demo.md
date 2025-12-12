---
author: zkslr
pubDatetime: 2025-11-05T10:00:00.000+08:00
title: Value Flows in the MEV Ecosystem(MEV生态的价值流动)
featured: false
draft: false
tags:
  - blockchain
description: 区块链分类的示例文章，用于测试分类与导航。
---

本文假定读者对 MEV 有一定的了解。有关矿工可提取价值 (MEV) 以及搜索者和区块生产者之间的市场结构的入门知识，请参阅“[MEV 代币化](https://multicoin.capital/2021/09/08/tokenizing-mev/)”部分。

矿工可提取价值（MEV）是无需许可的分布式系统的基础，无法消除。

MEV 的市场结构是动态且复杂的，但在工作量证明 (PoW) 网络（例如以太坊 1.0）中从中获利的参与者一直都是矿工和搜索者。

MEV（最大有效价值）历来是这两种实体之间平衡的体现。对于任何给定的机会，搜索者需要对一系列交易进行技术优化，并评估与选择在众多竞争者中选择其尝试的矿工分享潜在利润比例的博弈论。需要注意的是，支付给矿工的利润和搜索者提取的利润都被归类为MEV。

然而，在权益证明（PoS）系统中，MEV的市场结构截然不同，主要有两个原因。首先，参与共识的权益池可以将搜索活动产生的利润重新分配给各个权益持有者的联盟。其次，矿工的角色自然而然地分为两个不同的角色：[验证者（或区块提议者）和区块创建者( validator (or block proposer) and block builder.)](https://ethresear.ch/t/proposer-block-builder-separation-friendly-fee-market-designs/9725)。

# 集成式 vs. 模块化 MEV 基础设施

在 PoS 网络中，MEV 涉及四类重要参与者：
1. 质押池（Stake pools）——质押池将来自个体质押者的 L1 代币汇集起来，并委托给参与出块的验证者（例如 [Lido](https://stake.lido.fi/)、[Jito](https://www.jito.network/zh/)、[Marinade](https://marinade.finance/)、[Coinbase ](https://www.coinbase.com/earn)质押池）。
2. Searchers —— 用于识别并尝试捕获链上利润机会的机器人或个人（例如 Solana 和 Ethereum 各类看板上的交易签名者）。
3. Block builders —— 负责对区块内的交易进行结构化和排序的实体（例如 [Jito Block Engine](https://www.jito.wtf/)、[Flashbots MEV-Boost](https://github.com/flashbots/mev-boost)）。
4. 验证者（区块提议者）——在共识中以其所持质押进行投票，并向网络中其他节点提议一个区块以供验证的验证者或全节点。[Staked](https://staked.us/)、[Figment](https://www.figment.io/)、[Chorus One](https://chorus.one/)、[Staking Facilities ](https://stakingfacilities.com/)等服务会运行区块提议者。

在这一群体生态系统中，最核心的权力杠杆点是质押池（更准确地说，是构成该集合的每一个个体质押者），因为最终赋予验证者出块权利的就是质押本身。
验证者需要质押才能最大化收益，而质押聚合市场本身是高度竞争的。

为了让质押池能够有效地聚合质押，它们必须向质押者提供具有竞争力的奖励率。
历史上，质押收益率由协议出块量决定，为固定值，而验证者主要在费用上竞争。
如今，链上活动量显著增加，质押池之间的差异化空间也随之扩大。
当前质押池可以通过以下几种主要方式进行竞争：
1. 通过出块获得的基础出块奖励
2. 费用（或免手续费）
3. 所分配的 MEV 提取份额

为了让质押池能够提供有竞争力的奖励率，质押池必须将质押委托给那些构建最具利润区块的验证者，并确保这些利润能够回馈给其质押者。
如果验证者在提取 MEV 时效率低下，或者选择将所提取的 MEV 独占，那么质押池就会迅速将其质押重新分配到其他地方。


Searchers 会持续在链上或在去中心化订单流市场（例如 [DFLow](https://dflow.net/)）中寻找机会。当 searchers 发现想要捕获的 MEV 机会时，他们会通过由 block builder 支持的中继来提交经过精心优化的交易。他们还会为验证者附带一笔小费（预期利润的一部分），以提高自己成功的概率。

在一个质押池拥有最大议价权的环境中，这些小费至少必须部分回流给质押池，以便质押池能够向质押者分发具有竞争力的奖励。

因此，质押池会实质性地要求验证者从最有效率的 block builders 获取区块，以最大化构成质押池的质押者的收益。
同时，block builders 也被激励去构建利润最高的区块，因为他们希望有更多验证者采用他们构建的区块，从而提高自身的成功率，并可能提升其在 MEV 收益中的分成比例。

在权益证明网络中，占据主导地位的质押池通常会提供流动性质押衍生品（LSD）（例如 Jito 的 jitoSOL、Lido 的 stETH、Coinbase 的 cbETH）。这些代币代表对原始质押资产的 1:1 索取权，并会自动累积所有质押奖励。
推出质押衍生品的动机在于同时提升 资本效率 和 质押分布的去中心化程度。


直到最近，这些生态参与者一直以模块化 MEV 基础设施提供者的形式协同运作。
然而，随着 MEV 可捕获空间的增长，我们预期 MEV 基础设施将出现整合趋势，以便在价值链的每一个环节上提升价值捕获能力。

![mev_1](/public/assets/value-flows-in-the-mev-ecosystem/mev_1.png)

Jito Labs 正在 Solana 上构建这一体系的首个完整实现。我们在 2021 年 8 月对其进行了投资，而今天 Jito 基金会上线了质押池，使其 MEV 基础设施成为首个将 block builder 与质押池集成在一起的系统。
他们还开源了自己的验证者客户端（Jito-Solana），以便验证者更容易参与到该系统中。

Jito Block Engine 支持链下区块空间拍卖，而 Jito 质押池及其流动性质押衍生品（JITO-SOL）共同构建了一个集成系统，从而提升整体效率，并因此提高质押者的收益。


![jito](/public/assets/value-flows-in-the-mev-ecosystem/jito.png)

# MEV 价值累积
在权益证明系统中，MEV 的市场结构显示价值将累积在两个层面：
第一层是通过质押池累积到质押者；
第二层是累积到负责促进 MEV 提取与再分配的基础设施提供者。

MEV 基础设施的各个组件整合得越紧密，整个系统的价值捕获效率就越高。

在[《Protocols Don’t Capture Value, DAOs Manage Risk》](https://multicoin.capital/2021/09/16/daos-manage-risk/)一文中，我们提出：状态性（statefulness）和风险管理是任何协议实现可持续价值的必要条件。
集成式 MEV 系统能够在 searcher、质押池、验证者和 block builder 之间的每一层中介关系中实现跨层级的风险管理。

对于质押者，系统通过提供高于市场水平的质押奖励率来管理其风险。
对于 searchers，则通过提供高成功率的交易确认来管理风险。
对于验证者，则通过质押委托所带来的更高的区块提议收入来管理风险。
对于 block builders，则通过更高的区块被采纳概率所带来的额外收益来管理风险。


集成式 MEV 系统能够改善价值链中所有参与者的环境。
它们的综合实力远强于系统中任何单一的模块化参与者，因此能够在规模化扩张时带来显著的回报。