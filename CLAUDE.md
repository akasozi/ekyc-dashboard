# CLAUDE.md - eKYC Dashboard Guide

## Build Commands
- `npm start` - Start development server
- `npm test` - Run all tests
- `npm test src/components/KYC/KYCDetails.test.js` - Run specific test file
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App

## Code Style Guidelines
- Use functional components with React hooks instead of class components
- Import order: React/libraries, components, services, styles
- Use explicit `import React from 'react'` for clarity
- Prefer destructuring for props and state
- Use camelCase for variables, PascalCase for components
- Group related state with useState objects when possible
- Use try/catch for error handling with descriptive error messages
- Implement proper loading states for async operations
- Keep components small and focused on a single responsibility
- Use consistent 2-space indentation

## Project Structure
- Components are organized by feature in `/src/components/`
- Core services reside in `/src/services/`
- Use CSS modules or the existing styles directory for styling
- Keep business logic in services, UI logic in components