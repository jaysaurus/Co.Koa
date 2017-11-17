module.exports = function SampleController ($) {
  var sampleService = $('SampleService');
  return {
    'GET /FindAll/:id': async (ctx) => {
      try {
        console.log(ctx.body.id);
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
