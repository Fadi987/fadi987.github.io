---
layout: page
title: From Behavior Cloning to RL
description: Tracing the arc from vanilla BC through DAgger and AggreVaTe to approximate policy iteration.
date: 2026-08-10
tags: reinforcement-learning
math: true
---

# Vanilla Behavior Cloning

So it seems that there's an arc going from Behavior Cloning (BC) to Reinforcement Learning (RL).

First, let's start with vanilla BC. In its simplest form, we have the regression objective

$$
L(\theta) = \mathbb{E}_{(s, a)\sim \mathcal{D}}\big[\lVert\pi_\theta(s)-a\rVert^2\big] \tag{1}
$$

where $$\mathcal{D}$$ is a fixed offline dataset coming from expert demonstrations $$\pi^*$$. Training like this is very brittle because, during deployment, the states visited by the learner will deviate slightly (and then not so slightly) from those visited by the expert in the training dataset. [DAgger](https://arxiv.org/pdf/1011.0686), then, is a training technique that attacks this problem.

# DAgger

The main issue with vanilla BC above is the state distribution, which comes purely from the expert policy. DAgger tries to aggregate training data dynamically during training to include not only states typically visited by a pure expert policy but also states visited by the learner itself during various phases of training.

In other words, let $$\pi_i$$ be the learner policy at training iteration $$i$$ and define

$$
L_i(\theta) = \mathbb{E}_{s\sim \delta_{\pi_i}}\big[\lVert \pi_\theta(s)-\pi^*(s)\rVert^2\big]
$$

then DAgger trains on

$$
L(\theta):= \frac{1}{N} \sum_{i=1}^N L_i(\theta) \tag{2}
$$

where $$N$$ is the current training phase. Of course, in practical implementations the objective could be slightly different, but (2) above captures the essence: $$\pi_i$$ determines the state distribution, while the trainable policy $$\pi_\theta$$ is what appears inside the loss.

Now, DAgger is great because the state distribution is that of the learner, which directly addresses the brittleness of vanilla BC above. But there are still two problems:

1. Even if the expert is optimal, by only regressing on the optimal action we are discarding information on the relative value of the optimal action relative to sub-optimal actions. Such information may encode rich problem geometry.
2. In real life, the expert may not be optimal; the measurements may be noisy; the sample is finite; and optimization is imperfect; and so on. In which case, it can still be useful to not only regress on what the expert would have chosen but also to include information on the value of nearby actions.

[AggreVaTe](https://arxiv.org/pdf/1406.5979) then attacks these two points; though, as we'll see, its guarantee is relative to the expert whose cost-to-go we query, not a free lunch against expert suboptimality.

# AggreVaTe

AggreVaTe relies on the performance difference lemma proved in [How much of an approximation is PPO?]({{ '/notes/ppo-and-policy-gradients/' | relative_url }}), which, translated to the notation of these notes, says

$$
J(\pi) - J(\pi^*) = \mathbb{E}_{s\sim \delta_{\pi}, a\sim \pi(\cdot\mid s)}\big[A^{\pi^*}(s, a)\big] \tag{4}
$$

(up to the usual occupancy normalization / discount factor conventions from those notes). In other words, the difference in performance between the learner policy and the expert policy is equal to the expected value of the _expert_ advantage under the distribution of _learner_ states and actions. The advantage here is measured relative to the expert: take action $$a$$ at state $$s$$, then follow $$\pi^*$$ afterward.

This lemma has an important implication. Write $$Q^{\pi^*}(s, a)$$ for the expert's action-value function, the expected return of taking $$a$$ at $$s$$ and then continuing under $$\pi^*$$, and let $$A^{\pi^*}(s, a) = Q^{\pi^*}(s, a) - V^{\pi^*}(s)$$. Suppose that for any state $$s\in\mathcal{S}$$, the learner puts mass only on actions that maximize $$Q^{\pi^*}(s, \cdot)$$. Then the expected expert advantage under the learner is nonnegative, and we'll have

$$
J(\pi) \geq J(\pi^*) \tag{6}
$$

In other words, we'll be at least as good as the expert. And while we can't guarantee in one training iteration that this holds for all states, we can at least try to make it happen on the states visited by the learner's policy so far. This is exactly what AggreVaTe does.

Like DAgger, it aggregates states based on the learner's policy, but instead of merely training on $$\pi^*(s)$$, it trains against the much richer $$Q^{\pi^*}(s, a)$$. Put differently: DAgger asks the expert for a single preferred action at each learner-visited state, whereas AggreVaTe uses the expert's cost-to-go for candidate actions, preserving information about how good or bad different deviations are.

Concretely, AggreVaTe's essence is a cost-sensitive / action-value objective. In the reward-maximization convention,

$$
L_i(\theta) = -\mathbb{E}_{s\sim \delta_{\pi_i}}\Big[\mathbb{E}_{a\sim \pi_\theta(\cdot\mid s)}\big[Q^{\pi^*}(s, a)\big]\Big],\qquad L(\theta) = \frac{1}{N} \sum_{i=1}^N L_i(\theta) \tag{7}
$$

(or, equivalently, minimize expected expert cost-to-go in the cost convention used by the paper). The key is that the learner's action distribution is scored against the expert continuation value, not collapsed to a single $$\arg\max$$ regression target, which would throw away exactly the richer action-value information that distinguishes AggreVaTe from DAgger.

One caveat on imperfect experts: richer cost information can help the learner exploit local action-value structure, and in some settings AggreVaTe can even outperform the expert. But the expert remains the reference policy. AggreVaTe does not fundamentally "solve" expert suboptimality; its guarantee is relative to the expert whose $$Q^{\pi^*}$$ is being queried.

# From AggreVaTe to RL

Now we finally move the needle one more time to arrive at an algorithm that can be truly put under the category of Reinforcement Learning.

The core idea is simply to (1) remove the entity of an external expert like DAgger and AggreVaTe and (2) replace it with the current policy itself. In other words, the expert and the learner are bootstrapped together: $$Q^{\pi^*} \longrightarrow Q^{\pi_i}$$. AggreVaTe uses an external expert's continuation value; approximate policy iteration / RL estimates the continuation value of the current learner and improves against that estimate.

So the algorithm goes like this:

1. Given current policy $$\pi_i$$, estimate its Q-function $$Q^{\pi_i}$$ using your method of choice
2. Update $$\pi_{i+1}(s) = \arg\max_a Q^{\pi_i}(s, a)$$ using your optimization method of choice
3. Repeat

Step 2 is the _exact_ policy-improvement setting. From the performance difference argument above, if we do this exactly, then we can guarantee

$$
J(\pi_{i+1}) \geq J(\pi_i)
$$

so the policy would keep improving monotonically until training is saturated (we're near optimal). Approximate Q-estimation, restricted policy classes, finite data, and imperfect optimization can break that monotonic improvement, so the inequality above should be read as the idealized case, with a big asterisk still attached in practice.

To summarize the arc:

- **BC**: expert actions on expert states
- **DAgger**: expert actions on learner states
- **AggreVaTe**: expert cost-to-go on learner states
- **RL / approximate policy iteration**: learner-estimated cost-to-go on learner states
