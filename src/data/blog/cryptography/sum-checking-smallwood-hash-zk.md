---
pubDatetime: 2026-11-23T12:00:00.000+08:00
title: 给 SmallWood 装上 Sum-Check：18 KB 证明一次 Keccak 置换
featured: false
draft: false
tags:
  - cryptography
  - hash-based-zk
  - 论文研读
description: CryptoExperts 团队的 SmallWood+ 把 sum-check 协议嫁接到哈希零知识证明 SmallWood 上：证明一次 Keccak 置换只需 18 KB、100 次 63 KB，刷新了中小规模见证区间的证明尺寸纪录。
---

## TL;DR

哈希零知识证明的好处很硬：只依赖哈希函数，不要可信设置，天然抗量子。但它一直有个尴尬——证明尺寸在"中等规模"陈述上不够小。极小见证（比如签名）有 VOLE-in-the-Head，超大陈述有 STARK，中间区间（几十到几万个域元素，典型如哈希原像）最优的是 2026 年的 SmallWood。CryptoExperts 团队的新预印本 SmallWood+ 给 SmallWood 装上了 sum-check 协议：证明者不再承诺整个计算轨迹，只承诺电路的输入输出，中间的验证工作交给一段短的 sum-check 交互。结果是证明一次 Keccak 置换只要 18.1 KB、100 次 63.1 KB，此前最优方案分别是 29.4 KB 和 127 KB；Kyber512 的 LWE 解知识证明 12.1 KB，Dilithium2 是 13.2 KB。代价也写得很清楚：这只是尺寸纪录——论文只有一个 SageMath 概念验证实现，没有证明者与验证者时间的实测数据。

## 论文信息卡

- **标题**：Sum-Checking SmallWood: Smaller Hash-Based Zero-Knowledge Arguments
- **作者**：Thibauld Feneuil、Killian Provin、Matthieu Rivain（CryptoExperts，巴黎）
- **会议**：IACR Cryptology ePrint Archive 预印本，编号 2026/2880，2026 年 11 月（未发表于会议）
- **原文链接**：https://eprint.iacr.org/2026/2880

## 背景

要理解 SmallWood+ 在干什么，先看哈希零知识证明按见证规模划分的版图。论文开篇就把这张版图摊开：见证只有几十个域元素时，VOLE-in-the-Head（VOLEitH）这类 MPC-in-the-Head 方案最紧凑；见证大到几十万元素以上时，FRI 系的 STARK 占优，证明尺寸随规模对数增长，但常数太大，小陈述用不上；夹在中间的区间——几十到几万个元素，哈希原像、对称原语求值都在这里——最优的是 Merkle 树路线，代表是 Ligero，以及 2026 年把它推到极致的 SmallWood。

SmallWood 的核心是一套叫 DECS 的度强制承诺方案：把见证排成矩阵、插值成多项式后用 Merkle 树承诺，再揭示一条随机线性组合，让验证者检查次数不超过上限。和 Ligero 的 proximity test（只保证承诺的多项式"接近"低次多项式）不同，DECS 给出严格的次数上界保证，代价是多算几个线性组合，换来的是更少的 Merkle 叶节点打开，在 2^6 到 2^16 的见证规模区间上证明最短。但 SmallWood 有个结构性代价：它要承诺整个见证，证明尺寸跟着承诺的数据量走。

Sum-check 协议恰好能砍掉这部分代价。GKR、Spartan 这类协议的思路是：验证者不需要看到完整计算，只需要承诺计算的输入输出，再跑一段 sum-check 把"整个计算是对的"归约成"某个多项式在随机点的一次求值"。通信只随计算宽度的对数增长，承诺量也只剩一小部分。这条路此前已有先行者：Longfellow ZK 用 Ligero 承诺包裹 sum-check 协议，在手机上几百毫秒内证明了关于 ECDSA 签名的身份凭证陈述，证明几百 KB。SmallWood+ 的洞察是把 Longfellow 的范式嫁接到更紧凑的 SmallWood 承诺上，并把它一般化——双重获益。

## 方法拆解

全文的方法论骨架叫 CBIP（Commit, Blindly Interact, and Prove），分三步走。

第一步 Commit：证明者用一个零知识 commit-and-prove 系统承诺见证 $w$ 和一段随机"轨迹掩码" $t$。第二步 Blindly interact：双方跑 sum-check 协议，但证明者的每条消息 $m_i$ 改发 $m_i + t_i$，用掩码做一次一密遮住——验证者看不到任何明文，也就没法直接做检查。第三步 Prove：验证者做不了的检查，全部转化成对已承诺 $(w, t)$ 的约束，再由承诺系统以零知识方式证明。掩码是双射变换，不改变验证者的消息，因此这套变换保持原协议逐轮（round-by-round）的可靠性，误差不变。

三步之后，验证者手里剩下的残余检查，论文用一个新抽象统一刻画，叫 SVCS（Sum-Check Verification Constraint System）。一个 SVCS 实例只有两类约束：多线性求值约束，即见证的多线性扩展（MLE）在验证者选的随机点 $r$ 处的求值等于掩码的一个仿射组合——这是 sum-check 归约的终点；轨迹约束，即关于掩码 $t$ 的低次多项式等于零——这是验证者剩下的少量非线性检查。设计意图很明确：sum-check 机制承担陈述中全部非线性工作，承诺系统只被要求打开线性函数或多线性求值。论文还给了两个简化技术：多个求值 claim 先随机线性组合成一个再做一次 sum-check；多个乘法约束借鉴线性 PCP 的插值技巧换成线性约束。做完这两步，所有约束要么是 $(w, t)$ 的线性约束，要么是单个 $w$ 的多线性求值——正好对应下面两种承诺方案的能力。

基于 SVCS，论文给出两个通用编译器。Compiler 1（v1）只用一个零知识线性承诺方案（ZK-LCS）：因为多线性求值本身就是见证的线性函数，所有约束一把梭全交给 LCS，简单通用。Compiler 2（v2）让 LCS 只管轨迹掩码，另用一个多线性多项式承诺方案（ZK-MPCS）管见证：MPCS 是更弱的原语，实例化可以更紧凑，在见证远重于轨迹时理论上更划算。但它有个难点——MPCS 证明要把求值明文揭示给验证者，可能泄漏见证，解法是第 5 节工具箱里的 hiding MLE：先给见证垫随机掩码再取多线性扩展，使揭示的求值均匀随机、与见证无关。

两个承诺方案都建在 DECS 之上。SmallWood-LCS 用 Ligero 式的方法证明一批线性约束；SmallWood-MPCS 利用多线性求值的张量结构，把求值 claim 归约为单个行组合的正确性。Compiler 2 同时用两个承诺时，两个 DECS 实例可以共享同一棵 Merkle 树，承诺与打开的开销只付一次——这是 v2 能与 v1 竞争的关键优化。

下面这张图是方法部分最值得看的实例：R1CS 满足性的 sum-check 协议。论文在这里做了一个漂亮的简化——Spartan 原协议要跑两次 sum-check，第二次只验证见证的线性关系，可以直接由承诺方案验证，于是省略掉，只剩一次。

![R1CS 满足性的 sum-check 协议](/images/sum-checking-smallwood-hash-zk/fig13-r1cs-sumcheck.svg)

*图：R1CS 满足性的 sum-check 协议，第二次 sum-check 被承诺方案的线性验证替代（来源：论文原文 Figure 13）*

第 5 节的工具箱还有三件套，各自有独立意义。第一是 hiding MLE 的小域推广：掩码在基域、求值点在扩域时，揭示值均匀分布当且仅当掩码位置的 Lagrange 系数张成整个扩域；论文给出星形放置与逐坐标拒绝采样两种构造，后者在 $\mathbb{F}_2$ 上最后一次翻倍步骤的拒绝率实测约 71%，逐坐标重采样正是为了把这个开销控制住。第二是零知识版 ring-switching：把三域推广（小域见证 → 中间域承诺 → 大域求值），Keccak 应用中用它把 16 个比特打包进一个 $\mathbb{F}_{2^{16}}$ 元素，这是 Keccak 证明能做这么小的关键一环。第三是 GKR 电路展平的改进：把电路切块、承诺中间状态后，展平电路的块结构让 GKR 内部 sum-check 的通信从 $2d(\ell+\iota)$ 降到 $(d+2)\iota + 2d\ell$。

## 实验与数据

实验设定先说清楚边界：对比对象限定为假设 profile 相似的方案（只用对称密码/哈希假设：VOLEitH、Ligero、SmallWood、Longfellow ZK），安全目标统一按 128-bit 校准。最重要的一点是实现状态——论文只有一个 SageMath 概念验证实现，用来验证报告的证明尺寸，**没有优化实现，因此没有任何可代表的证明者/验证者运行时间**。作者预期与 Longfellow ZK 同量级（数十到数百毫秒），但这只是类比推断，不是实测。

先看一般算术电路。方法是 R1CS 经 Spartan 的 sum-check 协议证明，电路规模 2^5 到 2^17，64-bit 与 256-bit 域各一图。结论是 SmallWood+ 全面优于所比较的方案，但作者自己承认，相对 SmallWood 的改进是温和的：sum-check 虽然把每乘法门的承诺量从 SmallWood 的约 2 个域元素降到 1 个，但轨迹掩码本身也要承诺，抵消了一部分收益。适用区间也有上限：电路规模 2^15 以下时新方案优于此前最优。

![一般算术电路的证明尺寸对比](/images/sum-checking-smallwood-hash-zk/fig14-general-circuits.svg)

*图：一般算术电路的证明尺寸对比，64-bit（左）与 256-bit（右）域（来源：论文原文 Figure 14）*

分层算术电路是 GKR 真正发力的地方。用 GKR 加电路展平后，承诺量少于乘法门数，证明显著小于非 GKR 方案；电路小到 2^9 时已极具竞争力，256-bit 域上 2^15 规模、64-bit 域上 2^18 规模的电路，证明可以小于 100 KB。扁平电路与深电路的结果非常接近，展平抹平了深度差异。

![分层算术电路的证明尺寸对比（256-bit 域）](/images/sum-checking-smallwood-hash-zk/fig16-layered-256bit.svg)

*图：分层算术电路的证明尺寸对比，256-bit 域，扁平电路（左）与深电路（右）（来源：论文原文 Figure 16）*

主打数据是 Keccak 置换。陈述是给定公开输出，求 Keccak 置换的原像，每轮 1600 个乘法；用两层 sum-check 保留双线性结构，再用 ring-switching 把 16 比特打包进一个域元素：

| 置换数 | Ligero | VOLEitH | SmallWood | Longfellow ZK | SmallWood+ v1 | SmallWood+ v2 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 182.0 KB | 29.4 KB | 89.9 KB | 59.8 KB | **18.1 KB** | 21.2 KB |
| 2 | 241.0 KB | 55.8 KB | 135.9 KB | 65.6 KB | **20.7 KB** | 23.9 KB |
| 10 | 489.1 KB | 267.0 KB | 389.0 KB | 82.5 KB | **31.1 KB** | 34.4 KB |
| 100 | 1441.7 KB | 2643.0 KB | 2367.8 KB | 127.0 KB | **63.1 KB** | 66.4 KB |

摘要里"18 KB 与 63 KB 对 29 KB 与 127 KB"就是这张表的首尾两行。注意一个诚实注脚：Longfellow ZK 的数字已经用了本文的 ring-switching 技术打包二进制数据，所以表中差距其实低估了本文的实际贡献。

Poseidon 的结果有个反直觉的结论：虽然 Poseidon 是"算术友好"哈希、Keccak 不是，但在本方案下 Keccak 的证明通常比 Poseidon 更小——全靠 ring-switching 高效处理 $\mathbb{F}_2$。100 个置换、256-bit 域时，SmallWood+ v1 的 GKR 策略做到 70.0 KB，对 SmallWood 的 131.1 KB。但证明尺寸不等于证明速度：Keccak 每置换 38,400 次乘法，Poseidon 只有 200–728 次，50 倍以上的差距意味着 Keccak 证明预计远更耗时。

格（LWE）应用同样值得一看。证明知晓 Kyber/Dilithium 参数下的 LWE 解，SmallWood+ v1 做到 Kyber512 12.1 KB、Kyber768 11.9 KB、Kyber1024 12.4 KB，Dilithium2 13.2 KB、Dilithium3 15.0 KB、Dilithium5 15.5 KB，全部小于 SmallWood。但胜负有明确的解释：瓶颈是承诺打开，取决于承诺数据量；Kyber/Dilithium 的噪声向量相对较大、轨迹更小，所以胜出；Subset-Sum 没有噪声项，SmallWood+ 反而明显更大（18.4 KB 对 12.6 KB）。不是全胜，论文如实写了。

还有一个实测里的反直觉结果值得单独提：所有报告的表格里，Compiler 2（v2）的证明普遍大于 Compiler 1（v1），Keccak 一次置换 v2 是 21.2 KB 而 v1 是 18.1 KB。v2 的理论优势只在见证远重于轨迹的渐近意义上，实验中并没有兑现为尺寸胜利。

## 相关工作对比

| 方案 | 定位 | 与 SmallWood+ 的差异 |
| --- | --- | --- |
| SmallWood | 同一作者的前作，中间见证区间最优 | SmallWood+ 是 SmallWood 承诺加 sum-check 框架；结构化陈述上显著更小，非结构化电路改进温和 |
| Longfellow ZK | Ligero 承诺包裹 GKR，移动端 ECDSA 凭证实测 | 本文把"包裹 sum-check"一般化为 SVCS 加双编译器，并把底层承诺换成更紧凑的 SmallWood 系 |
| Ligero | Merkle 树加 proximity test 的鼻祖 | DECS 以严格次数保证替代 proximity test；SmallWood+ 在其上再叠加 sum-check |
| VOLEitH | GGM 树承诺，极小见证最优 | 见证稍大即线性膨胀；Keccak 100 次时膨胀到 2643 KB |
| BaseFold / Brakedown 系 | 改进 Ligero 的渐近证明者复杂度 | 本文目标是最小证明尺寸而非渐近速度；但 MPCS 的设计借鉴了 Brakedown 的思想 |
| FRI 系（STARK 等） | 超大陈述 polylog 证明 | 证明超过约 500 KB 时才胜过 SmallWood，不在本文射程内 |
| VEIL | 同样推广 Longfellow 思路，目标是大规模 IOP/zkVM 的最小证明者开销 | 与本文互补：VEIL 面向 2^25 以上轨迹，本文面向中小见证、共同设计整套论证求最小证明尺寸 |

## 局限与开放问题

- **没有优化实现、没有时间数据**：只有 SageMath 概念验证实现验证尺寸；证明者/验证者时间全无实测，尺寸纪录尚未经过工程验证。
- **改进区间有限**：一般算术电路上改进温和，电路规模超过 2^15 后优势消失；Poseidon 单个置换在大域上仍输给 SmallWood；Subset-Sum 与部分 toy LWE 实例上输给 SmallWood。
- **Compiler 2 未在实测中胜出**：所有表格里 v2 的证明都大于 v1，分工路线的理论优势没有变成尺寸胜利。
- **小域 hiding 有真实代价**：$\mathbb{F}_2$ 上拒绝采样在最后翻倍步骤拒绝率约 71%，逐坐标重采样把开销控制住了，但额外的哈希开销是实实在在的。
- **Fiat–Shamir 后的安全性**：论文证明的是交互版的逐轮知识可靠性与诚实验证者零知识，并论证其兼容 Fiat–Shamir 变换；非交互版的安全性依赖这份兼容性论证。
- **Keccak 的速度代价**：尺寸最优不等于速度最优，每置换 38,400 次乘法对 200–728 次，证明预计远更耗时。
- **威胁模型边界**：这是论证（argument）而非证明（proof），计算可靠性；零知识性只针对诚实验证者，恶意验证者零知识不在定理范围内。

## 一点思考

SmallWood+ 最值得肯定的地方不是某个数字，而是它把"sum-check 包进哈希承诺"这件事从 Longfellow 的一次性技巧变成了通用框架：SVCS 加双编译器之后，任何 sum-check 协议都能即插即用，Keccak、Poseidon、LWE 只是三个例证。对做隐私协议的工程团队来说，真正有用的结论其实是分层的——要证明哈希原像这类结构化陈述，SmallWood+ 是目前尺寸最优的选择；但如果你的陈述是非结构化电路、或者你关心的是证明时间而非尺寸，这篇论文给不了答案，得等优化实现出来再说。还有一点容易被忽略：这篇论文的全部安全论证都在诚实验证者零知识的框架内，部署到需要抗恶意验证者的场景之前，Fiat–Shamir 化之后的安全性还需要再补证明。

## 原文链接

- 论文原文：https://eprint.iacr.org/2026/2880
