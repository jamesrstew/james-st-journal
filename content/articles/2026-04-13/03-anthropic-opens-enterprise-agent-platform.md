---
slug: anthropic-opens-enterprise-agent-platform
edition: "2026-04-13"
slot: 3
category: Tech
headline: "Anthropic Opens Agent Platform to Enterprises, Targeting Back-Office Work"
dek: "The AI lab is pitching corporate buyers on multi-step workflows that run unattended overnight, a direct challenge to RPA incumbents and the hyperscalers."
byline: "J.S. Gallagher"
published_at: "2026-04-13T12:00:00Z"
sources:
  - { title: "Anthropic launches enterprise agents", url: "https://example.com/sample-verge", source: "The Verge", tier: "body" }
  - { title: "Claude goes after corporate back office", url: "https://example.com/sample-cnbc-2", source: "CNBC", tier: "body" }
  - { title: "How the pricing compares", url: "https://example.com/sample-arstech", source: "Ars Technica", tier: "body" }
model: "claude-opus-4-6"
draft_iterations: 1
is_sample: true
---

Anthropic on Wednesday opened general availability of Claude for Work Agents, an enterprise product built around long-running AI agents that execute multi-step business workflows with minimal human oversight, the company's most direct move yet into the terrain occupied by robotic process automation incumbents and by the big cloud providers.

The product allows customers to deploy agents that can run for hours, invoke company APIs, read and write to internal systems, and hand off to human operators when they encounter ambiguity. Anthropic said a dozen launch customers, including two of the largest U.S. banks and a Fortune 100 insurer, have been running the platform in limited deployment since January.

Pricing is by "agent-hour" — roughly $8 per hour of sustained agent operation on a long-context workload — with a discount for reserved capacity. That is well below the average loaded cost of the offshore back-office labor the product is aimed at, and comparable to the per-seat cost of leading RPA suites when amortized across a workday.

## The pitch

Anthropic's head of enterprise, who joined from a legacy ERP vendor two years ago, framed the product as "the first AI system designed to clock in." In a briefing with reporters, she walked through three case studies:

A regional bank using the agents to reconcile corporate-client wire transfers overnight, cutting the team that handled the task from 22 people to 4 supervisors. A logistics firm using agents to triage and respond to shipment-exception emails, with human review for the 6 percent of cases the agents flag as ambiguous. An insurer using agents to assemble first drafts of subrogation letters, reducing average cycle time from 11 days to 36 hours.

The common thread, she said, was "high-volume, low-ambiguity judgment work that has resisted every previous generation of automation."

## The competitive picture

The move puts Anthropic in direct competition with three camps. UiPath and Automation Anywhere, the RPA incumbents, have been racing to wrap their deterministic-script products in AI layers; Anthropic's product is the other way around, treating the AI reasoning as the substrate and scripts as tools the agent calls.

OpenAI, Anthropic's closest rival, offers a comparable agentic product through its API but has not packaged it as a standalone enterprise SKU; industry analysts expect that announcement within the quarter. Microsoft, Google, and Amazon each bundle agentic capability into their cloud platforms and will likely compete on integration depth with existing enterprise software estates rather than on agent capability per se.

One of Anthropic's launch customers, speaking on condition of anonymity, said the reason they chose Anthropic over the hyperscaler bundle was "ownership of the stack." "When it goes wrong, we don't want three vendors pointing at each other."

## The risks

Executives cautioned that deploying long-running agents into core business processes has tripped up early adopters. One of Anthropic's pilot customers, not named in the announcement, paused its deployment last fall after an agent executed a batch of 1,400 customer refunds in response to a malformed script, the company disclosed on an earnings call.

Anthropic said the production release includes a new "transaction ceiling" feature that requires human approval for any agent action whose reversal cost exceeds a customer-set threshold. It also ships a separate "replay" tool that allows a supervisor to re-run an agent's decisions with alternative prompts, a feature the company said was developed in response to pilot-customer incident reviews.

The product is available in North America and Europe immediately and will roll out in Asia later this year.
