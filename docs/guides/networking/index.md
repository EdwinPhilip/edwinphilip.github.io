# Networking Fundamentals

**A practical, senior-level field guide to networking for platform and infrastructure engineers.**

Follow the complete journey of a request from a browser to an application, then explore how modern cloud and Kubernetes networks route, secure and troubleshoot traffic.

## Chapters

1. [HTTPS request lifecycle](./q1)
2. [TCP fundamentals](./q2)
3. [DNS internals](./q3)
4. [TLS and PKI](./q4)
5. [Load balancers and proxies](./q5)
6. [CIDR, routing and NAT](./q6)
7. [Kubernetes and GKE networking](./q7)
8. [Production troubleshooting](./q8)

Each chapter includes first principles, packet or control flows, configuration and diagnostic examples, production-style incidents and interviewer follow-ups.

### How to study

Start with the request lifecycle, then trace each subsequent protocol layer. Practice drawing packet paths from memory, and explain which component owns each connection and translation. For troubleshooting, always identify the **first failing boundary** rather than jumping to a familiar tool.

**Note:** All service names and incident scenarios are illustrative. Validate commands and provider-specific limits against the official documentation before applying them in production.
