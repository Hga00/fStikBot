
const Markup = require('telegraf/markup')

module.exports = async (ctx) => {
  if (ctx.updateType === 'callback_query') {
    ctx.answerCbQuery()

    let amount = ctx.match[2] || 0

    if (amount < 100) amount = 100
    amount *= 100

    const invoice = {
      provider_token: process.env.PROVIDER_TOKEN,
      start_parameter: 'donate',
      title: ctx.i18n.t('callback.donate.title', {
        botUsername: ctx.options.username
      }),
      description: ctx.i18n.t('callback.donate.description'),
      currency: 'rub',
      prices: [
        { label: `Donate @${ctx.options.username}`, amount }
      ],
      payload: {}
    }

    await ctx.replyWithInvoice(invoice, Markup.inlineKeyboard([
      Markup.payButton(ctx.i18n.t('callback.donate.btn.buy'))
    ]).extra())
  } else if (ctx.updateSubTypes[0] === 'successful_payment') {
    await ctx.replyWithHTML(ctx.i18n.t('callback.donate.successful'))

    if (!ctx.session.userInfo) ctx.session.userInfo = await ctx.db.User.getData(ctx.from)

    console.log()
    ctx.session.userInfo.premium = true
    ctx.session.userInfo.payments.push(ctx.message.successful_payment)
  } else {
    await ctx.replyWithHTML(ctx.i18n.t('cmd.donate', {
      titleSuffix: ` :: @${ctx.options.username}`
    }), {
      reply_markup: Markup.inlineKeyboard([
        [Markup.urlButton('Telegram Donate', 'https://t.me/LyBlog/553')],
        [Markup.urlButton('Other', 'https://donate.lyo.su')]
        // [
        //   Markup.callbackButton('☕️ 100 RUB', 'donate:100'),
        //   Markup.callbackButton('🍔 150 RUB', 'donate:150'),
        //   Markup.callbackButton('🍰 300 RUB', 'donate:300')
        // ],
        // [
        //   Markup.callbackButton('🍱 500 RUB', 'donate:500'),
        //   Markup.callbackButton('❤️ 1000 RUB', 'donate:1000')
        // ]
      ])
    })
  }
}
