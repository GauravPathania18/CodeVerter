# Contributing to CodeVerter

Thank you for your interest in contributing to CodeVerter! We welcome all kinds of contributions, including bug reports, feature requests, documentation improvements, and code contributions.

## Code of Conduct

Please be respectful and kind to all contributors. This project adheres to a code of conduct that ensures a welcoming environment for everyone.

## Getting Started

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/codeverter.git
   cd codeverter
   ```
3. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up your `.env` file** with your Google Gemini API key

## Development Workflow

### Running the Application

```bash
# Run both frontend and backend
npm run dev:full

# Or run separately
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

### Building for Production

```bash
npm run build
npm run preview
```

## Making Changes

### Code Style

- Follow JavaScript/React conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Before Submitting

1. **Test your changes** thoroughly
2. **Check for console errors** in both browser and terminal
3. **Update documentation** if needed
4. **Keep commits clean** with clear commit messages

## Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request** on the main repository with:
   - Clear title describing the changes
   - Description of what was changed and why
   - Reference to any related issues
3. **Address any review feedback** promptly

## Types of Contributions

### Bug Reports
- Describe the bug clearly
- Include steps to reproduce
- Mention expected vs actual behavior
- Add screenshots if applicable

### Feature Requests
- Explain the use case
- Describe the expected behavior
- Suggest implementation approach (if you have ideas)

### Documentation
- Fix typos or unclear explanations
- Add examples
- Improve setup instructions

### Code Improvements
- Add new language support
- Optimize performance
- Improve UI/UX
- Add new features

## Questions?

Feel free to open an issue with the `question` label if you have any questions!

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing! 🙏
