---
layout: page
title: Unifying Flow Matching and Stochastic Interpolants
description: How conditioning on both endpoints extends Flow Matching beyond Gaussian sources and recovers the Stochastic Interpolants objective.
date: 2026-04-27
math: true
---

## Preliminaries on Flow Matching

In the original [Flow Matching paper](https://arxiv.org/pdf/2210.02747), the authors propose the methodology to learn the velocity field $$\mu_t(x)$$ of a [Continuous Normalizing Flow]({{ '/notes/continuous-normalizing-flows/' | relative_url }}) to bridge a probability distribution $$p(x)$$ that's easy to sample from to a more complex distribution $$q(x)$$. As a first approach, they parametrize the velocity vector field $$v_\theta(t, x)$$ and introduce the objective

$$
\mathcal{L}(\theta) = \mathbb{E}_{t, x\sim p_t(x)}\Big[\lVert v_\theta(t, x) - \mu_t(x)\rVert^2\Big] \tag{1}
$$

but of course, as it stands, this objective is intractable—not just because $$\mu_t(x)$$ is hard to evaluate, but more fundamentally because $$p_t(x)$$ isn't even specified. We have no path connecting $$p$$ to $$q$$ to begin with. The methodology will simultaneously specify the path and make the objective tractable.

To circumvent this issue, the main insight is to condition on a specific target particle $$x_1$$. Now that we've conditioned on $$x_1$$, we can think about specifying the much simpler conditional probability path $$p_t(x \mid x_1)$$ with the boundary conditions $$p_0(x \mid x_1) = p(x)$$ and $$p_1(x \mid x_1)$$ is the density of $$\mathcal{N}(x_1, \sigma_{\min})$$. By defining

$$
p_t(x):= \int p_t(x \mid x_1)q(x_1)dx_1
$$

and given a small enough $$\sigma_{\min}$$, we should expect that $$p_1(x) \sim q(x)$$. And of course we always have $$p_0(x) = p(x)$$, and thus $$p_t(x)$$ is a valid probability path between $$p(x)\rightarrow q(x)$$. Next, let's try to connect $$\mu_t(x \mid x_1)$$, the velocity vector field of the conditional probability flow, with $$\mu_t(x)$$. We'll do that by looking at the Transport Equation. We know that the conditional probability flow is a valid deterministic flow so it respects the Transport Equation and we have

$$
\partial_t p_t(x \mid x_1) + \nabla \cdot (p_t(x \mid x_1)\cdot \mu_t(x \mid x_1)) = 0
$$

let's multiply both sides by $$q(x_1)$$ and integrate, we get

$$
\int \partial_t p_t(x \mid x_1)q(x_1)dx_1 + \int \nabla\cdot (p_t(x \mid x_1)\cdot \mu_t(x \mid x_1))q(x_1)dx_1 = 0
$$

Since each conditional path $$p_t(x \mid x_1)$$ is a valid transport with its own velocity field, the marginalization goes through cleanly. By exchanging the integral with the partial derivatives and using the definition of $$p_t(x)$$ we get

$$
\begin{align}
0 &= \partial_t p_t(x) + \nabla \cdot \int \mu_t(x \mid x_1) p_t(x \mid x_1)q(x_1)dx_1\\
&= \partial_t p_t(x) + \nabla \cdot\Big(p_t(x) \int \mu_t(x \mid x_1) \frac{p_t(x \mid x_1)q(x_1)}{p_t(x)}dx_1 \Big)\\
&= \partial_t p_t(x) + \nabla \cdot(p_t(x) \mu_t(x))
\end{align}
$$

which gives

$$
\mu_t(x) = \int \mu_t(x \mid x_1) \frac{p_t(x \mid x_1) q(x_1)}{p_t(x)}dx_1
$$

Now, even with this, we still have a problem because the integral to compute $$\mu_t(x)$$ is still intractable. The final step is to simplify objective (1) into a conditional version like so

$$
\mathcal{L}^*(\theta) =\mathbb{E}_{t, q(x_1), x\sim p_t(x \mid x_1)}\Big[\lVert v_\theta(x, t) - \mu_t(x \mid x_1)\rVert^2\Big]
$$

This is a simple exercise. Take the gradient $$\nabla_\theta$$, expand the square, manipulate the integrals, and use the relations we already derived connecting conditional to unconditional quantities. To prove that $$\nabla_\theta \mathcal{L}^* = \nabla_\theta \mathcal{L}$$, and thus they only differ by a constant and have the same minimizer. We're then left with $$\mathcal{L}^*(\theta)$$ which is expressed solely in terms of conditional quantities $$p_t(x \mid x_1), \mu_t(x \mid x_1)$$ which are easy to compute.

The last step is to specify $$p_t(x \mid x_1)$$. The authors suggest a very simple choice. They designate $$p_t(x \mid x_1)$$ to be the push-forward measure of $$p(x_0)$$ through the following map

$$
\psi_{x_1}(t, x) = \mu(t, x_1) + \sigma(t, x_1)x
$$

where the following boundary conditions should be respected $$\mu(0, x_1) = 0, \mu(1, x_1) = x_1$$ and $$\sigma(0, x_1) = 1, \sigma(1, x_1) = \sigma_{\min}$$. Note that $$\sigma(0) = 1$$ because at $$t=0$$ the conditional distribution is $$\mathcal{N}(\mu(0, x_1), \sigma(0, x_1)) = \mathcal{N}(0, 1)$$, which is the Gaussian source $$p(x)$$. Finally, $$x\sim\mathcal{N}(0, 1)$$. And such a map is defined per value of $$x_1$$.

Given this very simple conditional deterministic transport of $$x_0$$, we can easily see that the conditional velocity field is nothing but the time derivative of $$\psi$$, so the objective turns to

$$
\mathcal{L}^*(\theta) = \mathbb{E}_{t, x_1, x}\Big[\lVert v_\theta(\psi_{x_1}(t, x), t) - \partial_t \psi_{x_1}(t, x) \rVert^2\Big]
$$

where

$$
\partial_t \psi_{x_1}(t, x) = \partial_t \mu(t, x_1) + \partial_t \sigma(t, x_1) x
$$

we are free to choose $$\mu(t, x_1), \sigma(t, x_1)$$ as we like as long as they satisfy the boundary conditions and are easily computable.

And that's it! That's the essence of the methodology behind the original Flow Matching paper.

## Bridging Flow Matching with Stochastic Interpolants

As the Flow Matching framework stands now, there's one limitation. Namely, the distribution $$p(x)$$ has to be Gaussian. That's because the entire methodology relies on the fact that the conditional probability paths $$p_t(x \mid x_1)$$ morph into Gaussian distributions concentrated around $$x_1$$ with standard deviation $$\sigma_{\min}$$. And if we start with a non-Gaussian distribution $$p(x)$$, then, in general, the difficulty of morphing such a distribution into a Gaussian could be as difficult as an arbitrary sampling problem for an arbitrary distribution $$p(x)$$!

So then what's the solution? The solution is to condition further! Let's, instead of only conditioning on $$x_1$$, condition on the pair $$(x_0, x_1)$$. And let's translate all of the conditional quantities we constructed above. First, let's start with $$p_t(x \mid x_0, x_1)$$, the most reasonable thing to do is let $$p_0(x \mid x_0, x_1), p_1(x \mid x_0, x_1)$$ represent a Gaussian centered at $$x_0, x_1$$ respectively with very low width. Then if we define

$$
p_t(x) := \int\int p_t(x \mid x_0, x_1) p(x_0)q(x_1) dx_0dx_1
$$

we can easily see that in the limit where $$p_0(x \mid x_0, x_1) = \delta(x-x_0), p_1(x \mid x_0, x_1) = \delta(x-x_1)$$, we have

$$
p_0(x) = p(x),\  p_1(x) = q(x)
$$

Ok, great, using similar reasoning as above, we can also find that

$$
\mu_t(x) = \int\int \mu_t(x \mid x_0, x_1) \frac{p_t(x \mid x_0, x_1)p(x_0)q(x_1)}{p_t(x)}dx_0 dx_1
$$

And, similarly, conditioned on $$x_0, x_1$$, we can define the following diffeomorphism

$$
\psi_{x_0, x_1}(t, x) = \mu(t, x_0, x_1) + \sigma(t, x_0, x_1) x
$$

where $$\mu(0, x_0, x_1) = x_0, \mu(1, x_0, x_1) = x_1$$ and $$\sigma(t, x_0, x_1) = \sigma(t)$$ gets small at the edges $$t=0, 1$$. Note the difference from before: in flow matching, $$\sigma(0) = 1$$ because we _want_ the conditional distribution at $$t=0$$ to be the Gaussian source. Here, both endpoints are arbitrary, so $$\sigma$$ must shrink to zero (in the limit) at both ends to recover the marginal distributions. Finally, just like before $$x\sim \mathcal{N}(0, 1)$$. But hold on, let's rename $$x$$ to $$z$$, $$\mu$$ to $$I$$, and $$\sigma(t)$$ to $$\gamma(t)$$, and we have indeed recovered our Stochastic Interpolant!

$$
\psi_{x_0, x_1}(t, z) = I_t = I(t, x_0, x_1) + \gamma(t) Z
$$

Finally, let's look at the objective, it should now be

$$
\begin{align}
\mathcal{L}^*(\theta) &= \mathbb{E}_{t, x_0, x_1, x}\Big[\lVert v_\theta(\psi_{x_0, x_1}(t, x), t) - \partial_t \psi_{x_0, x_1}(t, x) \rVert^2\Big]\\
&= \mathbb{E}_{t, x_0, x_1, z}\Big[\lVert v_\theta(I_t(x_0, x_1, z), t) - \partial_t I_t(x_0, x_1, t)\rVert^2\Big]
\end{align}
$$

which is nothing but the [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }}) objective!

## Conclusion

The Flow Matching methodology tries to decompose the original probability path $$p_t(x)$$ into a collection of conditional probability paths $$p_t(x \mid x_1)$$ which are tractable. Though by conditioning only on one endpoint $$x_1$$, we restrict ourselves to having the ability to bridge only Gaussian distributions. To bridge two arbitrary distributions, we condition further on the pair $$(x_0, x_1)$$. For every such pair, we then construct a deterministic transport which is nothing but the Stochastic Interpolant $$I_t$$ and the objective function turns out to be mathematically equivalent! In other words, the Stochastic Interpolant can be thought of as a conditional deterministic transport.

One final note: throughout this write-up we sampled $$(x_0, x_1)$$ from the product coupling $$p(x_0)q(x_1)$$. But the full stochastic interpolants framework allows arbitrary couplings $$\rho(x_0, x_1)$$, including non-product couplings. So double conditioning doesn't just let us start from non-Gaussians—it also lets us impose arbitrary couplings between source and target.
