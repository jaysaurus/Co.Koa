module.exports = function SampleController ($) {
  var sampleService = $('SampleService');
  return {
    'GET /FindAll': async (ctx) => {
      try {
        const sampleList = await sampleService.fetchAllToList();
        await ctx.render('FindAll', { sampleList });
      } catch (e) {
        ctx.body = `Something went wrong: ${e.message}`;
      }
    },
    'GET /HBSDemo': async (ctx) => {
      await ctx.render('SampleView', { action: '/HBSDemo' });
    }
  };
};
