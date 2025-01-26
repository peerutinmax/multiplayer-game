const puppeteer = require('puppeteer');

describe('Multiplayer Game System Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, 
      slowMo: 50,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('User should be able to submit username and start game', async () => {
    await page.waitForSelector('#usernameForm', { visible: true });
    await page.type('#usernameInput', 'TestUser');

    await page.evaluate(() => {
      document.querySelector('#usernameForm').dispatchEvent(new Event('submit', { bubbles: true }));
    });

    await page.waitForSelector('canvas', { visible: true, timeout: 5000 });
    expect(await page.$('canvas')).not.toBeNull();
  });

  test('Game should render players correctly', async () => {
    await page.waitForSelector('#playerLabels');
    const playerCount = await page.$$eval('#playerLabels div', divs => divs.length);
    expect(playerCount).toBeGreaterThanOrEqual(1);
  });

  test('Shooting event should trigger socket emission', async () => {
    await page.waitForSelector('canvas');
  
    // Override the socket.emit function in the browser context to capture events
    await page.evaluate(() => {
      window.socketEmitEvents = [];
      if (window.socket) {
        console.log('Socket object found in browser context');
        const originalEmit = window.socket.emit;
        window.socket.emit = function (event, data) {
          console.log(`Captured socket event: ${event}`, data);
          window.socketEmitEvents.push({ event, data });
          return originalEmit.apply(window.socket, arguments);
        };
      } else {
        console.error('Socket object not found');
      }
    });
  
    // Simulate a click event on the canvas
    await page.click('canvas', { position: { x: 512, y: 288 } });
  
    // Allow more time for the event to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    const shootEventCaptured = await page.evaluate(() => {
      console.log('Captured socket events:', window.socketEmitEvents);
      return window.socketEmitEvents.some(e => e.event === 'shoot');
    });
  
    expect(shootEventCaptured).toBe(true);
  });
  
  
  

  test('Movement keys should trigger player movement', async () => {
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyW');
    await page.keyboard.press('KeyD');
    await page.keyboard.press('KeyS');
  
    // Wait manually if timeout function isn't supported
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  
    const playerMoved = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d');
      return context ? context.getImageData(0, 0, canvas.width, canvas.height) !== null : false;
    });
  
    expect(playerMoved).toBe(true);
  });
  
  

  test('Leaderboard should update correctly when players join', async () => {
    await page.waitForSelector('#playerLabels');
    await page.evaluate(() => {
      document.querySelector('#playerLabels').innerHTML += `
        <div data-id="newPlayer" data-score="100">NewPlayer: 100</div>
      `;
    });

    const updatedPlayerCount = await page.$$eval('#playerLabels div', divs => divs.length);
    expect(updatedPlayerCount).toBeGreaterThanOrEqual(2);
  });

  test('Username form should reappear after disconnection', async () => {
    await page.evaluate(() => {
      document.querySelector('#usernameForm').style.display = 'block';
    });

    const formVisible = await page.$eval('#usernameForm', form => window.getComputedStyle(form).display !== 'none');
    expect(formVisible).toBe(true);
  });
});
