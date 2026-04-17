---
layout: page
title: Stochastic Interpolants
description: Deriving the transport equation for stochastic interpolants using Fourier transforms, and why the Eulerian-Lagrangian toggle fails in this setting.
date: 2026-04-17
math: true
---

The main idea behind Stochastic Interpolants is that you want to learn a transport, which could be deterministic or stochastic, between two probability densities $$\rho_0, \rho_1$$. The Stochastic Interpolant is simply a continuous-time stochastic process that bridges the two and is of the form:

$$
I_t = I(x_0, x_1, t) + \gamma(t)z
$$

Where $$(x_0, x_1)$$ is sampled from a coupling with density $$\rho(x_0, x_1)$$ and $$z\sim\mathcal{N}(0, 1)\perp (x_0, x_1)$$. Note that you can sample $$I_t$$ very easily. And the most important realization is that **the time-dependent density of $$I_t$$ denoted by $$\rho_t(x)$$ follows transport equations and forward/backward Fokker-Planck equations which implies that same density can be obtained through ODEs/SDEs, which are the basis of a generative model, and all we have to do is to empirically learn a few important properties of $$I_t$$ such as its velocity field and the score function**

## Derivation of the Transport Equation

Let's first take the simpler case of $$\gamma(t) = 0$$, meaning no added noise, so $$I_t$$ is a deterministic interpolation of the coupling. Note that this case is still "stochastic" because the randomness comes from the coupling $$(x_0, x_1)\sim\rho$$, not from $$z$$. This sharpens the contrast with CNFs, where the randomness is only in $$x_0$$ and then the flow is deterministic.

One thing we'd like to prove is that the time-dependent density $$p_t(x)$$ satisfies a Transport Equation

$$
\partial_tp_t(x) + \nabla \cdot(p_t(x)v_t(x)) = 0
$$

for some velocity $$v_t(x)$$. Notice here that for a given point $$(x, t)$$, there is no longer a unique velocity for the particles moving in time for various pairs of $$(x_0, x_1)$$. For example, for the linear interpolant $$I_t = (1-t)x_0 + tx_1$$, the velocity along a sample path is $$x_1 - x_0$$, which depends on the specific coupling draw, so two paths passing through the same $$(x, t)$$ can have different velocities. And so we can't apply the nimble toggling of [Eulerian and Lagrangian Formulations]({{ '/notes/eulerian-lagrangian-views/' | relative_url }}). Moreover, we don't have a nice bijective transformation $$\mathbb{R}^d \rightarrow \mathbb{R}^d$$ along a particle path like in the CNF setup so it wouldn't be a good idea to talk about Jacobians. We'll try a different approach instead.

Let's start by forming an intuitive picture of how one would calculate $$p_t(x)$$. Given a region $$\mathcal{R}\subset \mathbb{R}^d$$, notice that

$$
\mathbb{P}(I_t\in \mathcal{R}) = \mathbb{E}_{(x_0, x_1)}\Big[1_{I_t(x_0, x_1)\in\mathcal{R}}\Big] = \int \rho(x_0, x_1)1_{I_t(x_0, x_1)\in R}  d(x_0, x_1)
$$

Now, to get the density $$p_t(x)$$, we imagine shrinking the region $$\mathcal{R}$$ until it collapses to $$\{x\}$$. Of course, plugging $$\mathcal{R} = \{x\}$$ would just give $$0$$. But it does point us to the intuition that we should replace the indicator function $$1_{I_t(x_0, x_1)\in \mathcal{R}}$$ with an object that picks out density values when integrated against. Only one object comes to mind: the Dirac Delta Function. Thus, we should expect the following result:

$$
p_t(x) = \int \rho(x_0, x_1)\delta(x - I_t(x_0, x_1)) d(x_0, x_1)
$$

Indeed, this relationship turns out to be correct. Ok, this is good. But what we want, to prove the transport equation, is $$\partial_t p_t(x)$$, which requires us to differentiate inside $$\delta(\cdot)$$. But the Dirac Delta Function is not really a function, it's a distribution. For our discussion, a distribution is something we integrate a function against, such as $$\rho(x_0, x_1)$$, to spit out a real number such as $$p_t(x)$$. In other words, it's a functional. So we can think of the following equation like so:

$$
p_t(x) = F_{t, x}(\rho(x_0, x_1))
$$

where the functional $$F_{t, x}$$ is parametrized by $$(t,x)$$ and what we want is

$$
\partial_t p_t(x) = \partial_t F_{t, x}(\rho(x_0, x_1))
$$

but it's not clear how to find $$\partial_t F_{t, x}(\rho(x_0, x_1))$$.

Fourier Transforms come to the rescue! It turns out that we can represent

$$
\delta(x) = \int_{\mathbb{R}} \frac{1}{2\pi}e^{-ikx}dk
$$

Intuitively, for $$x=0$$, we're integrating a constant over an infinite range so it blows up. Otherwise, the integrand cycles on the complex plane and things cancel out. Of course, this is not a rigorous argument. Rigorously, this is the statement that $$\delta$$ is the inverse Fourier transform of the constant function, in the distributional sense. In our case, I like to think of the integral formula as notational convenience to manipulate objects containing $$\delta$$ in their formulations, like $$F_{t, x}$$ above and compute their derivatives, which are defined and do make sense. Let's verify this. We'll try to compute $$\partial_t p_t(x)$$ using this substitution.

$$
p_t(x) = \int \rho(x_0, x_1)\delta(x - I_t(x_0, x_1)) d(x_0, x_1) = \int_{\mathbb{R}}\int_{\mathbb{R}} \rho(x_0, x_1) \Big(\int_{\mathbb{R}} \frac{1}{2\pi}e^{-ik(x-I_t(x_0, x_1))}dk\Big)d(x_0, x_1)
$$

This implies that

$$
\partial_t p_t(x) = \frac{1}{2\pi}\int\int\int \rho(x_0, x_1) ik\cdot \partial_t I_t(x_0, x_1)e^{-ik(x-I_t(x_0, x_1))}dk\, d(x_0, x_1)
$$

Now, notice that 

$$
ik \cdot e^{-ik(x - I_t)} = -\nabla_x e^{-ik(x - I_t)} \implies ik \cdot \partial_t I_t \cdot e^{-ik(x - I_t)} = -\nabla_x \cdot (\partial_t I_t \cdot e^{-ik(x - I_t)})
$$ 

This means we can write $$\partial_t p_t(x) = -\nabla \cdot j_t(x)$$ where

$$
\begin{align}
j_t(x) &= \frac{1}{2\pi} \int\int\int \rho(x_0, x_1)\partial_tI_t(x_0, x_1)e^{-ik(x-I_t(x_0, x_1))}dk\,d(x_0, x_1) \\
&= \int\int\rho(x_0, x_1)\partial_tI_t(x_0, x_1)\delta(x-I_t(x_0, x_1))d(x_0, x_1)
\end{align}
$$

The object $$j_t(x)$$ can look intimidating. But the point is that we were able to express $$\partial_t p_t(x)$$ as the divergence of another function of $$(t, x)$$. Finally, define

$$
v_t(x):= \frac{j_t(x)}{p_t(x)}
$$

and you have your transport equation:

$$
\partial_t p_t(x) + \nabla \cdot (p_t(x)v_t(x)) = 0
$$

Now of course, we still don't have a clear physical intuition on what $$v_t(x)$$ is or, most importantly, how to empirically estimate it from data. That's what we'll do next.

The punch line of this write up is to gather intuition on why we had to use Fourier Transforms to derive the Transport Equation. The writeup above is not strictly rigorous, and the Stochastic Interpolants paper starts from Fourier Transforms (or characteristic function), and moves in reverse. Though when I first looked at the proof, I was baffled at the thought of moving into the complex domain and using Fourier Transforms so suddenly. And this is my way of building intuition of how I would have come up with their approach if I were in their shoes.
