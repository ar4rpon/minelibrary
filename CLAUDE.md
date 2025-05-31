# Claude Project Rules

## Import Project-Specific Rules
@.claude/project-rules.md

## Project Overview
This project is a web application called "minelibrary" for managing and sharing books.
It is built using Laravel 11 and React (Inertia.js).

## Technology Stack
- **Backend**: Laravel 11
- **Frontend**: React with TypeScript, Inertia.js
- **Database**: SQLite
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui

## Coding Conventions

### Laravel (PHP)
1. **Naming Conventions**
   - Class names: PascalCase (e.g., `BookShelfController`)
   - Method names: camelCase (e.g., `getBooks`)
   - Variable names: camelCase (e.g., `$bookShelf`)
   - Database table names: snake_case, plural (e.g., `book_shelves`)
   - Column names: snake_case (e.g., `book_shelf_name`)

2. **Preventing N+1 Query Problems**
   - Actively use Eager Loading (`with()`, `load()`)
   - Optimize count queries with `withCount()`
   - For multiple record processing, fetch necessary data in bulk beforehand

3. **Controllers**
   - One controller corresponds to one resource
   - Follow RESTful design principles
   - Move business logic to models or service classes

### React/TypeScript
1. **Naming Conventions**
   - Components: PascalCase (e.g., `BookShelfList`)
   - Functions/variables: camelCase (e.g., `handleSubmit`)
   - Type definitions: PascalCase (e.g., `BookShelfType`)
   - File names: PascalCase for components, kebab-case for others

2. **Component Design**
   - Use functional components
   - Always define TypeScript types
   - Define Props with interface or type alias

3. **Directory Structure**
```
resources/ts/
├── api/                    # API Layer (Laravel 12 Extension)
│   ├── client/
│   │   ├── axios.ts
│   │   ├── interceptors.ts
│   │   └── types.ts
│   ├── services/           # Domain Services
│   │   ├── auth.service.ts
│   │   ├── book.service.ts
│   │   ├── bookshelf.service.ts
│   │   ├── memo.service.ts
│   │   └── index.ts
│   └── hooks/              # API-specific Hooks
│       ├── useApiError.ts
│       ├── useAsyncState.ts
│       └── index.ts
├── components/             # Laravel 12 Standard
│   ├── ui/                 # shadcn/ui primitives
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── common/             # Common Components
│   │   ├── BaseCard.tsx    # Unified BaseCard
│   │   ├── Icon/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ErrorBoundary.tsx
│   └── domain/             # Domain-specific Components
│       ├── book/
│       │   ├── BookCard.tsx
│       │   ├── BookGenreSelect.tsx
│       │   ├── ReadStatusBadge.tsx
│       │   └── dialogs/
│       ├── bookshelf/
│       │   ├── BookShelfCard.tsx
│       │   └── dialogs/
│       └── memo/
│           ├── MemoCard.tsx
│           └── dialogs/
├── hooks/                  # Laravel 12 Standard
│   ├── common/             # Generic Hooks
│   │   ├── useDialogState.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   └── domain/             # Domain-specific Hooks
│       ├── useBook.ts
│       ├── useBookShelf.ts
│       ├── useMemo.ts
│       └── index.ts
├── layouts/                # Laravel 12 Standard
│   ├── DefaultLayout.tsx
│   ├── AuthLayout.tsx
│   └── index.ts
├── lib/                    # Laravel 12 Standard (Extended)
│   ├── utils.ts
│   ├── constants.ts
│   ├── validation.ts
│   ├── formatters.ts
│   └── errors/
│       ├── AppError.ts
│       ├── ErrorHandler.ts
│       └── index.ts
├── pages/                  # Laravel 12 Standard (Inertia)
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ...
│   ├── Book/
│   │   ├── Search.tsx
│   │   └── FavoriteList.tsx
│   ├── BookShelf/
│   │   ├── List.tsx
│   │   ├── Detail.tsx
│   │   └── UserList.tsx
│   ├── Dashboard.tsx
│   ├── Memo/
│   │   └── List.tsx
│   └── Profile/
│       ├── Show.tsx
│       └── Edit.tsx
├── stores/                 # State Management (Laravel 12 Extension)
│   ├── auth.store.ts
│   ├── book.store.ts
│   ├── global.store.ts
│   └── index.ts
├── types/                  # Laravel 12 Standard (Extended)
│   ├── api/
│   │   ├── common.ts
│   │   ├── auth.ts
│   │   ├── book.ts
│   │   ├── bookshelf.ts
│   │   └── memo.ts
│   ├── domain/
│   │   ├── book.ts
│   │   ├── bookshelf.ts
│   │   ├── memo.ts
│   │   └── user.ts
│   ├── ui/
│   │   ├── component.ts
│   │   └── theme.ts
│   ├── global.d.ts
│   ├── inertia.d.ts
│   └── index.ts
├── utils/                  # Utility Separation
│   ├── date.ts
│   ├── string.ts
│   ├── number.ts
│   └── array.ts
├── app.tsx                 # Inertia App
└── bootstrap.ts            # Initialization
```

## Development Workflow

1. **Branch Strategy**
   - main branch is production environment
   - Feature development: `feature/feature-name#issue-number`
   - Bug fixes: `fix/problem-description#issue-number`
   - Refactoring: `refactor/target#issue-number`

2. **Commit Messages**
   - Written in Japanese
   - Use prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
   - Example: `feat: 本棚のお気に入り機能を追加`

3. **Pull Requests**
   - Include issue number in title
   - Clearly describe changes
   - Ensure tests pass

### Development Flow

1. Check for existing issues for the relevant task, create new one if none exists
2. Create working branch
3. Organize task list and commit per task
4. When all tasks are complete, push and create pull request
5. Merge to main branch and update local main branch
6. Delete working branch
7. If issues are complete, leave work report and close (skip this step if not all tasks within issues are complete)

## Testing and Build

### Test Commands
```bash
# PHPUnit Tests (Pest)
php artisan test

# Run specific test file
php artisan test tests/Feature/BookShelfControllerTest.php

# Test with coverage report
php artisan test --coverage

# Parallel execution (faster)
php artisan test --parallel

# JavaScript linting
npm run lint
```

### Build Commands
```bash
# Development environment
npm run dev

# Production environment
npm run build
```

### Test Guidelines
1. **Test Creation Rules**
   - Always create tests when adding new features
   - Add tests to prevent regression when fixing bugs
   - Follow AAA (Arrange-Act-Assert) pattern

2. **Types of Tests**
   - Unit tests: Individual methods of models or service classes
   - Feature tests: API endpoints or integrated functionality
   - See `TESTING.md` for details

3. **Coverage Goals**
   - Initial goal: 60% or higher
   - Final goal: 80% or higher

## Performance Optimization

1. **Database Queries**
   - Avoid N+1 problems
   - Set appropriate indexes
   - Don't fetch unnecessary data (use select())

2. **Frontend**
   - Lazy loading of images
   - Proper memoization of components
   - Avoid unnecessary re-rendering

## Security

1. **Authentication & Authorization**
   - Set proper authentication for all routes
   - Verify user permissions before data access
   - Enable CSRF protection

2. **Data Validation**
   - Validate on both frontend and backend
   - SQL injection countermeasures (use Eloquent ORM)
   - XSS countermeasures (use Blade template escape features)

## Other Considerations

1. **Environment Variables**
   - Manage production settings with `.env` file
   - Don't commit secret information

2. **Logging**
   - Properly log errors
   - Debug information only in development environment

3. **Comments**
   - Always add comments for complex logic
   - However, unnecessary if code is self-documenting