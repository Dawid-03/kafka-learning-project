# 🚀 Kafka + NestJS CQRS Event-Driven Example

## Project Overview

A modern backend application built with:
- **NestJS** (TypeScript)
- **Apache Kafka** 
- **CQRS** with @nestjs/cqrs
- **Event-driven architecture** (domain events, saga/process manager)
- **Stripe** (premium payments)
- **PostgreSQL + Prisma** (database)

## Architecture Highlights
- **CQRS**: Each module (users, payments, auth) has separate commands, queries, and handlers. Controllers use CommandBus/QueryBus.
- **Event-driven**: Key actions emit events to Kafka and EventBus. Business logic (e.g., setting premium) is triggered by events.
- **Saga/Process Manager**: The premium purchase process is coordinated by a saga that reacts to payment events and triggers further actions.
- **Dead-letter**: Errors in event handling are sent to a dedicated Kafka topic.
- **Modular**: Each domain is a separate module, making the codebase easy to extend and test.
---