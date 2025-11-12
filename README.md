# EventBridge – Your Calendar’s Best Friend

[![TypeScript](https://img.shields.io/badge/TypeScript-98.8%25-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)(https://github.com/Not-Just-Pratul/EventBridge-Your-Calendar-s-Best-Friend/blob/main/LICENSE)

A TypeScript-based event bridge implementation for building robust event-driven architectures.

## 🚀 Features

- Written in TypeScript with full type safety
- Event routing and handling
- Asynchronous event processing
- Type-safe event publishing and subscription
- Minimal dependencies
- Fully documented API

## 📋 Prerequisites

- Node.js (version 14.x or higher recommended)
- npm or yarn
- TypeScript 4.x or higher

## 🛠️ Installation

```bash
npm install @not-just-pratul/eventbridge
# or
yarn add @not-just-pratul/eventbridge
```

## 🔧 Usage

```typescript
import { EventBridge } from '@not-just-pratul/eventbridge';

// Initialize the event bridge
const eventBridge = new EventBridge();

// Define your event type
interface UserCreatedEvent {
  userId: string;
  email: string;
  timestamp: Date;
}

// Subscribe to events
eventBridge.subscribe<UserCreatedEvent>('user.created', (event) => {
  console.log(`New user created: ${event.email}`);
});

// Publish an event
eventBridge.publish('user.created', {
  userId: '123',
  email: 'user@example.com',
  timestamp: new Date()
});
```

## 🧪 Running Tests

```bash
npm test
# or
yarn test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Not-Just-Pratul/EventBridge-Your-Calendar-s-Best-Friend)
- [Changelog](CHANGELOG.md)

## 📧 Contact

- GitHub: [@not-just-pratul](https://github.com/not-just-pratul)

---

Made with ❤️ by [Pratul](https://github.com/not-just-pratul)
