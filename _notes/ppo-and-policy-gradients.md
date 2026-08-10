---
layout: page
title: "How much of an approximation is PPO?"
description: Relating the discounted return to the unclipped PPO surrogate via state occupancy measures and the performance difference lemma, and clarifying which additional approximations hold in practice.
date: 2026-07-25
tags: reinforcement-learning
math: true
---

In these set of notes, I will aim to understand and compare PPO with vanilla Policy Gradient Methods.

First of all, remember that our objective in Reinforcement Learning is to maximize

$$
J(\theta) := J(\pi_\theta) = \mathbb{E}_{\tau\sim p_{\pi_\theta}(\tau)}\Big[R(\tau)\Big]
$$

where the expectation is taken over the trajectory, the discounted return is

$$
R(\tau)=\sum_{k=0}^{\infty}\gamma^k r(s_k,a_k),
$$

and $$J(\theta)$$ is just shorthand for $$J(\pi_\theta)$$ (later, $$J(\mu)$$ will mean the same objective under a different policy $$\mu$$). If the environment reward is stochastic, $$r(s,a)$$ denotes the expected one-step reward. Taking an expectation over a trajectory can be tricky to think about because we have to sample many (possibly infinite) times to sample the entire trajectory

$$
p_{\pi_\theta}(\tau) = p_0(s_0)\pi_\theta(a_0\mid s_0) P(s_1\mid s_0, a_0)\pi_\theta(a_1\mid s_1)\dots
$$

Instead, let's define

$$
\delta_\pi(s) = (1-\gamma)\sum_{k=0}^\infty \gamma^k P_k^\pi(s)
$$

where $$P_k^\pi(s)\equiv \Pr_\pi(s_k = s)$$, which is called the distribution of the states over $$\pi$$. $$\delta_\pi(s)$$ is a normalized (so that it's a probability distribution) series of discounted probabilities that the state at time $$k$$ will be $$s$$.

Ok, why is this formulation useful? Because it allows us to write $$J(\theta)$$ as a two-variable single-step expectation instead of a trajectory expectation. (This is an analytical reformulation ; in practice we still have to collect trajectories.) Let's show that

$$
J(\pi_\theta) = \frac{1}{1-\gamma}\mathbb{E}_{s\sim \delta_{\pi_\theta}(\cdot), a\sim \pi_\theta(\cdot\mid s)}\Big[r(s, a)\Big]\tag{1}
$$

where $$r(\cdot, \cdot)$$ is the single step reward, instead of the reward of the entire trajectory $$R(\tau)$$.

To see that, notice that

$$
\begin{align}
J(\pi_\theta)  = \mathbb{E}_{\tau\sim p_{\pi_\theta}}\Big[R(\tau)\Big] &= \sum_{k=0}^\infty \gamma^k\mathbb{E}_{\tau\sim p_{\pi_\theta}}\Big[r(s_k, a_k)\Big]
=  \sum_{k=0}^\infty \gamma^k \mathbb{E}_{s_k, a_k}\Big[r(s_k, a_k)\Big]\notag\\
&= \sum_{k=0}^\infty \gamma^k \sum_{s\in\mathcal{S}, a\in\mathcal{A}}P_k^{\pi_\theta}(s)\pi_\theta(a\mid s)r(s, a)= \sum_{s\in\mathcal{S}, a\in\mathcal{A}}\Big(\sum_{k=0}^\infty \gamma^k P_k^{\pi_\theta}(s)\Big)\pi_\theta(a\mid s)r(s, a)\notag\\
&= \frac{1}{1-\gamma} \sum_{s\in\mathcal{S}, a\in\mathcal{A}} \delta_{\pi_\theta}(s)\pi_\theta(a\mid s)r(s, a)
= \frac{1}{1-\gamma} \mathbb{E}_{s\sim\delta_{\pi_\theta}, a\sim\pi_\theta}\Big[r(s, a)\Big]\notag
\end{align}
$$

as desired. Another related but very important relation is the following lemma.

**Performance Difference Lemma**. Let $$\mu$$ be some base policy (the fixed rollout / behavior policy), then

$$
J(\pi_\theta) - J(\mu) = \frac{1}{1-\gamma}\mathbb{E}_{s\sim\delta_{\pi_\theta}, a\sim\pi_\theta}\Big[A^\mu(s, a)\Big]
$$

To prove it, notice that

$$
\begin{align}
\frac{1}{1-\gamma}\mathbb{E}_{s\sim\delta_{\pi_\theta}, a\sim\pi_\theta}\Big[A^\mu(s, a)\Big] &= \sum_{s\in\mathcal{S}, a\in\mathcal{A}}\Big(\sum_{k=0}^\infty \gamma^k P_k^{\pi_\theta}(s)\Big)\pi_\theta(a\mid s)A^\mu(s, a) = \sum_{k=0}^\infty \gamma^k\sum_{s\in\mathcal{S}, a\in\mathcal{A}}P_k^{\pi_\theta}(s)\pi_\theta(a\mid s)A^\mu(s, a)\notag\\
&= \sum_{k=0}^\infty \gamma^k \mathbb{E}_{s_k \sim P_k^{\pi_\theta}, a_k\sim\pi_\theta(\cdot\mid s_k)}\Big[A^\mu(s_k, a_k)\Big]\notag
\end{align}
$$

Now, we know that

$$
A^\mu(s_k, a_k) = Q^\mu(s_k, a_k) - V^\mu(s_k) = r(s_k, a_k) + \gamma\mathbb{E}[V^\mu(s_{k+1})] - V^\mu(s_k)
$$

the crucial observation here is that since $$s_k, a_k$$ are fixed, the distribution of $$s_{k+1}$$ is completely determined by the environment dynamics and is independent of the policy. And so

$$
\mathbb{E}_{s_k\sim P_k^{\pi_\theta}, a_k\sim\pi_\theta(\cdot\mid s_k)}\Big[A^\mu(s_k, a_k)\Big] = \mathbb{E}_{s_k\sim P_k^{\pi_\theta}, a_k\sim\pi_\theta(\cdot\mid s_k)}\Big[r(s_k, a_k)\Big] + \gamma\mathbb{E}_{s_{k+1}\sim P_{k+1}^{\pi_\theta}}\Big[V^\mu(s_{k+1})\Big] - \mathbb{E}_{s_k\sim P_k^{\pi_\theta}}\Big[V^\mu(s_k)\Big]
$$

this is great because all of the expectations for $$V^\mu(\cdot)$$ are taken with respect to marginal state distributions of $$\pi_\theta$$ so they telescopically cancel (assuming the usual vanishing boundary $$\lim_{K\to\infty}\gamma^{K+1}\mathbb{E}[V^\mu(s_{K+1})]=0$$) and we get

$$
\frac{1}{1-\gamma}\mathbb{E}_{s\sim\delta_{\pi_\theta}, a\sim\pi_\theta}\Big[A^\mu(s, a)\Big] = \underbrace{\sum_{k=0}^\infty \gamma^k \mathbb{E}_{s_k\sim P_k^{\pi_\theta}, a_k\sim\pi_\theta(\cdot\mid s_k)}\Big[r(s_k, a_k)\Big]}_{J(\pi_\theta)} - \underbrace{\mathbb{E}_{s_0}\Big[V^\mu(s_0)\Big]}_{J(\mu)}
$$

as desired. The Performance Difference Lemma is important because it brings us one step closer to the PPO objective. In particular, if we're optimizing with respect to $$\theta$$, since $$J(\mu)$$ is constant, then maximizing $$J(\pi_\theta)$$ is equivalent to maximizing $$\mathbb{E}_{s\sim \delta_{\pi_\theta}, a\sim \pi_\theta}[A^\mu(s, a)]$$. So let's unravel this expression, but with one approximation. We replace $$\delta_{\pi_\theta}$$ with $$\delta_\mu$$. The claim is that that's enough.

$$
\begin{align}
\frac{1}{1-\gamma}\mathbb{E}_{s\sim\delta_\mu, a\sim\pi_\theta}\Big[A^\mu(s, a)\Big] &= \sum_{k=0}^\infty \gamma^k \mathbb{E}_{s_k \sim P_k^\mu, a_k\sim\pi_\theta(\cdot\mid s_k)}\Big[A^\mu(s_k, a_k)\Big]\notag\\
&= \sum_{k=0}^\infty \gamma^k \mathbb{E}_{s_k\sim P_k^\mu, a_k \sim\mu(\cdot\mid s_k)}\Big[\frac{\pi_\theta(a_k\mid s_k)}{\mu(a_k\mid s_k)}A^\mu(s_k, a_k)\Big]\notag
\end{align}
$$

Here the per-state importance ratio $$r_\theta(s,a)=\pi_\theta(a\mid s)/\mu(a\mid s)$$ is exact conditional on $$s$$ ; the only approximation is the frozen state occupancy $$\delta_{\pi_\theta}\approx\delta_\mu$$. And this matches the unclipped PPO objective exactly! Also note that the outer $$\gamma^k$$ is required for the discounted start-state objective $$J$$; in PPO we usually don't have it and instead do uniform sampling over timesteps, but let's disregard this for now. In PPO, when we take multiple gradient steps per rollout sample, we have our fixed rollout / behavior policy $$\mu$$ that generated the rollout, then we have our current optimized policy $$\pi_\theta$$. And we do the sampling (e.g., the expectation) with respect to the rollout so it's indeed with respect to the behavior policy $$s_k\sim P_k^\mu, a_k\sim\mu(\cdot\mid s_k)$$.

Now, a key claim is that at $$\pi_\theta = \mu$$, this surrogate and the true objective $$J(\theta)$$ have identical gradients (and clipped PPO does too, since the ratio starts at $$1$$ and sits inside the clipping interval). This may not be immediately clear because even though $$\pi_\theta = \mu$$, we are indeed comparing derivatives, and it's not readily obvious that they're equal. So let's quickly show it.

In the treatment below, I'll assume that $$\pi_\theta = \mu$$ but keep their notations separate to emphasize dependence on $$\theta$$ which is important for differentiation. I'll denote the approximate objective used in PPO by $$J_P(\theta)$$. We have on the one hand

$$
\begin{align}
J_P(\theta) &= \mathbb{E}_{s\sim \delta_\mu, a \sim\pi_\theta(\cdot\mid s)}\big[A^\mu(s, a)\big] = \mathbb{E}_{s\sim\delta_\mu, a\sim \mu(\cdot\mid s)}\Big[\frac{\pi_\theta(a\mid s)}{\mu(a\mid s)}A^\mu(s, a)\Big] \implies \notag\\
&\boxed{\nabla_\theta J_P(\theta)
= \mathbb{E}_{s\sim\delta_\mu, a\sim\mu(\cdot\mid s)}\Big[\frac{\nabla_\theta \pi_\theta (a\mid s)}{\mu(a\mid s)}A^\mu(s, a)\Big]} \tag{2}
\end{align}
$$

On the other hand, we have

$$
\begin{align}
J(\theta) &= J(\mu) + \mathbb{E}_{s\sim \delta_{\pi_\theta}, a\sim\pi_\theta(\cdot\mid s)}\big[A^\mu(s, a)\big]\notag\\
\implies \nabla_\theta J(\theta)  &=\underbrace{\mathbb{E}_{s\sim \delta_{\pi_\theta}, a\sim\pi_\theta(\cdot\mid s)}\Big[\nabla_\theta \log(\delta_\theta(s)\pi_\theta(a\mid s))A^\mu(s, a)\Big]}_{\text{log trick}} \notag\\
&= \mathbb{E}_{s\sim \delta_{\pi_\theta}, a\sim\pi_\theta(\cdot\mid s)}\Big[\frac{\nabla_\theta(\delta_\theta(s)\pi_\theta(a\mid s))}{\delta_\theta(s)\pi_\theta(a\mid s)}A^\mu(s, a)\Big]\notag\\
&= \underbrace{\mathbb{E}_{s\sim \delta_{\pi_\theta}, a\sim\pi_\theta(\cdot\mid s)}\Big[\frac{\nabla_\theta \delta_\theta(s) \pi_\theta(a\mid s) + \delta_\theta(s)\nabla_\theta(\pi_\theta(a\mid s))}{\delta_\theta(s)\pi_\theta(a\mid s)}A^\mu(s, a)\Big]}_{\text{product rule}}\notag\\
&= \underbrace{\mathbb{E}_{s\sim \delta_\mu, a\sim\mu(\cdot\mid s)}\Big[\frac{\nabla_\theta \pi_\theta(a\mid s)}{\mu(a\mid s)}A^\mu(s, a)\Big]}_{\nabla_\theta J_P(\theta)} + \underbrace{\mathbb{E}_{s\sim \delta_\mu, a\sim \mu(\cdot\mid s)}\Big[\frac{\nabla_\theta \delta_\theta(s)}{\delta_\theta(s)}A^\mu(s, a)\Big]}_{0}\notag
\end{align}
$$

where in the last equation we substituted $$\pi_\theta = \mu$$ after taking the derivative. And the second term is $$0$$ because if we separate the expectation over the joint $$(s, a)$$ into $$s$$ then $$a\mid s$$, pull the term that's only a function of $$s$$ outside the inner expectation, and then notice that, for any state $$s$$, $$\mathbb{E}_{a\sim\mu(\cdot\mid s)}[A^\mu(s, a)] = 0$$ by definition. And we're done.

## Takeaways

1. For idealized **unclipped** PPO with exact advantages and exact expectations, the defining approximation relative to the original objective $$J(\pi_\theta)$$ is the replacement $$\delta_{\pi_\theta}\rightarrow\delta_\mu$$. The action-level importance weighting is exact conditional on $$s$$.
2. At $$\pi_\theta=\mu$$, the true discounted-return objective and the unclipped surrogate have identical gradients. The clipped PPO objective also has that same initial gradient because the ratio starts at $$1$$, which is within the clipping interval. So if we collect fresh rollouts and take exactly one full-batch gradient-ascent step (fully on-policy), then under those idealized assumptions the PPO update equals the ordinary on-policy policy-gradient update.
3. Multiple optimizer steps on the same rollout batch are approximate because $$\pi_\theta\neq\mu$$ after the first update; clipping is an additional deliberate modification. Separately, practice also involves estimated advantages / GAE, finite-sample error, and often uniform timestep weighting.
4. If we strictly want to follow $$J(\pi_\theta)$$, then we have to weight time $$k$$ by $$\gamma^k$$; in reality, we take uniform weights (just a simple mean).
