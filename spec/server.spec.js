var request = require('request');

// describe('Calc', () => {
//   it('should multiply 2 with 2', () => {
//     expect(2 * 2).toBe(4);
//   });
// });

describe('Get messages', () => {
  it('should return 200 ok', done => {
    request.get('http://localhost:3000/messages', (err, res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('should return a list of messages', done => {
    request.get('http://localhost:3000/messages', (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe('get messages from user', () => {
  it('should return 200 ok', done => {
    request.get('http://localhost:3000/messages/rich', (err, res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('should be rich', done => {
    request.get('http://localhost:3000/messages/rich', (err, res) => {
      expect(JSON.parse(res.body)[4].name).toBe('Rich');
      done();
    });
  });
});
