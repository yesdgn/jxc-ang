import { JxcAngPage } from './app.po';

describe('jxc-ang App', () => {
  let page: JxcAngPage;

  beforeEach(() => {
    page = new JxcAngPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
