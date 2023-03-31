const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('GPT API Proxy', () => {
  it('should return an error for non-medical content', (done) => {
    chai
      .request(app)
      .post('/gpt-proxy')
      .send({ text: '这是一个与医疗无关的文本' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('非医疗内容或包含敏感词');
        done();
      });
  });

  // 添加更多测试用例
});
