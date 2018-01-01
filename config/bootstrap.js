module.exports = {
  async bootstrap ($) {
    const echoEn = $(':echo').load('test');
    echoEn.log('hello');
    const echoEs = $(':echo').load('test', 'es');
    echoEs.log('hello');
  }
};
