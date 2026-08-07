---
layout: page
title: Vector-Time Flows
description: Generalizing stochastic interpolants to per-coordinate time schedules, and recovering in-painting as a special case.
date: 2026-07-07
tags: generative-modeling
math: true
---

The [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }}) framework can be generalized to per-coordinate time schedules as follows. Suppose that your data lives in $$x\in\mathbb{R}^d$$. Given Gaussian noise $$z\sim \mathcal{N}(0, \sigma^2 I)\in\mathbb{R}^d$$ and a simple linear Interpolant

$$
I_t := tx + (1-t)z,\ x\sim \mathcal{D},\ z\sim \mathcal{N}(0, \sigma^2 I),\ t\in[0, 1]
$$

we can think about the "generalized" Interpolant $$I_{\mathbf{t}}$$ where $$\mathbf{t} = (t_1, \dots, t_d)$$ is now a vector of _individual times per coordinate_. We can define $$I_{\mathbf{t}}$$ as

$$
I_{\mathbf{t}} = \mathbf{t}\odot x  + (1-\mathbf{t})\odot z,\ x\sim \mathcal{D},\ z\sim \mathcal{N}(0, \sigma^2 I), \ \mathbf{t}\in[0, 1]^d
$$

Now, instead of having time-marginals indexed by a scalar time $$\rho_t(x)$$, we now have a d-dimensional family of distributions $$\rho_{\mathbf{t}}$$ for every $$\mathbf{t}\in[0, 1]^d$$. One can then start thinking about tracing an arbitrary path $$\boldsymbol{\alpha}(\tau) := (t_1(\tau), \dots, t_d(\tau)),\ \tau\in\mathbb{R}$$ in this hypercube which essentially describes a family of marginals $$\rho_\tau(x)$$ indexed by the scalar $$\tau$$. What's the ODE for tracing such a path though?

The trick is to reduce the multi-dimensional time case to the original scalar time case with new time being $$\tau\in\mathbb{R}$$. To that end, notice that

$$
I_{\alpha(\tau)} = (I_t(x, z, t_1(\tau))_1, I_t(x, z, t_2(\tau))_2, \dots, I_t(x, z, t_d(\tau))_d) = \tilde{I}_{\tau}(x, z)
$$

where $$\tilde{I}_\tau$$ is just a scalar-time stochastic interpolant! Thus, learning the velocity field of the ODE that traces the marginals $$\rho_\tau(x)$$ boils down to learning

$$
b(\tau, x) = \mathbb{E}\Big[\partial_\tau \tilde{I}_\tau \mid \tilde{I}_\tau = x\Big]
$$

Let's take a closer look at $$\partial_\tau \tilde{I}_\tau$$; we find

$$
\partial_\tau \tilde{I}_\tau = \big(\partial_t I_t(x, z, t_1(\tau))_1 \frac{dt_1(\tau)}{d\tau} ,\dots , \partial_t I_t(x, z, t_d(\tau))_d \frac{dt_d(\tau)}{d\tau}\big) = \mathrm{diag}(D_\mathbf{t}I_{\mathbf{t}}) \odot \dot{\alpha}(\tau)
$$

where $$D_\mathbf{t}I_{\mathbf{t}}$$ is the Jacobian and $$\mathrm{diag}(\cdot)$$ is the function that pulls the diagonals. (Note that for the linear interpolant above, this diagonal is simply $$x - z$$ per coordinate, which makes the objective below concrete and immediately implementable.) This is perfect because for any path $$\alpha(\tau)$$, the time derivative $$\dot{\alpha}(\tau)$$ can be pre-computed (perhaps even analytically), and we can then have path-agnostic training according to objective

$$
\boxed{J(\theta) := \mathbb{E}_{\mathbf{t}\sim \mathrm{Unif}([0, 1]^d), x\sim \mathcal{D}, z\sim\mathcal{N}}\Big[\lVert\mathrm{diag}(D_\mathbf{t}I_{\mathbf{t}}) - b_\theta(\mathbf{t}, I_\mathbf{t})\rVert^2\Big]}
$$

In practice, the uniform distribution over the hypercube can be replaced by any distribution covering the deployment paths of interest; see below. Then, during inference, we can trace out any path $$\alpha(\tau)$$ we want by simply

$$
\boxed{b_\theta^\alpha (\tau, x) := b_\theta(\alpha(\tau), x) \odot \dot{\alpha}(\tau)}
$$

Note that any coordinate frozen along the path has $$\dot{\alpha}_i(\tau) = 0$$ and hence identically zero velocity; those coordinates simply do not move under the flow.

## Original Flow as a Special Case

You can easily see that the path in the time hypercube traced out by the original scalar-time flow map is just a straight line going from $$\mathbf{t}=0$$ to $$\mathbf{t}=1$$.

## In-Painting as a Special Case

In the previous section, we showed how we can learn a velocity field of an ODE that allows us to walk over an arbitrary path $$\alpha(\tau)$$ in the time hypercube $$[0, 1]^d$$. Given this new ability, in-painting becomes a special case where the coordinates we'd like to condition on sit at time $$t_i = 1$$ (fully visible) and the rest at $$t_i = 0$$ (pure noise). Without loss of generality, this corresponds to a path starting at one of the corners of the hypercube $$(1, \dots, 1, 0, \dots 0)$$ to our eventual final destination $$\mathbf{t}=1$$.