---
layout: page
title: Eulerian & Lagrangian Views
description: A mathematical perspective on toggling between Eulerian and Lagrangian formulations in dynamical systems, and the conditions under which this is valid.
date: 2026-04-16
math: true
---

What is an Eulerian formulation and what is a Lagrangian formulation? We hear the perspective that an Eulerian formulation is about "flows" where you focus on a specific point in space and watch the water flow through it in time. But I have another perspective that is more mathematical. So, we're dealing with dynamical systems. In full generality, we have two variables $$x, t$$. The Eulerian formulation treats these two variables as independent. Thus, Eulerian relationships are typically of the form

$$
f(x, t) = 0
$$

for some function $$f: [0, T]\times \mathbb{R}^d \rightarrow \mathbb{R}$$ like for example the transport equation

$$
\partial_t p_t(x) + \nabla\cdot (p_t b(t, x)) = 0
$$

On the other hand, the Lagrangian view couples $$x$$ with $$t$$ and the coupling is done by thinking of $$x$$ as a function of $$t$$ as in $$x(t)$$, which represents the trajectory of a particle as it moves in time. This can typically take the form

$$
g(t) = 0
$$

for some function $$g: \mathbb{R} \rightarrow \mathbb{R}$$.

Now, in many cases, we toggle between these two modes of view. But how? And under what conditions? I'll focus on the case of Continuous Normalizing Flows (CNFs) because it's one case where the conditions for toggling are satisfied.

From the Eulerian view, we have a relation

$$
f(x, t) = 0
$$

which holds for all pairs $$(x, t)$$. Now, given such arbitrary pair $$(x, t)$$, and this is the first condition, we can reverse the ODE back in time to arrive at some initial condition $$x_0$$. A particle starting at $$x_0$$ according to the ODE will arrive to $$x$$ at time $$t$$. So by representing $$x = X(t, x_0)$$, we can write the same equation in the Lagrangian view

$$
f(X(t, x_0), t) = g(t) = 0
$$

Ok, but what's the point? The point is that now we can take the total derivative with respect to time $$d/dt$$ and get something like

$$
\dot{g}(t) = \partial_t f + \partial_x f \dot{X} = 0
$$

Now, we can't toggle back to the Eulerian view just yet because the object $$\dot{X}$$ doesn't make sense there! However, in CNF, and this is the second condition, we know that

$$
\dot{X} = v_\theta(X, t)
$$

And so we plug in to get

$$
\partial_t f(X, t) + \partial_x f(X, t) v_\theta(X, t) = h(X, t) = 0
$$

So notice crucially that at the end we obtained an equation that is only a function of $$X, t$$.

Now, for the final logical step, we say that since this holds for any pair $$(X, t)$$, the Eulerian version of this equation also holds meaning

$$
h(x, t) = 0
$$

The end result of this technique is to derive $$h(x, t) = 0$$ from $$f(x, t) = 0$$.

All of this is to clarify what we mean by "toggling" the Eulerian and Lagrangian view. Mathematically, it is to

1. Have an equation like $$f(x, t) = 0$$
2. Think of $$x = X(x_0, t)$$ for some $$x_0$$
3. Express $$f(X(t, x_0), t) = g(t) = 0$$
4. Take total derivative along path particle $$\dot{g}(t)$$ which is a function of $$t, \dot{X}$$
5. Express $$\dot{X}$$ in terms of $$X, t$$ again to get $$\dot{g}(t) = h(X, t) = 0$$
6. Argue that since steps (1-5) above happen for arbitrary $$(x, t)$$, then $$h(x, t) = 0$$ for all $$(x, t)$$

But notice that there are conditions for this argument to work. It cannot happen arbitrarily. One condition is that for every pair $$(x, t)$$ you can find a particle that passes through $$x$$ at time $$t$$. A second, very important condition, is the ability to express $$\dot{X}$$ back in terms of $$x, t$$. This is not always the case. In fact, this means that the velocity vector at $$(x, t)$$ must be the same for any trajectory passing through it! While this is true for CNFs, it is not true, say, for stochastic Interpolants, where the sample-path velocity at $$(x, t)$$ depends on which realization you're on. In that case, we won't be able to do this nimble toggling to derive, say, the transport equation. Instead, we'll have to rely on Fourier Transforms!
