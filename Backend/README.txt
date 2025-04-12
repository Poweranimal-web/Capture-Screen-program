Для того щоб запустити проєкт потрібно зробити наступні кроки:

Запустити три термінала:
В першому вказати шлях до директорії Backend
В другому вказати шлях до дерикторії windows 
В третьому можна вказати довільний шляхом(для cloudflare).

1. Термінал Backend вводимо команди (послідовно):
    1) npm i
    2) npm run build 
    3) npm run startt 
    З'явиться наступний путь:
    http://localhost:8081

2. Термінал з довільним шляхом (для cloudflare):
    1) Встановіть попередньо, якщо це не зробили. В глобальному середовищі: 
        npm install -g cloudflared

    2) Вкажіть наступні команду: cloudflared tunnel --url http://localhost:8081
        З'явиться багато тексту після запуску, але нам потрібно знайти url там:
        Приклад:
        2025-04-12T09:36:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
        2025-04-12T09:36:16Z INF |  https://goods-centuries-privacy-class.trycloudflare.com

        Цей https://goods-centuries-privacy-class.trycloudflare.com потрібно запустити в вебраузері.

        Так як url дінамічний. Потрібно змінити url в коді \windows\src\websocket-client.ts 
        
        Приклад в коді \windows\src\websocket-client.ts: 
        Беремо частину url з попередньой команди cloudflared tunnel --url http://localhost:8081
        та вказуємо частину після https:// в 7-му рядку.
        client = new WebSocket('wss://{змінюємо тут}/ws');
        client = new WebSocket('wss://goods-centuries-privacy-class.trycloudflare.com/ws');
3. Термінал з шляхом до директорії windows: 
    1) npm i
    2) npm run build 
    3) npm run startt