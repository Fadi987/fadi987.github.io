---
layout: page
title: On the Contractivity of Stochastic Interpolation Flow
description: How strong log-concavity of the target controls the Lipschitz constant of the interpolant ODE flow map.
date: 2026-08-15
tags: generative-modeling
math: true
---

In this set of notes, I'll be going over [*On the Contractivity of Stochastic Interpolation Flow*](https://arxiv.org/pdf/2504.10653) as I understand it, on-my-brain-policy.

# Problem Setup

The paper is operating in the setup of [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }}) of the form

$$
X_t = \alpha_t X_0 + \beta_t X_1,
\qquad
X_0\sim\mathcal{N}(0,I_d),
\qquad
X_0\perp X_1.
\tag{1}
$$

We assume the usual interpolation boundary conditions

$$
(\alpha_0,\beta_0)=(1,0),
\qquad
(\alpha_1,\beta_1)=(0,1),
$$

and, throughout the interior of the interpolation, that

$$
\alpha_t>0,\qquad
\beta_t\geq 0,\qquad
\dot{\alpha}_t<0,\qquad
\dot{\beta}_t>0.
$$

In particular, the paper focuses on studying the contractive behavior of the Lagrangian ODE describing the particles that transport the probability mass from $$t=0$$ to $$t=1$$.

By contractive behavior I roughly mean: how fast can the value of a function change if we change its input. This concept can be captured by what is known as the Lipschitz constant.

**Def.** We say that a function $$f$$ has Lipschitz constant $$K$$ if

$$
\lVert f(x)-f(y)\rVert\leq K\lVert x-y\rVert
$$

for any $$x,y$$.

And in our case, the function we're interested in is $$f_1(x)$$, where $$f_t(x_0)$$ is the location of the particle starting at location $$x_0$$ at time $$0$$ and then propagating forward in time according to the Interpolant ODE until time $$t$$.

One very important assumption the paper makes is that the terminal distribution we're transporting to, $$p_1(x)$$, is $$\kappa$$-strongly log-concave.

# Log-Concave Distributions

**Def.** We say that a distribution $$p(x)$$ is $$\kappa$$-strongly log-concave if its density can be written as

$$
p(x)=\frac{1}{Z}e^{-V(x)}
$$

where $$V(x)$$ is $$\kappa$$-strongly convex, meaning

$$
\nabla^2V(x)\succeq \kappa I.
$$

Do note that strongly log-concave distributions are necessarily unimodal. To see this, note that because $$V(x)$$ is strongly convex, it has a unique minimizer $$x^*$$. And since $$e^{-x}$$ is strictly monotonically decreasing, we have

$$
\operatorname*{argmax}_x p(x)
=
\operatorname*{argmin}_x V(x)
=
x^*,
$$

thus proving that $$p(x)$$ has a unique mode $$x^*$$.

One final result we'll need is that if a distribution is $$\kappa$$-strongly log-concave, then its covariance is controlled by $$\kappa$$. In other words,

$$
\operatorname{Cov}(X)\preceq \frac{1}{\kappa}I.
\tag{2}
$$

Intuitively, this is very natural. The larger $$\kappa$$ is, the more pointy the distribution becomes, and thus we should expect its covariance to decrease. However, proving this is not as easy.

## How Not To Prove the Covariance Bound

My attempt at proving (2) goes like this. Given a $$\kappa$$-strongly log-concave distribution, its potential function is strongly convex and thus we have

$$
V(x)\geq V(x^*)+\frac{1}{2}\kappa\lVert x-x^*\rVert^2,
$$

where $$x^*$$ is the unique minimizer of $$V(\cdot)$$. You can check that this implies

$$
p(x)
\leq
p(x^*)\exp\left(-\frac{1}{2}\kappa\lVert x-x^*\rVert^2\right).
$$

This inequality makes it tempting to evaluate

$$
\begin{align}
\mathbb{E}\big[(X-x^*)(X-x^*)^T\big]
&=
\int (x-x^*)(x-x^*)^T p(x)\,dx \notag\\
&\preceq
\int
(x-x^*)(x-x^*)^T
p(x^*)
\exp\left(-\frac{1}{2}\kappa\lVert x-x^*\rVert^2\right)
dx.
\end{align}
$$

Recognizing the Gaussian integral,

$$
\mathbb{E}\big[(X-x^*)(X-x^*)^T\big]
\preceq
p(x^*)
\left(\frac{2\pi}{\kappa}\right)^{d/2}
\frac{1}{\kappa}I.
$$

And finally, you can easily check that

$$
\operatorname{Cov}(X)
\preceq
\mathbb{E}\big[(X-x^*)(X-x^*)^T\big],
$$

so we're almost there, but we still have the annoying term

$$
p(x^*)
\left(\frac{2\pi}{\kappa}\right)^{d/2}.
$$

So let's study it. To that end, notice that

$$
\begin{align}
\int p(x)\,dx
&=
1 \notag\\
&\leq
\int
p(x^*)
\exp\left(-\frac{1}{2}\kappa\lVert x-x^*\rVert^2\right)
dx \notag\\
&=
p(x^*)
\left(\frac{2\pi}{\kappa}\right)^{d/2},
\end{align}
$$

which implies

$$
\boxed{
p(x^*)
\left(\frac{2\pi}{\kappa}\right)^{d/2}
\geq 1
}.
$$

So unfortunately, the inequality came the other way, which proves that this path of reasoning doesn't prove our bound :(

# How to Arrive at the Covariance Bound

There is a well-known result called the [**Brascamp-Lieb inequality**](https://en.wikipedia.org/wiki/Brascamp%E2%80%93Lieb_inequality), which I'm not gonna dig into right now because I'm tired :(

For our purposes, it gives exactly

$$
\operatorname{Cov}(X)\preceq \frac{1}{\kappa}I
$$

for a $$\kappa$$-strongly log-concave distribution.

# Local to Global Contraction through Grönwall

Ok, but how do we control the contraction of $$f_1(x)$$? It seems like a daunting task at first.

One thing we can do is reduce the problem from the global to the local setup. And for that we'll use Grönwall's lemma.

**Grönwall's Lemma.** Let $$u(t)\geq 0$$ be a function of time and suppose that

$$
\dot{u}(t)\leq c(t)u(t).
$$

Then

$$
u(t)
\leq
\exp\left(\int_0^t c(s)\,ds\right)u(0).
\tag{3}
$$

The intuition behind Grönwall's lemma is simple and follows from the fact that the solution to the differential equation

$$
\dot{u}(t)=c(t)u(t)
$$

is precisely the right side of (3).

The beauty behind this result, though, is that it lets us control $$u(t)$$ by controlling its instantaneous rate of change $$\dot u(t)$$.

Going back to our paper, we care about contraction. So we consider two different initial particles $$x_0,y_0$$, and we want to control

$$
\lVert f_1(x_0)-f_1(y_0)\rVert.
$$

Through Grönwall, we can reduce the problem, perhaps, by controlling

$$
\lVert f_t(x_0)-f_t(y_0)\rVert
$$

for every $$t$$. So we define

$$
u(t):=
\lVert f_t(x_0)-f_t(y_0)\rVert.
\tag{4}
$$

The evolution of the difference between the trajectories is determined by the velocity field:

$$
\frac{d}{dt}
\Big(f_t(x_0)-f_t(y_0)\Big)
=
v_t(f_t(x_0))-v_t(f_t(y_0)).
$$

So the problem has been reduced to studying the contraction of the local velocity field!

The paper considers the infinitesimal case where the two particles become arbitrarily close, thus leading us to the spatial derivative of the velocity field,

$$
\nabla_x v_t(x).
$$

We'll study that next.

# Controlling $$\nabla_x v_t(x)$$

Ok, so how do we go about controlling $$\nabla_x v_t(x)$$?

The paper looks at the posterior

$$
X_1\mid X_t.
$$

It is true that $$X_1\mid X_t$$ is defined through the coupling through time of the stochastic Interpolant. And while the time marginals are the same as those of the ODE system, the coupling of the ODE is deterministic, meaning we know exactly where a particle is going given its current position.

It is still fascinating to me that the behavior of the Interpolant posterior tells us things about the ODE velocity. This is the limit of my intuition and I don't have a good explanation for why that is. But let's just be curious and study it.

# Studying the Posterior $$X_1\mid X_t$$

Let's first try to get a sense of what its PDF looks like using Bayes' Rule. Note that

$$
\begin{align}
p(x_1\mid x_t)
&\propto
p(x_t\mid x_1)p(x_1) \notag\\
&=
p(x_1)
\exp\left(
-\frac{1}{2\alpha_t^2}
\lVert x_t-\beta_t x_1\rVert^2
\right), \tag{5}
\end{align}
$$

where we relied on the fact that

$$
X_t\mid X_1=x_1
\sim
\mathcal N(\beta_t x_1,\alpha_t^2 I).
$$

## The Posterior is Strongly Log-Concave

The first observation is that this posterior distribution is itself strongly log-concave. Indeed, looking at its potential function,

$$
V_{x_1\mid x_t}(x_1)
=
-\log p(x_1)
+
\frac{\beta_t^2}{2\alpha_t^2}
\left\lVert
x_1-\frac{x_t}{\beta_t}
\right\rVert^2,
$$

or

$$
V_{x_1\mid x_t}(x_1)
=
V_{x_1}(x_1)
+
\frac{\beta_t^2}{2\alpha_t^2}
\left\lVert
x_1-\frac{x_t}{\beta_t}
\right\rVert^2.
$$

This implies that

$$
\nabla_{x_1}^2V_{x_1\mid x_t}(x_1)
=
\nabla_{x_1}^2V_{x_1}(x_1)
+
\frac{\beta_t^2}{\alpha_t^2}I
\succeq
\left(
\kappa+\frac{\beta_t^2}{\alpha_t^2}
\right)I.
$$

And we showed that the posterior is

$$
\left(
\kappa+\frac{\beta_t^2}{\alpha_t^2}
\right)
\text{-strongly log-concave!}
$$

As a sanity check, notice that at $$t=0$$, where $$\alpha_t=1$$, $$\beta_t=0$$, it's at least $$\kappa$$-strongly log-concave, matching our assumption about $$p(x_1)$$.

But as we progress in time, the second term grows arbitrarily large and the distribution becomes super pointy near $$t=1$$. This makes a lot of sense because as we approach $$t=1$$, the Interpolant gives much more information about where $$X_1$$ is, and the uncertainty decreases.

## $$X_1\mid X_t$$ is Part of an $$X_t$$-Parameterized Exponential Family

### Exponential Families

We say that a family of distributions $$p_\eta(x)$$, parameterized by $$\eta$$, is an exponential family if $$p_\eta$$ has the following form:

$$
p_\eta(x)
=
h(x)
\exp\left(
T(x)^T\eta-A(\eta)
\right),
$$

for some functions $$h(x)$$ and $$T(x)$$ that don't depend on $$\eta$$.

Note here that $$A(\eta)$$ is nothing but the log-partition function.

One nice thing about exponential families is that gradients of $$A(\eta)$$ give us the moments of $$p_\eta(x)$$. For example, we can show that

$$
\nabla_\eta A(\eta)
=
\mathbb E_\eta[T(X)].
$$

To see this, notice that

$$
A(\eta)=\log Z(\eta),
$$

which implies that

$$
\begin{align}
\nabla_\eta A(\eta)
&=
\frac{\nabla_\eta Z(\eta)}{Z(\eta)} \notag\\
&=
\frac{
\nabla_\eta
\int
h(x)e^{T(x)^T\eta}\,dx
}{
Z(\eta)
} \notag\\
&=
\frac{
\int
h(x)T(x)e^{T(x)^T\eta}\,dx
}{
Z(\eta)
} \notag\\
&=
\mathbb E_\eta[T(X)].
\end{align}
$$

Similarly, you can check that

$$
\nabla_\eta^2A(\eta)
=
\nabla_\eta\mathbb E_\eta[T(X)]
=
\operatorname{Cov}_\eta(T(X)),
$$

and so on...

### Instantiation of the Posterior as an Exponential Family

Let's go back to equation (5) and expand the square to get

$$
\begin{align}
p(x_1\mid x_t)
&\propto
p(x_1)
\exp\left(
-\frac{\beta_t^2\lVert x_1\rVert^2}{2\alpha_t^2}
+
\frac{\beta_t x_1^T x_t}{\alpha_t^2}
\right) \notag\\
&=
\underbrace{
p(x_1)
\exp\left(
-\frac{\beta_t^2\lVert x_1\rVert^2}{2\alpha_t^2}
\right)
}_{h(x_1)}
\exp\left(
\underbrace{
\frac{\beta_t}{\alpha_t^2}x_1
}_{T(x_1)}^T
x_t
\right).
\end{align}
$$

This is indeed an exponential family, where

$$
T(x_1)=\frac{\beta_t}{\alpha_t^2}x_1
$$

and the natural parameter is $$x_t$$.

More importantly, since the sufficient statistic is linear in $$x_1$$, differentiating the posterior mean with respect to $$x_t$$ will give us the posterior covariance.

# The Assembly of the Proof Arc

This now gives us a really nice arc. We can:

1. Write $$v_t(x_t)$$ in terms of the posterior mean.
2. Differentiate with respect to $$x_t$$, giving us:
   1. exactly $$Dv_t(x_t)$$, which we want to control, on the left; and
   2. $$\operatorname{Cov}(X_1\mid X_t)$$ on the right.
3. Control $$Dv_t(x_t)$$ through control of the covariance in (2).

Let's tackle these steps one by one.

First, note that from the theory of Stochastic Interpolants we have

$$
\begin{align}
v_t(x_t)
&=
\mathbb E[\dot X_t\mid X_t=x_t] \notag\\
&=
\mathbb E[
\dot\alpha_t X_0+\dot\beta_t X_1
\mid X_t=x_t
] \notag\\
&=
\dot\alpha_t
\mathbb E[X_0\mid X_t=x_t]
+
\dot\beta_t
\mathbb E[X_1\mid X_t=x_t].
\end{align}
$$

On the other hand, we have

$$
X_t=\alpha_t X_0+\beta_t X_1,
$$

which implies

$$
x_t
=
\alpha_t
\mathbb E[X_0\mid X_t=x_t]
+
\beta_t
\mathbb E[X_1\mid X_t=x_t].
$$

This gives

$$
\mathbb E[X_0\mid X_t=x_t]
=
\frac{
x_t
-
\beta_t
\mathbb E[X_1\mid X_t=x_t]
}{
\alpha_t
}.
$$

Substituting this into the velocity equation, we get

$$
\boxed{
v_t(x_t)
=
\frac{\dot\alpha_t}{\alpha_t}x_t
+
\left(
\dot\beta_t
-
\frac{\dot\alpha_t\beta_t}{\alpha_t}
\right)
\mathbb E[X_1\mid X_t=x_t]
}.
\tag{6}
$$

On to the second step. Let's differentiate (6) with respect to $$x_t$$.

Since the posterior is part of an exponential family with

$$
T(x_1)=\frac{\beta_t}{\alpha_t^2}x_1,
$$

we have

$$
\nabla_{x_t}
\mathbb E[X_1\mid X_t=x_t]
=
\frac{\beta_t}{\alpha_t^2}
\operatorname{Cov}(X_1\mid X_t=x_t).
\tag{7}
$$

After differentiating (6) and plugging (7) into it, we get

$$
\boxed{
\nabla_{x_t}v_t(x_t)
=
\frac{\dot\alpha_t}{\alpha_t}I
+
\left(
\dot\beta_t
-
\frac{\dot\alpha_t\beta_t}{\alpha_t}
\right)
\frac{\beta_t}{\alpha_t^2}
\operatorname{Cov}(X_1\mid X_t=x_t)
}.
\tag{8}
$$

Finally, using the strong log-concavity of the posterior and the Brascamp-Lieb inequality, we obtained earlier that

$$
\operatorname{Cov}(X_1\mid X_t=x_t)
\preceq
\frac{1}{
\kappa+\frac{\beta_t^2}{\alpha_t^2}
}I.
$$

Also notice that, under our interpolation assumptions,

$$
\left(
\dot\beta_t
-
\frac{\dot\alpha_t\beta_t}{\alpha_t}
\right)
\frac{\beta_t}{\alpha_t^2}
\geq 0,
$$

since $$\dot\beta_t>0$$, $$\dot\alpha_t<0$$, $$\alpha_t>0$$, and $$\beta_t\geq 0$$.

Therefore we can safely plug the covariance upper bound into (8), preserving the PSD inequality. Simplifying terms gives our desired control on $$Dv_t(x_t)$$:

$$
\begin{align}
\nabla_{x_t}v_t(x_t)
&\preceq
\frac{\dot\alpha_t}{\alpha_t}I
+
\left(
\dot\beta_t
-
\frac{\dot\alpha_t\beta_t}{\alpha_t}
\right)
\frac{\beta_t}{
\alpha_t^2\kappa+\beta_t^2
}I \notag\\
&=
\frac{
\alpha_t\dot\alpha_t\kappa
+
\beta_t\dot\beta_t
}{
\alpha_t^2\kappa+\beta_t^2
}I \notag\\
&=
\frac12
\frac{d}{dt}
\log\left(
\alpha_t^2\kappa+\beta_t^2
\right)I. \tag{9}
\end{align}
$$

From this, we can now go back to Grönwall and integrate (9) through time to get a bound on the Lipschitz constant of $$f_1$$.

Indeed, the infinitesimal separation between trajectories evolves according to the Jacobian $$\nabla v_t$$, so Grönwall gives

$$
\begin{align}
\operatorname{Lip}(f_1)
&\leq
\exp\left(
\int_0^1
\frac12
\frac{d}{dt}
\log(
\alpha_t^2\kappa+\beta_t^2
)\,dt
\right) \notag\\
&=
\sqrt{
\frac{
\alpha_1^2\kappa+\beta_1^2
}{
\alpha_0^2\kappa+\beta_0^2
}
} \notag\\
&=
\frac{1}{\sqrt{\kappa}},
\end{align}
$$

where we used

$$
(\alpha_0,\beta_0)=(1,0),
\qquad
(\alpha_1,\beta_1)=(0,1).
$$

And we're done! We now have the contraction bound

$$
\boxed{
\operatorname{Lip}(f_1)
\leq
\frac{1}{\sqrt{\kappa}}
}.
\tag{10}
$$

Equation (10) tells us that even though a flow model is the result of many consecutive ODE integrations, which we can think of roughly as a "very deep network," its input-output map does not need to be high-Lipschitz if the target distribution is strongly log-concave.

Moreover, the more pointy the target distribution is, the more contractive the input-output mapping becomes.
