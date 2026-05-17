---
layout: page
title: Optimality Conditions in Finite and Infinite Dimensions
description: Deriving necessary and sufficient conditions for local optima, from unconstrained and constrained finite-dimensional problems to infinite-dimensional optimization.
date: 2026-05-16
tags: optimization optimal-control
math: true
---

## Part 1: A Foundational Note on Derivatives

### Derivatives and Taylor Expansions in 1D

Given a function $$f:\mathbb{R}\rightarrow\mathbb{R}$$, we define the derivative at a point $$x_0$$ to be

$$
f^\prime(x_0) = \lim_{h\rightarrow 0} \frac{f(x_0 + h) - f(x_0)}{h}
$$

which you can easily check is equivalent to

$$
f(x_0+h) = f(x_0) + f^\prime(x_0)h + o(h)
$$

In other words, in 1D, *a function being differentiable at a point $$x_0$$ is equivalent to admitting a first-order Taylor expansion at that point*.

For higher order, this equivalence breaks down. If a function is twice-differentiable, then it does admit a second-order Taylor expansion

$$
f(x_0 + h) = f(x_0) + f^\prime(x_0)h + \frac{1}{2}f^{\prime\prime}(x_0)h^2 + o(h^2)
$$

but the reverse is not true. The most obvious way to see it is that a Taylor expansion is always a point-wise property, it describes an approximation of a function $$f$$ around a single point $$x_0$$ and the only requirement is for $$f$$ to be defined in the neighborhood of $$x_0$$ and for the approximation to hold. However, being twice-differentiable, or $$k$$-differentiable in general, requires the $$(k-1)$$-th derivative to exist not only at $$x_0$$, but in the neighborhood of $$x_0$$. It's because the $$k$$-th derivative is defined in terms of a limit of $$f^{k-1}(x_0)$$

$$
f^{k}(x_0):= \lim_{h\rightarrow 0}\frac{f^{k-1}(x_0+h)-f^{k-1}(x_0)}{h}
$$

**To summarize**: In the 1D case, being 1-differentiable and admitting a first-order Taylor expansion are equivalent. Whereas for $$k>1$$, being $$k$$-differentiable implies a $$k$$-th order Taylor expansion but the reverse doesn't hold.

### Multivariate First Derivatives

Ok, now moving on to high-dimensions, and focusing only on the first derivatives. It turns out that defining even a first derivative gets messy. As a first extension, define directional derivatives as

$$
\partial_{x_i}f(x_0) = \lim_{h\rightarrow 0}\frac{f(x_0 + he_i)-f(x_0)}{h}
$$

then we can declare a function to be differentiable if and only if all of its partial derivatives exist. Notice that this is equivalent to admitting a Taylor expansion in the unit directions

$$
f(x_0 + he_i) = f(x_0) + \partial_{x_i}f(x_0) h + o(h) \tag{1}
$$

But, does the existence of partial derivatives imply admitting a Taylor expansion in an arbitrary direction $$d$$? In other words, does there exist some scalar $$L_{x_0}(d)$$ such that

$$
f(x_0 + hd) = f(x_0) + L_{x_0}(d) h + o(h) \tag{2}
$$

The answer is no! Note that (2) is equivalent to the following limit existing

$$
L_{x_0}(d) := \lim_{h\rightarrow 0}\frac{f(x_0 + hd)-f(x_0)}{h}
$$

As a counter example, consider the function

$$
f(x, y) =
\begin{cases}
1 & x=0 \text{ or } y=0\\
0 & \text{ otherwise}
\end{cases}
$$

then you can check that along any of the unit directions, the function is constant and thus admits a partial derivative but if we approach the origin through, say, the diagonal, then the function is discontinuous and thus doesn't admit a directional derivative!

The notion of a directional derivative as in (2) is actually very important and will become more important when we move to infinite-dimensional vector spaces. It's called a **Gateaux Derivative**. In the loosest notion of a Gateaux derivative, $$L_d$$ can be any arbitrary function of $$d$$ as long as it exists. There are stricter notions though where we require $$L_d$$ to be linear in $$d$$. Why? To get some intuition, remember that in the most regular case (which is stronger than being Gateaux differentiable), this is what we called the directional derivative $$\nabla_x f(x_0)\cdot d$$ which is linear in $$d$$.

Now, do note that Gateaux differentiability can't be the strongest notion of differentiability that we're used to in undergrad multivariable calculus. It doesn't even imply continuity! For example, take the function

$$
f(x, y) =
\begin{cases}
1 & y = x^2, x\neq 0\\
0 & \text{ otherwise }
\end{cases}
$$

You can convince yourself that this function is Gateaux differentiable along every direction. In fact, for any direction $$d$$, and for small enough $$h$$, it's a constant function of $$0$$. Thus, $$L_d = 0$$ is even linear in $$d$$. However, if we approach the origin along the *curve* $$y=x^2$$, the function is not continuous! This brings us to the strongest notion of differentiability, **Frechet Differentiability**. It can be defined in two ways. The first way is to admit a Taylor expansion like so

$$
f(x_0+\eta) = f(x_0) + L_{x_0}(\eta) + o(\lVert\eta\rVert)
$$

where $$L$$ is a linear operator. This is equivalent to the following limit existing

$$
\lim_{\lVert\eta\rVert\rightarrow 0}\frac{\lvert f(x_0+\eta)-f(x_0)-L_{x_0}(\eta)\rvert}{\lVert\eta\rVert} = 0
$$

Notice two things. First, this definition does imply continuity because the limit must exist no matter how we approach $$x_0$$. Second, it's the first derivative that is norm-dependent. Other definitions didn't even require us to define a norm! And in fact, this is the definition that we're used to in multivariate calculus. When I first took the class as an undergrad these distinctions I presented here were swept under the rug. However, such distinctions will be extremely important when we move to infinite dimensions. Especially that, while the choice of the norm doesn't matter for finite dimensions because finite-dimensional vector spaces have equivalent norms up to a constant, the choice of the norm will be infinitely more important in infinite dimensions (no pun intended ;))

## Part 2: Finite Dimensional Optimization

With the hierarchy of derivatives in hand, we can now ask: what do these derivatives tell us about optima?

### Necessary Conditions for Unconstrained Optimization

#### Interior Local Optima

Let $$f: \mathbb{R}^n \rightarrow \mathbb{R}$$, our first task will be to derive first- and second-order necessary conditions for a local optimum. But first, let's define what a local optimum is.

**Def.** We say that a point $$x^*$$ is a local minimum if there exists $$\epsilon > 0$$ such that for any $$x\in\mathbb{B}_\epsilon(x^*)$$ we have $$f(x) \geq f(x^*)$$. (For a local maximum, flip the inequality. We'll work with minima throughout; the maximum case is symmetric.)

Ok, to derive the first order condition, define $$g(\alpha) := f(x^* + \alpha d)$$ for some direction $$d\in\mathbb{R}^n$$. If we assume that $$f\in\mathcal{C}^1$$, then we have by a Taylor expansion:

$$
g(\alpha) = g(0) + g^\prime(0) \alpha + o(\alpha) = f(x^*) + (\nabla_x f(x^*) \cdot d)\alpha + o(\alpha)
$$

Assume by contradiction that $$\nabla_x f(x^*) \neq 0$$ and choose $$\alpha$$ small enough such that

$$
\lvert o(\alpha)\rvert < \lvert\alpha\rvert \lvert\nabla_x f(x^*)\cdot d\rvert, \ \mathrm{sign}(\alpha) = -\mathrm{sign}(\nabla_x f(x^*)\cdot d)
$$

then we get that

$$
g(\alpha) - g(0) = (\nabla_x f(x^*) \cdot d)\alpha + o(\alpha) < 0
$$

which is a contradiction. Since $$d\in\mathbb{R}^n$$ is arbitrary we conclude the first order necessary condition

$$
\boxed{\nabla_xf(x^*) = 0}
$$

Now, for the second order condition, assume that $$f\in\mathcal{C}^2$$. Do a second-order Taylor expansion. Assume that the gradient is $$0$$ which you can because we just proved it. Come up with a similar argument as above to conclude that the Hessian is Positive-Semi-Definite (PSD)

$$
\boxed{\nabla_x^2f(x^*) \succeq 0}
$$

#### Boundary Local Optima

All of the analysis above is true given that the domain of $$f$$, call it $$D$$, is either $$D=\mathbb{R}^n$$ or $$x^*$$ is an interior point of $$D$$. On the other hand, if $$D$$ has a boundary and $$x^*$$ is on the boundary, we may not be able to move away from $$x^*$$ in all directions $$d$$. Therefore we define

**Def.** A direction $$d$$ is called a *feasible* direction if there exists an $$\alpha_0$$ such that for any $$\alpha \leq \alpha_0$$, we have $$x^* + \alpha d\in D$$.

Notice that in proving the first necessary condition for interior points, we had the freedom to choose the sign of $$\alpha$$. Now we don't, because reversing the sign of $$\alpha$$ may get us out of $$D$$. Therefore the condition will be weaker. Following the same line of reasoning as above, we'll have to assume that $$\nabla_x f(x^*)\cdot d < 0$$ to get a contradiction. Therefore, the first-order condition becomes

$$
\boxed{\nabla_xf(x^*)\cdot d \geq 0\ \forall d \text{ feasible}}
$$

For the second-order condition, above we relied on the directional gradient being $$0$$. Now it's not guaranteed so we have to assume it. Given the assumption, we reach the same condition. Therefore, the second-order condition can be summarized as

$$
d \text{ is feasible and }\nabla_x f(x^*)\cdot d = 0 \implies d^T \nabla_x^2 f(x^*)d \geq 0
$$

### Sufficient Conditions for Unconstrained Optimization

Cool, now that we've covered necessary conditions, let's move to sufficient conditions.

#### Interior Points

For the interior case, it's easy to check that a *sufficient* condition for a strict local optimum is

$$
\boxed{\nabla_x f(x^*) = 0 \text{ and } \nabla_x^2 f(x^*) \succ 0}
$$

#### Boundary Points

For boundary points, it's a bit more tricky. Namely, we might be tempted to propose the condition above for all feasible directions, but, if $$D$$ is non-convex, like a circle in $$\mathbb{R}^2$$, there may not be any feasible directions. Thus, our proposed condition will hold vacuously true even though the function $$f$$ defined on the circle can be arbitrary and of course may not be a local optimum. Thus, for boundary points, sufficient conditions resolve to a case-by-case basis.

### Necessary Conditions for Constrained Optimization

In constrained optimization, we want to optimize $$f:\mathbb{R}^n \rightarrow \mathbb{R}$$, but respecting a set of $$m$$ constraints $$h_j(x) = 0, j=1,\dots, m$$. To find necessary conditions, let's think of a particle $$x(t)$$ parametrized by time $$t$$ moving strictly within the manifold specified by the constraints. Suppose that $$x(t)$$ passes through a local optimum $$x(0)= x^*$$.

Ok excellent. Notice that as the particle moves, it stays within the manifold so each of the constraints remain respected and thus

$$
\frac{d}{dt} h_j(x(t))\Big\rvert_{t=0} = 0 = \nabla_x h_j(x^*)\cdot x^\prime(0)\ \forall j
$$

And note that this argument works for any arbitrary curve. Now, you can easily check that the set

$$
T = \{x^{\prime}(0)\ \mid \ x(t) \text{ is a curve on the manifold such that } x(0) = x^* \}
$$

is a linear sub-space and in fact it's the tangent space of $$D$$ at $$x^*$$. In other words

$$
T = T_{x^*}(D)
$$

Now, let $$H$$ be the span of the gradients $$\nabla_x h_j(x^*)$$, then the above argument showed that

$$
T_{x^*}(D) \subseteq H^\perp
$$

If we further assume that $$\nabla_x h_j(x^*), j = 1,\dots, m$$ are linearly independent, then $$\mathrm{dim}(H^\perp) = n-m$$, and by the implicit function theorem we also have $$\dim(T_{x^*}(D)) = n-m$$, so we conclude that

$$
T_{x^*}(D) = H^\perp \implies T_{x^*}(D)^\perp = H
$$

Finally, notice that since $$x^*$$ is a local optimum, we have

$$
\frac{d}{dt}f(x(t))\Big\rvert_{t=0} = 0 = \nabla_xf(x^*)\cdot x^\prime(0) \implies \nabla_x f(x^*)\in T_{x^*}(D)^\perp
$$

which, finally, gives us the first-order necessary condition

$$
\boxed{\nabla_x f(x^*) = \sum_j \lambda^*_j \nabla_x h_j(x^*), \text{ for some } \lambda^*_j}\tag{3}
$$

The above argument suggests an important definition

**Def.** We say that a point $$x^*$$ is *regular* if $$\nabla_x h_j(x^*)$$ are linearly independent.

To see why the regularity assumption was important, let's try to remove it. In $$\mathbb{R}^2$$, let $$D$$ be defined by the two constraints $$y = 1, y = e^{-x^2}$$, and notice that simply $$D = \{(0, 1)\}$$. Now, the gradient for both curves at this point has direction $$(0, 1)$$ and so the point is not regular. However, since it's the only point in the domain, it surely is a local optimum. But then pick $$f$$ arbitrary such that $$\nabla_x f((0, 1))\neq (0, \lambda), \forall \lambda$$ and this gives a counter example to condition (3).

As for the second-order necessary condition, again, define $$g(t) = f(x(t))$$, then take a second-order Taylor expansion, and of course, we know that the first derivative in time is $$0$$. Computing $$g''(0)$$ via chain rule gives

$$
g''(0) = x'(0)^T \nabla_x^2 f(x^*) x'(0) + \nabla_x f(x^*) \cdot x''(0)
$$

The second term is not automatically zero. But using $$\nabla_x f(x^*) = \sum_j \lambda_j^* \nabla_x h_j(x^*)$$ together with differentiating $$h_j(x(t)) = 0$$ twice (which gives $$\nabla_x h_j(x^*)\cdot x''(0) = -x'(0)^T \nabla_x^2 h_j(x^*) x'(0)$$), we get

$$
g''(0) = x'(0)^T \left[\nabla_x^2 f(x^*) - \sum_j \lambda_j^*\nabla_x^2 h_j(x^*)\right] x'(0) = x'(0)^T \nabla_x^2 L(x^*) x'(0)
$$

where $$L(x) = f(x) - \sum_j \lambda_j^* h_j(x)$$ is the Lagrangian. So the second-order condition becomes

$$
\boxed{d^T\nabla_x^2 L(x^*)d\geq 0, \forall d\in T_{x^*}(D)}
$$

This may look at first glance very different from the first order condition but notice that the first order condition can be framed much simpler as

$$
\boxed{\nabla_x f(x^*)\cdot d = 0, \forall d\in T_{x^*}(D)}
$$

### Sufficient Conditions for Constrained Optimization

It's a simple exercise to check that

$$
\boxed{(3) + d^T\nabla_x^2 L(x^*) d > 0, \forall d\in H^\perp \setminus \{0\}}
$$

is a sufficient condition for strict local optimality. And notice that this condition is sufficient regardless of whether $$x^*$$ is regular. To see why, notice that (3) says that $$\nabla_x f(x^*) \in H$$. And in general, we know that

$$
T_{x^*}(D)\subseteq H^\perp \implies \nabla_x f(x^*)\in T_{x^*}(D)^\perp
$$

and thus for any particle we have $$\nabla_x f(x^*) \cdot x^\prime(0)= 0$$, i.e., $$g'(0) = 0$$. By the second condition combined with the chain-rule computation above, we have $$g''(0) > 0$$ for any particle path. So for any particle the 1D unconstrained sufficient condition is satisfied, and thus we conclude that we have a strict local optimum on the manifold.

The intuition here is clean: the sufficient condition is just the unconstrained 1D sufficient condition applied to $$g(t) = f(x(t))$$ for every particle path on the manifold. The reason the Lagrangian Hessian shows up rather than the Hessian of $$f$$ alone is that $$g''(0)$$ picks up a constraint-curvature term through $$x''(0)$$, and that term is precisely what's absorbed into $$\nabla_x^2 L$$.

### A Note on Sufficient Conditions

In the above notes, we had cases where we said that "finding sufficient conditions" is case-dependent. Here we try to refine the discussion of such cases to clarify the picture.

**Case 1 (Interior Point with no convexity assumptions):** If $$x^*$$ is an interior point of $$D$$, then indeed sufficient conditions are simple to describe. Namely

$$
\boxed{\nabla_x f(x^*) = 0 \text{ and } \nabla_x^2f(x^*)\succ 0}
$$

**Case 2 (Interior Point with convex function)**: This case is even easier. A local optimum is automatically a global optimum and

$$
\boxed{\nabla_x f(x^*) = 0}
$$

is sufficient.

**Case 3 (Boundary Point with no convexity assumptions)**: This is the tricky case that doesn't have a general rule for sufficient conditions because there may not be any feasible directions rendering the sufficient conditions vacuously satisfied. The theory of Lagrange multipliers handles the case where $$D$$ is described using equality constraints.

In what follows, we'll restrict feasible directions to $$\lVert d \rVert = 1$$, which doesn't change the argument.

**Case 4 (Boundary Point with convex domain)**: In this case, $$D$$ is convex but $$f$$ may not be convex. It can be tempting to declare the following sufficient conditions

$$
\nabla_xf(x^*)\cdot d > 0 \text{ OR } (\nabla_xf(x^*)\cdot d = 0 \text{ AND } d^T\nabla_x^2f(x^*)d > 0) \text { for every feasible } d
$$

but while the above conditions guarantee some $$\epsilon(d)$$ beyond which $$f(x^*)$$ is a local minimum along that direction, the set of feasible directions may not be compact. Take for example

$$
D = \Big\{(x, y)\in\mathbb{R}^2\ \mid\ y > 0\Big\} \bigcup \Big\{(0, 0)\Big\}
$$

$$D$$ above is a convex set but the set of feasible directions at $$(0, 0)$$ is open, corresponding to the set of angles in $$(0, \pi)$$. Thus, we have to strengthen the condition a bit. Let $$\mathcal{F}_{x^*}$$ be the set of feasible directions around $$x^*$$, then the sufficient condition becomes

$$
\boxed{\nabla_xf(x^*)\cdot d > 0 \text{ OR } (\nabla_xf(x^*)\cdot d = 0 \text{ AND } d^T\nabla_x^2f(x^*)d > 0) \text { for every } d \in \bar{\mathcal{F}}_{x^*}}
$$

notice that now the condition must hold on the closure. Requiring the closure is necessary to invoke **Weierstrass Theorem**.

**Case 5 (Boundary Point with convex domain and function)**: This one is easy. Again, a local optimum is automatically a global optimum and

$$
\boxed{\nabla_x f(x^*)\cdot d \geq 0 \text{ for every feasible } d}
$$

becomes sufficient.

## Part 3: The Implicit Function Theorem

In deriving the constrained optimality conditions above, we used two facts without proof: that the implicit function theorem guarantees $$\dim(T_{x^*}(D)) = n-m$$ at a regular point, and that curves on the manifold can be locally parametrized. Let's now prove both by establishing the theorem itself.

I'll start by stating a very important theorem.

**Inverse Function Theorem**: Let $$f:U \rightarrow \mathbb{R}^n$$ be $$\mathcal{C}^1$$ on an open neighborhood $$U\subseteq \mathbb{R}^n$$. Take some $$x^*\in U$$. If

$$
\Big\lvert\frac{\partial f}{\partial x}\Big\rvert_{x^*} \neq 0
$$

then

1. there exists an open neighborhood $$V\subseteq U$$, such that $$W:= f(V)$$ is open
2. there exists a $$\mathcal{C}^1$$ function $$g$$ on $$W$$ such that $$g(f(x)) =x, \forall x\in V$$

In other words, the function $$f$$ is locally invertible around $$x^*$$.

Cool, now let's introduce the Implicit Function Theorem.

**Implicit Function Theorem**: Let $$x\in\mathbb{R}^n, y\in\mathbb{R}^m$$, and $$F:\mathbb{R}^{n+m}\rightarrow \mathbb{R}^m$$ be a $$\mathcal{C}^1$$ function. Further, for a given pair $$(x^*, y^*)$$ such that $$F(x^*, y^*) = 0$$, suppose that

$$
\Big\lvert \frac{\partial F}{\partial y}\Big\rvert_{(x^*, y^*)} \neq 0
$$

then there exists a $$\mathcal{C}^1$$ function $$g:\mathbb{R}^n\rightarrow \mathbb{R}^m$$ such that $$F(x, g(x)) = 0$$ for all $$x\in U$$ where $$U$$ is a local neighborhood of $$x^*\in\mathbb{R}^n$$.

**Proof.** Define the following function $$\Phi: \mathbb{R}^{n+m} \rightarrow\mathbb{R}^{n+m}$$:

$$
\Phi(x, y) = (x, F(x, y))
$$

And let's compute the Jacobian, we get

$$
\partial \Phi =
\begin{bmatrix}
I_n& 0\\
\frac{\partial F}{\partial x}& \frac{\partial F}{\partial y}
\end{bmatrix}
$$

And since this matrix is block-lower-triangular, we have

$$
\lvert\partial \Phi\rvert_{(x^*,y^*)} = \Big\lvert I_n\Big\rvert\Big\lvert\frac{\partial F}{\partial y}\Big\rvert_{(x^*, y^*)} = \Big\lvert\frac{\partial F}{\partial y}\Big\rvert_{(x^*,y^*)}\neq 0
$$

And so by the Inverse Function Theorem above, $$\Phi$$ is locally invertible around $$(x^*, y^*)$$. This implies that there exists an inverse $$\mathcal{C}^1$$ function $$\Psi$$ defined over a neighborhood $$W$$ of $$\Phi(x^*, y^*) = (x^*, 0)$$, such that

$$
\Psi(x, f) = (x, \psi(x, f))\ \forall (x, f)\in W
$$

notice how the first $$n$$ coordinates are simply the identity because the first $$n$$ coordinates of $$\Phi$$ are the identity. Moreover, $$\psi$$ is a $$\mathcal{C}^1$$ function that takes $$x$$ and the value of $$F$$, denoted by $$f$$ as an independent variable, and gives you back $$y$$. Now, a neighborhood $$W\subseteq \mathbb{R}^{n+m}$$ around $$(x^*, 0)$$ gives a neighborhood $$B\subseteq\mathbb{R}^n$$ around $$x^*$$ while forcing $$f=0$$. In other words, there exists an open neighborhood $$B$$ around $$x^*$$ such that

$$
\Psi(x, 0) = (x, \psi(x, 0))\ \forall x\in B
$$

Now, to end the argument, define $$g(x):= \psi(x, 0)$$ and we're done. In particular, $$g$$ is the $$\mathcal{C}^1$$ function we want. Let's verify. We begin by noting that because $$\Psi$$ is an inverse we have

$$
\Phi(\Psi(x, 0)) = (x, 0) = \Phi(x, g(x)) = (x, F(x, g(x))), \ \forall x\in B
$$

which implies that

$$
F(x, g(x)) = 0,\ \forall x\in B
$$

and we're done.

Ok, now it's time to move to the setup from Part 2 on constrained optimization, where we made the important definition of a *regular* point $$x^*$$. Recall that

**Def.** Let $$D$$ be a manifold defined with the set of $$\mathcal{C}^1$$ constraints $$h_j:\mathbb{R}^n\rightarrow \mathbb{R}$$

$$
h_j(x) = 0,\ j=1,\dots, m
$$

We say that $$x^*\in D$$ is regular if $$\nabla_x h_j(x^*), j=1\dots, m$$ are linearly independent.

Ok, we then relied on the following crucial proposition to prove many of our conditions.

**Proposition**. If $$x^*$$ is regular, then $$\mathrm{dim}(T_{x^*}(D)) = n-m$$.

This was important to claim that the tangent space of the manifold at $$x^*$$ is indeed *equal* to $$H^\perp$$.

**Proof.** The set of constraints $$h_j$$ can be framed as $$\mathcal{H}(x) = 0$$ where $$\mathcal{H}:\mathbb{R}^n\rightarrow \mathbb{R}^m\in\mathcal{C}^1$$. If $$x^*$$ is regular then $$\partial \mathcal{H}/\partial x$$ has full row rank $$m$$, so there must exist $$m$$ of its columns that are linearly independent. Let's order the coordinates of $$x$$ as $$(u, v)$$ where $$v$$ corresponds to the coordinates matching the independent columns. Then we can think about

$$
\mathcal{H}(x) = \mathcal{H}(u, v) = 0
$$

and moreover, we have

$$
\Big\lvert \frac{\partial\mathcal{H}}{\partial v}\Big\rvert_{(u^*, v^*)}\neq 0
$$

and so we can apply the Implicit Function Theorem directly to express $$v = g(u)$$ for some $$\mathcal{C}^1$$ function $$g$$. This gives us a local parametrization of any curve $$x(t)$$ passing through $$x^*$$ at $$0$$, where

$$
x(t) =
\begin{bmatrix}
u(t)\\
g(u(t))
\end{bmatrix}
\implies x^\prime(t) =
\begin{bmatrix}
I_{n-m}\\
g^\prime (u(t))
\end{bmatrix}
u^\prime(t) = L(t) u^\prime(t) \implies x^\prime(0) = L(0)u^\prime(0)
$$

Now of course, $$u(t)$$ (and thus its derivative) can be chosen arbitrarily. Moreover, the linear map $$L(0):\mathbb{R}^{n-m}\rightarrow \mathbb{R}^n$$ is injective because of the identity function at the top. Thus, the dimension of the image is $$n-m$$. The image of $$L(0)$$ is exactly $$T_{x^*}(D)$$. We are done.

## Part 4: Infinite Dimensional Optimization

Everything above lived in $$\mathbb{R}^n$$. Now we replace $$\mathbb{R}^n$$ with an infinite dimensional vector space $$V$$, which could be, say, $$\mathcal{C}([0, 1])$$. To see why such a vector space is infinite dimensional, note that $$1, x, x^2, x^3,\dots$$ is an infinite collection of independent vectors in $$V$$.

Ok, so two things to be careful about. In finite dimensions, $$\mathbb{R}^n$$ was the canonical vector space. In fact, every real finite dimensional vector space is isomorphic to $$\mathbb{R}^n$$. In infinite dimensions, this is not the case and the choice of $$V$$ is not obvious. Second, in $$\mathbb{R}^n$$ all norms are equivalent up to a constant. In infinite dimensions, this is also not the case. Different choices of norms, for example

$$
\begin{align}
&\lVert f\rVert_{0\text{-norm}} = \mathrm{max}_{x\in[0, 1]} \lvert f(x)\rvert & f\in \mathcal{C}([0, 1])\\
&\lVert f\rVert_{1\text{-norm}} = \mathrm{max}_{x\in[0, 1]} (\lvert f(x)\rvert  + \mathrm{max} \lvert f^\prime(x)\rvert) & f\in\mathcal{C}^1([0, 1])
\end{align}
$$

lead to different topologies. Given a normed vector space, however, the definition of local and global extrema is equivalent to the finite dimensional case. And in what follows, we'll provide necessary and sufficient conditions that work for a normed vector space $$V$$ in general.

### Necessary Conditions for Local Optima

Recall that in the finite dimensional case, we expressed first and second-order conditions in terms of derivatives. So first we should define the notion of derivatives in infinite dimensions. In infinite dimensions, it's unwieldy to think about the counterpart of $$\nabla_x f(x), \nabla_x^2f(x)$$ directly. It's much easier to think about the counterpart of $$\nabla_x f(x)\cdot d$$ and $$d^T\nabla_x^2f(x) d$$ for some direction $$d$$. This leads us to the **Gateaux derivative**. Recall that we discussed it briefly in Part 1 for finite dimensions. But the beauty is that the definition can be extended to infinite dimensions seamlessly.

**Def.** Given a functional $$J:V \rightarrow \mathbb{R}$$, and a point $$y^*\in V$$, the Gateaux derivative of $$J$$ at $$y^*$$, denoted by $$\delta J\rvert_{y^*}$$, is a linear functional such that for any $$\alpha \in\mathbb{R}$$ and any direction $$\eta \in V$$ we have

$$
J(y^* + \alpha \eta) = J(y^*) + \alpha \delta J\rvert_{y^*}(\eta) + o(\alpha)
$$

**Note:** In general, we seek optimization over a subset $$A\subseteq V$$. In that case, $$\eta$$ has to be an *admissible* direction meaning that there exists a $$\beta$$ close enough to $$0$$ such that $$y^* + \beta \eta \in A$$.

Given this definition, and using similar arguments used in the finite dimensional case, we can conclude that the first-order necessary condition for a local optimum $$y^*$$ is

$$
\boxed{\delta J\rvert_{y^*}(\eta) = 0 \text{ for every } \eta \text{ admissible}}
$$

For first order, we imposed that $$\delta J\rvert_{y^*}$$ is linear, which matches the form of $$\nabla_x f(x) \cdot d$$ in $$d$$. For second order, we need a condition that matches the form of $$d^T \nabla_x^2 f(x) d$$ in $$d$$. To that end, we have the following definition.

**Def.** Let $$B: V\times V\rightarrow \mathbb{R}$$ be a bi-linear operator. Then we say that $$Q:V\rightarrow \mathbb{R}, Q(y) := B(y, y)$$ is a quadratic form.

This leads us to the second-order Gateaux derivative.

**Def.** Given a functional $$J: V\rightarrow \mathbb{R}$$, and a point $$y^*\in V$$, given that $$J$$ has a first-order Gateaux derivative, the second order derivative of $$J$$ at $$y^*$$, denoted by $$\delta^2 J\rvert_{y^*}$$, is a quadratic form such that

$$
J(y^* + \alpha \eta) = J(y^*) + \alpha \delta J\rvert_{y^*}(\eta) + \alpha^2 \delta^2 J\rvert_{y^*}(\eta) + o(\alpha^2)
$$

and a similar argument to the finite dimensional case shows that the second-order necessary condition for a local optimum $$y^*$$ is

$$
\boxed{\delta^2 J\rvert_{y^*}(\eta) \geq 0 \text{ for every } \eta \text{ admissible }}
$$

### Sufficient Conditions for Local Optima

For sufficient conditions, just like the finite dimensional case, we might be tempted to combine the two necessary conditions above to produce a sufficient condition but unfortunately this is not going to work. This happens for two reasons.

#### Gateaux derivative is not strong enough

The first reason is that the Gateaux first- and second-derivative is not a strong enough condition. It's a directional derivative for a fixed arbitrary direction $$\eta$$. In finite dimensions, that was fine. We were able to argue every direction $$d$$ on its own then conclude that a local minimum exists in a neighborhood sense by taking a minimum over directions $$d$$ on the unit circle. This worked because the unit circle in finite dimensions is compact and so every continuous function reaches a minimum. However, in infinite dimensions, the unit circle is no longer compact. To fix this, we have to strengthen our definition of the derivative to allow us to approach $$y^*$$ along an arbitrary curve, not just a fixed direction $$\eta$$. This gives us the Frechet derivative.

**Def.** Given a functional $$J:V \rightarrow \mathbb{R}$$, and a point $$y^*\in V$$, the first-order Frechet derivative of $$J$$ at $$y^*$$, denoted by $$\delta J\rvert_{y^*}$$, is a linear functional such that for any $$\eta\in V$$

$$
J(y^* + \eta) = J(y^*) + \delta J\rvert_{y^*}(\eta) + o(\lVert\eta\rVert)
$$

And the second-order Frechet derivative is similarly defined. Notice two things: (1) this definition doesn't need $$\alpha$$ anymore and (2) this definition depends on the choice of the norm. But most importantly, this definition allows us to approach $$y^*$$ arbitrarily!

Now, even with this strengthening, we're not done yet. Because even if we assume that $$\delta J\rvert_{y^*}(\eta) = 0$$ and $$\delta^2 J\rvert_{y^*}(\eta) >0$$ for every admissible $$\eta$$, we cannot complete our argument to conclude that $$y^*$$ is a strict local minimum. In finite dimensions, we were able to do so. To see why, take $$\nabla_x^2 f(x)$$ and by assuming that it's positive-definite, take its eigenvalues

$$
\lambda_1 \geq \lambda_2 \geq \dots \geq \lambda_n > 0
$$

and its corresponding eigenvectors $$v_1, \dots, v_n$$. Take a unit vector $$d$$. Then we can write

$$
\begin{align}
&\nabla_x^2f(x) = \sum_i \lambda_i v_i v_i^T\\
\implies &d^T\nabla_x^2f(x)d = \sum_i \lambda_i \lvert d\cdot v_i\rvert^2 = \sum_i \lambda_i d_i^2 \\
\implies & d^T\nabla_x^2f(x)d \geq \lambda_{min} \sum_i d_i^2 = \lambda_{min}
\end{align}
$$

so for an arbitrary $$d$$, we can conclude that

$$
d^T\nabla_x^2f(x)d \geq \lambda_{min} \lVert d\rVert^2
$$

This allowed us to take $$\lVert d\rVert$$ small enough so that the quadratic form dominates the residual. Unfortunately, the above result is not true in general in infinite dimensions and we have to assume it instead. So we assume that

$$
\delta^2 J\rvert_{y^*}(\eta) \geq \lambda^* \lVert\eta\rVert^2,\ \text{ for some } \lambda^* > 0 \tag{4}
$$

Given assumption (4) and that $$\delta J\rvert_{y^*}(\eta) = 0$$ for every admissible $$\eta$$, we can conclude a sufficient condition!

#### Implicit Assumptions on the Constraint Set

In the discussion above, note that we defined admissible directions $$\eta$$ so that $$y^* + \beta \eta\in A$$ for $$\beta$$ small enough. But *we didn't constrain the sign of $$\beta$$ to be non-negative like we did for feasible directions $$d$$ in finite dimensions*. Moreover, in finite dimensions, we had a meticulous discussion of sufficient conditions given that $$D$$ was convex, $$f$$ was convex and so on... Here we didn't discuss any such conditions. In particular, what if $$y^*$$ was indeed on the boundary and there were no admissible directions and so sufficient conditions were vacuously true? Indeed, we are making some implicit assumptions on the constraint set $$A$$.

The first assumption is actually much stronger than convexity. When we're optimizing functionals over functions, we usually are optimizing a curve $$\xi(t)$$ over $$[a, b]$$ and the only typical constraint is of the form $$\xi(a) = A, \xi(b) = B$$ for some constants $$A, B$$. This means that $$A$$ is an affine-subspace. And moreover, this allows all perturbations $$\eta$$ such that $$\eta(a) = \eta(b) = 0$$ which itself is a proper-subspace. Thus, not only are these sets convex, we won't ever run into an issue where $$\beta$$ has to be non-negative. We can always perturb in both directions!

Now, we will run into cases where $$y^*$$ is truly on the boundary (in case of inequality constraints for example). In that case, we will need to use heavier machinery than the one above, and we'll save it for later notes ;)
