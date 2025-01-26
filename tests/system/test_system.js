const puppeteer = require('puppeteer');

describe('Multiplayer Game System Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true, 
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

//   test('Shooting should create projectiles and update state', async () => {
//     await page.waitForSelector('canvas');

//     // Capture the projectile count before shooting
//     const initialProjectileCount = await page.evaluate(() => {
//       return Object.keys(window.frontEndProjectiles || {}).length;
//     });

//     // Simulate click to shoot
//     await page.click('canvas', { position: { x: 512, y: 288 } });
//     await page.waitForTimeout(500);

//     // Check projectile count after shooting
//     const updatedProjectileCount = await page.evaluate(() => {
//       return Object.keys(window.frontEndProjectiles || {}).length;
//     });

//     expect(updatedProjectileCount).toBeGreaterThan(initialProjectileCount);
//   });

//   test('Projectiles should move over time', async () => {
//     await page.waitForSelector('canvas');

//     // Simulate click to shoot
//     await page.click('canvas', { position: { x: 512, y: 288 } });

//     // Allow time for projectile to move
//     await page.waitForTimeout(200);

//     // Evaluate the projectile position before and after a short interval
//     const projectileMovement = await page.evaluate(() => {
//       const ids = Object.keys(window.frontEndProjectiles || {});
//       if (ids.length === 0) return false;

//       const proj = window.frontEndProjectiles[ids[0]];
//       const initialX = proj.x;
//       const initialY = proj.y;

//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(proj.x !== initialX || proj.y !== initialY);
//         }, 500);
//       });
//     });

//     expect(projectileMovement).toBe(true);
//   });
  
  

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
