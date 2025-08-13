/**
 * @jest-environment jsdom
 */

describe('Saint of the Day UI', () => {
  const OriginalDate = Date;

  beforeEach(() => {
    // Deterministic date: July 11, 2025 -> MM-DD-YYYY => 07-11-2025
    global.Date = class extends OriginalDate {
      constructor(...args) {
        if (args.length) {
          return super(...args);
        }
        return new OriginalDate('2025-07-11T12:00:00Z');
      }
    };

    jest.resetModules();
    document.body.innerHTML = `
      <div class="sub-header" id="sub-header"></div>
      <div class="bio" id="bio"></div>
    `;
  });

  afterEach(() => {
    global.Date = OriginalDate;
  });

  it('should update sub-header and bio with fetched data', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          day_title: 'Feast of Saint Benedict',
          date: 'July 11, 2025',
          day_description: 'Test description.'
        })
      })
    );

    // Re-require main.js to execute DOMContentLoaded
    require('../src/main.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Wait for promises and DOM updates
    await new Promise(r => setTimeout(r, 10));

    // Assert fetch called with root endpoint and date query
    expect(global.fetch).toHaveBeenCalledWith('https://api.jakemalarz.com?date=07-11-2025');

    expect(document.getElementById('sub-header').textContent)
      .toBe('Feast of Saint Benedict – July 11, 2025');
    expect(document.getElementById('bio').textContent)
      .toBe('Test description.');
  });

  it('should log error if fetch fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject('API error'));
    jest.resetModules();
    require('../src/main.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(r => setTimeout(r, 10));
    expect(errorSpy).toHaveBeenCalledWith('Error fetching data:', 'API error');
    errorSpy.mockRestore();
  });
});
