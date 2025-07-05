# Настройка ngrok для тестирования Telegram Web App

## 🔧 Установка и настройка ngrok

### 1. Регистрация на ngrok.com

1. Перейдите на [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Зарегистрируйтесь (бесплатно)
3. Подтвердите email

### 2. Получение authtoken

1. Войдите в [dashboard.ngrok.com](https://dashboard.ngrok.com)
2. Перейдите в раздел "Your Authtoken"
3. Скопируйте ваш токен

### 3. Настройка authtoken

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### 4. Запуск туннеля

```bash
ngrok http 3000
```

## 🌐 Альтернативные способы тестирования

### Вариант 1: Локальное тестирование без Telegram

1. **Запустите приложение:**
   ```bash
   cd frontend
   npm start
   ```

2. **Откройте в браузере:**
   ```
   http://localhost:3000
   ```

3. **Проверьте функциональность:**
   - Добавление одежды
   - Создание наборов
   - Профиль пользователя
   - Адаптивная тема

### Вариант 2: Использование других туннелирующих сервисов

#### Cloudflare Tunnel (бесплатно)
```bash
# Установка
npm install -g cloudflared

# Запуск
cloudflared tunnel --url http://localhost:3000
```

#### LocalTunnel (бесплатно)
```bash
# Установка
npm install -g localtunnel

# Запуск
lt --port 3000
```

#### Serveo (бесплатно)
```bash
ssh -R 80:localhost:3000 serveo.net
```

### Вариант 3: Развертывание на хостинге

#### Vercel (рекомендуется)
1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Разверните приложение:
   ```bash
   cd frontend
   vercel
   ```

3. Получите URL вида: `https://your-app.vercel.app`

#### Netlify
1. Соберите приложение:
   ```bash
   npm run build
   ```

2. Загрузите папку `build` на [netlify.com](https://netlify.com)

## 📱 Тестирование в Telegram

### 1. Настройка бота

1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Создайте бота: `/newbot`
3. Настройте Web App: `/mybots` → ваш бот → Bot Settings → Configure Mini App
4. Установите URL: `https://your-ngrok-url.ngrok.io`

### 2. Тестирование

1. Найдите ваш бот в Telegram
2. Отправьте `/start`
3. Нажмите кнопку "Мой гардероб"
4. Протестируйте все функции

## 🔍 Отладка

### Включение отладки WebView

**iOS:**
1. Нажмите 10 раз на иконку настроек
2. Включите "Allow Web View Inspection"
3. Подключите устройство к Mac
4. Откройте Safari → Develop → [Your Device]

**Android:**
1. Включите USB-отладку
2. В настройках Telegram нажмите 2 раза на версию
3. Включите "Enable WebView Debug"
4. Откройте `chrome://inspect/#devices`

### Проверка логов

```bash
# Логи ngrok
ngrok http 3000 --log=stdout

# Логи приложения
cd frontend && npm start
```

## 🚀 Быстрый старт

### Для разработки без Telegram:

1. **Запустите backend:**
   ```bash
   cd clothing-backend
   npm start
   ```

2. **Запустите frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Откройте в браузере:**
   ```
   http://localhost:3000
   ```

### Для тестирования в Telegram:

1. **Настройте ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ngrok http 3000
   ```

2. **Обновите URL в BotFather:**
   ```
   https://abc123.ngrok.io
   ```

3. **Протестируйте в Telegram**

## 📋 Чек-лист

- [ ] Приложение запускается локально
- [ ] Все функции работают в браузере
- [ ] ngrok настроен и работает
- [ ] URL обновлен в BotFather
- [ ] Приложение открывается в Telegram
- [ ] Авторизация работает
- [ ] Все функции работают в Telegram

## 🆘 Решение проблем

### ngrok не подключается
- Проверьте authtoken
- Убедитесь, что порт 3000 свободен
- Проверьте интернет-соединение

### Приложение не открывается в Telegram
- Проверьте URL в BotFather
- Убедитесь, что HTTPS включен
- Проверьте, что приложение доступно

### Ошибки авторизации
- Проверьте backend сервер
- Убедитесь, что API доступен
- Проверьте CORS настройки 