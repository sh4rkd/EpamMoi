# Cypress E2E Automation - SauceDemo

[![CI](https://github.com/sh4rkd/EpamMoi/workflows/CI/badge.svg)](https://github.com/sh4rkd/EpamMoi/actions)
[![Cypress](https://img.shields.io/badge/cypress-15.7.0-brightgreen.svg)](https://www.cypress.io/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-113%20total-blue.svg)]()
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)

Framework de automatización E2E para pruebas de la aplicación [SauceDemo](https://www.saucedemo.com) utilizando Cypress, TypeScript y el patrón Page Object Model.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Prerequisitos](#prerequisitos)
- [Instalación](#instalación)
- [Ejecución de Tests](#ejecución-de-tests)
- [Cobertura de Tests](#cobertura-de-tests)
- [CI/CD](#cicd)
- [Arquitectura](#arquitectura)
- [Contribuir](#contribuir)

## ✨ Características

- ✅ **Cypress 15.7.0** - Framework moderno y rápido para pruebas E2E
- ✅ **TypeScript 5.9.3** - Seguridad de tipos con modo estricto
- ✅ **Page Object Model** - Arquitectura mantenible con encapsulación estricta
- ✅ **113+ Tests** - Cobertura completa de flujos críticos de usuario
- ✅ **Custom Commands** - Utilidades reutilizables con soporte TypeScript completo
- ✅ **Test Fixtures** - Testing basado en datos con datos centralizados
- ✅ **CI/CD Ready** - Workflow de GitHub Actions con ejecución automática
- ✅ **Rich Reporting** - Screenshots, videos y reportes HTML
- ✅ **Múltiples Usuarios** - Tests para todos los tipos de usuario de SauceDemo

## 📊 Cobertura de Tests

### Estadísticas Generales

- **Total de Test Suites**: 6
- **Total de Test Cases**: 113+
- **Usuarios Testeados**: 6 tipos diferentes
- **Distribución**: 60% escenarios positivos, 40% negativos/casos límite

### Desglose por Usuario

#### Standard User (54 tests)

- ✅ Autenticación
- ✅ Inventario (ordenamiento, visualización)
- ✅ Acciones del carrito (agregar, remover, badge)
- ✅ Validación del carrito
- ✅ Flujo completo de compra
- ✅ Escenarios negativos de checkout

#### Error User (10 tests)

- ✅ Autenticación
- ✅ Inventario
- ✅ Validación de errores (comportamiento esperado sin mensajes de error)

#### Performance Glitch User (20 tests)

- ✅ Autenticación con delays
- ✅ Inventario con ordenamiento
- ✅ Acciones del carrito con respuestas lentas
- ✅ Validación del carrito

#### Problem User (18 tests)

- ✅ Autenticación
- ✅ Inventario (con problemas de imágenes)
- ✅ Acciones del carrito
- ✅ Validación del carrito
- ✅ Recuperación mediante reset

#### Visual User (6 tests)

- ✅ Autenticación
- ✅ Detalles de productos
- ✅ Consistencia visual

#### Locked Out User (7 tests)

- ✅ Bloqueo de autenticación
- ✅ Manejo de mensajes de error
- ✅ Prevención de navegación

## 🏗️ Estructura del Proyecto

```
cypress/
├── e2e/                          # Especificaciones de tests
│   ├── standard-user.cy.ts       # Tests del usuario estándar (54 tests)
│   ├── error-user.cy.ts          # Tests del usuario con errores (10 tests)
│   ├── performance-glitch-user.cy.ts  # Tests de rendimiento (20 tests)
│   ├── problem-user.cy.ts        # Tests de problemas (18 tests)
│   ├── visual-user.cy.ts         # Tests visuales (6 tests)
│   └── locked-out-user.cy.ts     # Tests de bloqueo (7 tests)
├── fixtures/                     # Datos de prueba
│   └── users.json                # Credenciales de usuarios
├── pages/                        # Page Object Models
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInformationPage.ts
│   ├── CheckoutOverviewPage.ts
│   ├── CheckoutCompletePage.ts
│   └── ProductDetailsPage.ts
└── support/                      # Comandos personalizados y configuración
    ├── commands.ts               # Custom Cypress commands
    ├── data/
    │   └── users.ts              # Tipos y datos de usuarios
    └── e2e.ts                    # Hooks globales y configuración
```

## 📦 Prerequisitos

- **Node.js**: 20.x o superior ([Descargar](https://nodejs.org/))
- **npm**: 10.x o superior (incluido con Node.js)
- **Git**: Para control de versiones
- **Chrome**: Última versión (navegador principal de pruebas)

## 🚀 Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/sh4rkd/EpamMoi.git
   cd EpamMoi
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Verificar instalación**:

   ```bash
   npx cypress verify
   ```

## 🧪 Ejecución de Tests

### Modo Interactivo (Cypress Test Runner)

Abre el Cypress Test Runner con interfaz gráfica:

```bash
npm run cypress:open
```

Esto abre la UI de Cypress donde puedes:

- Seleccionar y ejecutar tests individuales
- Ver la ejecución en tiempo real
- Depurar con snapshots de time-travel
- Inspeccionar elementos DOM

### Modo Headless (CI/Local)

Ejecuta todos los tests en modo headless:

```bash
npm run cypress:run
```

O usando el script de test:

```bash
npm test
```

### Ejecutar Tests Específicos

```bash
# Ejecutar solo tests del usuario estándar
npx cypress run --spec "cypress/e2e/standard-user.cy.ts"

# Ejecutar solo tests de usuarios especiales
npx cypress run --spec "cypress/e2e/*-user.cy.ts"
```

### Ejecutar en Navegador Específico

```bash
# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge
```

## 🔍 Verificación de Tipos

Ejecuta la verificación de tipos de TypeScript:

```bash
npm run type-check
```

## 🔄 CI/CD

Este proyecto incluye un workflow de GitHub Actions que:

- ✅ Se ejecuta en cada push y pull request
- ✅ Usa Node.js 20.x
- ✅ Ejecuta todos los tests en modo headless
- ✅ Sube screenshots y videos como artefactos en caso de fallos
- ✅ Verifica tipos de TypeScript
- ✅ Proporciona resultados de tests en la pestaña Actions

Ver el workflow: `.github/workflows/ci.yml`

## 🏛️ Arquitectura

### Page Object Model

Este framework sigue un patrón estricto de Page Object Model:

```typescript
// Page Object (LoginPage.ts)
class LoginPage {
  private selectors = {
    username: '[data-test="username"]',
    password: '[data-test="password"]',
    submit: '[data-test="login-button"]',
  };

  login(username: string, password: string) {
    cy.get(this.selectors.username).type(username);
    cy.get(this.selectors.password).type(password);
    cy.get(this.selectors.submit).click();
  }
}

// Test file (standard-user.cy.ts)
it("should login successfully", () => {
  cy.login(users.usernames.standard, users.password);
  inventoryPage.waitForLoad();
});
```

**Principios Clave**:

- Los selectores de elementos son **privados** y encapsulados en Page Objects
- Los tests interactúan solo con **métodos de acción públicos**
- No hay llamadas `cy.get()` directas en archivos de test
- Los métodos de verificación comprueban estados esperados

### Custom Commands

Comandos personalizados de Cypress disponibles:

```typescript
// Login con credenciales
cy.login("standard_user", "secret_sauce");

// Login con usuario del fixture
cy.login(users.usernames.standard, users.password);
```

## 📝 Datos de Prueba

Los datos de prueba se gestionan en fixtures:

```json
// cypress/fixtures/users.json
{
  "password": "secret_sauce",
  "usernames": {
    "standard": "standard_user",
    "lockedOut": "locked_out_user",
    "problem": "problem_user",
    "performance": "performance_glitch_user",
    "error": "error_user",
    "visual": "visual_user"
  }
}
```

## 📸 Resultados de Tests

### Screenshots

Los tests fallidos capturan automáticamente screenshots guardados en:

```
cypress/screenshots/
```

### Videos

Los videos de ejecución de tests se guardan en:

```
cypress/videos/
```

### Reportes HTML

Cypress genera reportes detallados de tests después de cada ejecución, visibles en la salida de la terminal.

## 🐛 Troubleshooting

### Cypress Binary No Encontrado

```bash
npx cypress install --force
```

### Puerto 3000 Ya en Uso

Mata el proceso usando el puerto 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Errores de TypeScript

Asegúrate de que las dependencias estén instaladas:

```bash
npm install
```

### Timeouts de Tests

Aumenta el timeout en `cypress.config.ts`:

```typescript
defaultCommandTimeout: 15000,
pageLoadTimeout: 45000,
```

## 🤝 Contribuir

1. Crea una rama de feature: `git checkout -b feature/tu-feature`
2. Sigue el patrón Page Object Model
3. Asegúrate de que todos los tests pasen: `npm run cypress:run`
4. Ejecuta verificación de tipos: `npm run type-check`
5. Envía un pull request

## 📚 Mejores Prácticas

- ✅ **Independencia de Tests**: Cada test se ejecuta en aislamiento
- ✅ **Esperas Explícitas**: Usa el waiting automático de Cypress, evita esperas fijas
- ✅ **Nombres de Tests Claros**: Bloques `it()` descriptivos
- ✅ **Encapsulación de Page Objects**: Mantén selectores privados
- ✅ **Testing Basado en Datos**: Usa fixtures para datos de prueba
- ✅ **Limpieza Adecuada**: Resetea el estado entre tests

## 📄 Licencia

ISC

## 👤 Autor

Tu Nombre

## 🔗 Recursos

- [Documentación de Cypress](https://docs.cypress.io/)
- [Aplicación SauceDemo](https://www.saucedemo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!
