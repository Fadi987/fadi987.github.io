---
layout: page
title: "Itô to Epsilon: SDEs, Interpolants, and Tweedie Along the Way"
description: Deriving the diffusion process via Itô calculus, connecting it to Stochastic Interpolants, proving Tweedie's formula for score estimation, and recovering the denoising objective.
date: 2026-04-29
math: true
---

In this writeup, we'll be discussing generative modeling based on diffusion. What I hope to do is

1. Describe the mathematics behind diffusion generative modeling using the language of SDEs
2. Connect it with [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }}), and
3. Discuss how to estimate [The Score Function]({{ '/notes/score-function/' | relative_url }}), which is of central importance, leading me to
4. Discuss [Tweedie's Formula](https://en.wikipedia.org/wiki/Maurice_Tweedie#Tweedie's_formula), and connect it back to a result in [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }})
5. Comment on the simple but powerful [Law of the Unconscious Statistician](https://en.wikipedia.org/wiki/Law_of_the_unconscious_statistician). Finally,
6. Connect everything back to the good old denoising objective first introduced in diffusion


## Preliminaries on Itô Calculus

First, we'll start by defining what an Itô process is. An Itô process is simply a stochastic process of the form

$$
X_t = X_0 + \underbrace{\int_0^t F_sds}_{\text{Lebesgue Integral}} + \underbrace{\int_0^t G_sdW_s}_{\text{Itô Integral}} \tag{1}
$$

where $$F_t, G_t$$ are two stochastic processes of their own right with appropriate technical conditions to be integrable. The first integral is just a Lebesgue integral but with a random integrand $$F_t$$. Intuitively, we think of it as the "drift" as it introduces a directional bias into the motion of $$X_t$$. The second term is an Itô integral. We're not gonna go into too much technical detail but you can roughly think of an Itô integral as the $$\mathcal{L}^2$$ limit of the following quantity

$$
I_n = I(G_n) = \sum_{i}^n G_i (W_{i+1} - W_i)
$$

where $$G_n$$ is a simple piece-wise constant stochastic process that approximates $$G_s$$ over a partition of size $$n$$ of the interval $$[0, t]$$. And $$W_{i+1}-W_i \sim \mathcal{N}(0, \Delta t_i)$$ is independent of $$G_i$$. We then have

$$
I_n \xrightarrow[\text{Finer Partitions}]{n\rightarrow \infty, \ \ \mathcal{L}^2} \int_0^t G_sdW_s
$$

Ok, usually, it's easier to describe (1) using the notation

$$
dX_t = F_tdt + G_t dW_t\tag{2}
$$

we shouldn't assign meaning to the "differentials" in equation (2) other than being a notational convenience for equation (1). And intuitively, we think of (2) as describing a stochastic process that has drift $$F_t$$ and noise modulated by $$G_t$$.

Now, one important fact is that, under mild regularity assumptions, the Itô Integral can be thought of as a real-time variance-modulation of the Brownian motion $$W_t$$. And so, (almost) no matter what $$G_t$$ is, the mean will remain $$0$$. And the variance can be computed using what's called the Itô Isometry:

$$
\mathbb{E}\Big[\Big(\int_0^t G_sdW_s\Big)^2\Big] = \mathbb{E}\Big[\int_0^t G_s^2ds\Big] = \int_0^t\mathbb{E}[G_s^2]ds \tag{3}
$$

where we turned a wieldy Itô integral into a much more familiar Lebesgue integral! We'll use these properties later in our calculations.

Ok, one final ingredient is Itô's rule, which can be thought of as the chain rule for stochastic calculus. Let $$X_t$$ be an Itô process, and let $$u(X_t, t)$$ be a function with mild regularity conditions, then $$u_t := u(X_t, t)$$ is also an Itô process and Itô's rule gives us the drift and diffusion coefficients of $$u_t$$ by

$$
du_t = \partial_t u(t, X_t)dt + \partial_x u(t, X_t)dX_t + \frac{1}{2}{\partial_{x, x}u(t, X_t)(dX_t)^2}
$$

This equation looks exactly like the regular chain rule except for the last term. And again, when we do something like $$(dX_t)^2$$, it's just a notational convenience to describe $$u_t$$. Practically, what happens is

$$
(dX_t)^2 = (F_tdt + G_tdW_t)(F_tdt + G_tdW_t) = \underbrace{(\dots)(dt)^2}_0 + \underbrace{(\dots)(dt)(dW_t)}_0 + G_t^2(dW_t)^2 = G_t^2 dt
$$

where all of the terms went to $$0$$ because they're "small" except for $$(dW_t)^2 \rightarrow dt$$. The intuition is that Brownian motion's standard deviation, roughly its size, grows like $$\sqrt{t}$$, in other words

$$
dW_t\sim \mathcal{N}(0, dt) =\sqrt{dt}\mathcal{N}(0, 1)
$$

and $$\sqrt{dt} \gg dt$$ for small $$dt \ll 1$$. And so when you square it, it doesn't vanish but reduces to a term that's on the order of $$dt$$. Of course, none of the above discussion of Itô's rule is strictly rigorous but is meant merely to build intuition.

## SDE Description of Diffusion

Now that we discussed Itô calculus, it's time to describe the diffusion process. Given an image $$X_0\sim \rho$$ taken from the distribution of images, we noise it, destroying information, through what's called the [OU process](https://en.wikipedia.org/wiki/Ornstein%E2%80%93Uhlenbeck_process), which is an Itô process that generally takes the form

$$
dX_t = \theta(\mu - X_t)dt + \sigma dW_t
$$

Notice two things, (1) the drift term is described in terms of $$X_t$$ itself, this is why this is a Stochastic Differential Equation. (2) As time goes by, the drift term $$\theta(\mu - X_t)$$ acts like a rubber band pulling $$X_t$$ around $$\mu$$ so that it keeps circling in its orbit. In diffusion, the typical parameters usually chosen are $$\theta = 1, \mu = 0, \sigma = \sqrt{2}$$ for reasons that'll become clear shortly resulting in:

$$
dX_t = -X_t dt + \sqrt{2}dW_t \tag{4}
$$

Now, let's try to solve this equation. Without diving too much into the theory of SDEs, we should know that, under mild conditions, SDEs have unique solutions. However (4) is such a simple SDE that we can come up with an explicit solution. Our ansatz will be

$$
X_t = X_0e^{-t} + \sqrt{2}e^{-t}\int_0^t e^sdW_s = X_0e^{-t} + \sqrt{2}e^{-t} Y_t
$$

where $$dY_t = e^tdW_t$$. We expressed $$X_t$$ in terms of $$Y_t$$ so that we can use Itô's rule!

$$
\begin{align}
dX_t &=\partial_t X(t, Y_t)dt + \partial_y X(t, Y_t)dY_t + \overbrace{\partial_{y, y}X(t, Y_t)}^0 (dY_t)^2 \notag \\
&=-(X_0e^{-t} + \sqrt{2}e^{-t}Y_t)dt + \sqrt{2}e^{-t}dY_t \notag \\
&=-X_tdt +\sqrt{2}e^{-t}e^tdW_t \notag \\
&= -X_tdt + \sqrt{2}dW_t \notag \\
\end{align}
$$

which checks out. Ok, excellent, so now we have an explicit expression for the solution

$$
X_t = X_0e^{-t} + \sqrt{2}e^{-t}\int_0^t e^sdW_s \tag{5}
$$

Let's compute some of its properties

$$
\begin{align}
\mathbb{E}[X_t] &= \mathbb{E}[X_0e^{-t}] + \mathbb{E}\Big[\sqrt{2}e^{-t}\int_0^t e^sdW_s\Big]\notag\\
&= \mu_0 e^{-t} + \sqrt{2}e^{-t}\underbrace{\mathbb{E}\Big[\int_0^t e^sdW_s\Big]}_0 \notag\\
&= \mu_0e^{-t}\xrightarrow[]{t\rightarrow\infty} 0\notag
\end{align}
$$

As for the variance

$$
\begin{align}
\mathrm{Var}(X_t) &= \mathrm{Var}(X_0e^{-t}) + \mathrm{Var}\Big(\sqrt{2}e^{-t}\int_0^te^sdW_s\Big)\notag\\
&= e^{-2t} \sigma_0^2 + 2e^{-2t}\mathbb{E}\Big[\Big(\int_0^te^sdW_s\Big)^2\Big] \underbrace{=}_{\text{Itô Isometry}}  e^{-2t}\sigma_0^2 + 2e^{-2t} \int_0^t e^{2s}ds\notag\\
&= e^{-2t} \sigma_0^2 + 2e^{-2t}\frac{e^{2t}-1}{2}\notag\\
&= e^{-2t} \sigma_0^2 + (1-e^{-2t})\xrightarrow{t\rightarrow \infty}1
\end{align}
$$

And so as $$t\rightarrow\infty$$, the distribution of $$X_t$$ converges to $$\mathcal{N}(0, 1)$$. This is precisely why we chose $$\sigma = \sqrt{2}$$: it makes the stationary variance exactly $$1$$, so that the limiting distribution is a standard Gaussian $$\mathcal{N}(0, 1)$$. And for any $$t$$, the distribution is exactly

$$
X_t \overset{d}{=} X_0e^{-t} + \sqrt{1-e^{-2t}}Z, \ Z\sim\mathcal{N}(0, 1) \tag{6}
$$

## Connection To Stochastic Interpolants

Equation (6) is very important, because it describes the time-dependent marginal distribution of the flow, which is the central quantity in generative modeling. In fact, we can connect (6) to [Stochastic Interpolants]({{ '/notes/stochastic-interpolants/' | relative_url }}) in finite time by re-parametrizing time as $$t = -\mathrm{log}(\tau)$$ so we get

$$
Y_\tau = X_{-\mathrm{log}(\tau)} = Y_1\tau + \sqrt{1-\tau^2}Z = Y_1\tau + \sqrt{1-\tau^2}Y_0 = I(Y_0, Y_1, \tau)
$$

which is nothing but an interpolant with $$\alpha_\tau = \tau, \beta_\tau = \sqrt{1-\tau^2}, \gamma(\tau) = 0$$, and notice that as $$t$$ goes $$0\rightarrow \infty$$, $$\tau$$ goes $$1\rightarrow 0$$. The punchline here is that we were able to replicate the marginal distributions of the diffusion process in finite time as a special case of a Stochastic Interpolant!

## Estimation of the Score Function and Tweedie's Formula

Stepping back, a crucial quantity that we need to estimate is the time-dependent score function. The score function is a distribution-only-dependent quantity, so we might as well focus on equation (6). Further, let's drop the time variable for simplicity. Then equation (6) is of the form

$$
Y = Y_0 + \gamma Z, \ Y:= X_t, Y_0 := X_0e^{-t}, \gamma = \sqrt{1-e^{-2t}}
$$

Notice that this setup seems familiar. In fact, we've seen it before in the [Score Function Estimation]({{ '/notes/score-function/#score-function-estimation' | relative_url }}) section, back then, we just mentioned that the proof was in the paper and was based on Fourier Transforms. In this writeup, we'll dig deeper as it turns out this is a case of the important Tweedie's Formula.

Ok, now to estimate the score, we start with

$$
\mathcal{L}(\theta) = \mathbb{E}_Y\Big[\lVert s_\theta(Y) - \nabla_y \mathrm{log}(p(Y))\rVert^2\Big] \tag{7}
$$

Tweedie's formula gives the claim that minimizing (7) is equivalent to minimizing

$$
\mathcal{L}^*(\theta) =  \mathbb{E}_{Y_0, Z}\Big[\lVert s_\theta(Y) - \nabla_y \mathrm{log}(p(Y \mid Y_0))\rVert^2\Big] \tag{8}
$$

Equation (8) is very important, because unlike (7), where the score of $$p(Y)$$ could in general be intractable, the conditional $$Y \mid Y_0$$ is just a Gaussian and so its formula is given in explicit form.

So let's prove it. One way to prove equivalence of minimization with respect to $$\theta$$ is to take $$\partial_\theta$$ in both equations and prove that they're equal. Let's take (7) and differentiate. Up to the same constant, we'll get two terms. The first one is

$$
\mathbb{E}_Y\Big[\nabla_\theta s_\theta(Y) s_\theta(Y)\Big] = \mathbb{E}_{Y_0, Z}\Big[\nabla_\theta s_\theta(Y) s_\theta(Y)\Big]
$$

where we used the fact that $$Y = Y_0 + \gamma Z$$ is a deterministic function of $$(Y_0, Z)$$, so any expectation over $$Y$$ can be rewritten as an expectation over $$(Y_0, Z)$$ via change of variables. Now the second term is

$$
\begin{align}
\mathbb{E}_Y\Big[ \nabla_\theta s_\theta(Y) \nabla_y\mathrm{log}(p(Y))\Big] &= \int \nabla_\theta s_\theta(y) p(y) \frac{\nabla_y p(y)}{p(y)}dy  \\
&= \int \nabla_\theta s_\theta(y) \nabla_yp(y)dy = \int \nabla_\theta s_\theta(y) \nabla_y \Big(\int p(y \mid y_0)p_0(y_0)dy_0\Big) dy \notag\\
&= \int\int \nabla_\theta s_\theta(y) \nabla_y p(y \mid y_0) p_0(y_0)dy_0dy\notag\\
&= \int\int \nabla_\theta s_\theta(y) \frac{\nabla_yp(y \mid y_0)}{p(y \mid y_0)}p(y, y_0)dy_0dy\notag \\
&= \mathbb{E}_{Y, Y_0}\Big[\nabla_\theta s_\theta(Y) \nabla_y \mathrm{log}(p(Y \mid Y_0))\Big] = \mathbb{E}_{Y_0, Z}\Big[\nabla_\theta s_\theta(Y) \nabla_y \mathrm{log}(p(Y \mid Y_0))\Big]
\end{align}
$$

and we're done! This proves it.

## Reparametrizing Expectations Across Coupled Variables

Notice how freely we toggled between expectations over different subsets of variables in the proof above. The underlying principle is simple: $$Y = Y_0 + \gamma Z$$ means the joint distribution of $$(Y, Y_0, Z)$$ is supported on a 2D submanifold of $$\mathbb{R}^3$$, parametrized by any two of the three variables. Since knowing any two determines the third uniquely, any expectation over a function of one subset can equivalently be computed by integrating over any other subset. For instance, we toggled $$(Y, Y_0) \rightarrow (Y_0, Z)$$ and $$Y \rightarrow (Y_0, Z)$$ without changing the value of the expectation. This is a measure-theoretic fact about deterministic functional relationships between random variables, and it's what does the heavy lifting in both terms of the proof. You should convince yourself that this toggling makes intuitive sense: we're essentially looking at the same expectation but from different "coordinate" systems.

## Going All the Way Back to the Denoising Objective

From the above discussion, we know that we can estimate the score using

$$
\mathcal{L}^*(\theta) = \mathbb{E}_{Y_0, Z}\Big[\lVert s_\theta(Y) - \nabla_y\mathrm{log}(p(Y \mid Y_0))\rVert^2\Big]
$$

and as we said, the conditional is nothing but a Gaussian with mean $$Y_0$$ and variance $$\gamma^2$$ and so you can easily check that

$$
\nabla_y \mathrm{log}(p(Y \mid Y_0)) = -\frac{Y-Y_0}{\gamma^2} = -\gamma^{-1}Z
$$

This confirms two things. First, it confirms that the optimal $$s_\theta(Y)$$, which is the score function, is nothing but $$-\gamma^{-1}\mathbb{E}[Z \mid Y]$$, the same result we derived in [The Score Function]({{ '/notes/score-function/' | relative_url }}) via a completely different route. There, the proof relied on Fourier transforms; here, we arrived at the same formula through gradient-equivalence and the conditioning trick of Tweedie. The fact that two independent derivations converge on the same conditional-expectation formula suggests the result is robust and fundamental; it doesn't depend on Fourier machinery, just on the structure of the Gaussian perturbation.

And second, we can re-parametrize the score model as

$$
s_\theta(y) = \frac{\epsilon_\theta(y)}{\gamma}
$$

and the objective $$\mathcal{L}^*$$ would reduce to predicting the noise $$Z$$ via $$\epsilon_\theta(y)$$! And we're back to the original denoising objective first introduced in diffusion!
