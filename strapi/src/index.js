'use strict';

const storyArticleCode = (storyId) => `story-${storyId}`;

const buildStoryArticleData = (story) => {
  const name = String(story?.name || "Ученик").trim();
  const city = String(story?.city || "город не указан").trim();
  const age = Number.isFinite(story?.age) ? story.age : null;
  const ageText = age ? `, ${age} лет` : "";
  const short = String(story?.short_description || "").trim();
  const intro = short || `Индивидуальный образовательный трек с фокусом на поступление и подготовку документов.`;

  return {
    code: storyArticleCode(story.id),
    header: `История: ${name}${ageText}`,
    subheader: `${city} • индивидуальный трек подготовки к поступлению`,
    seo_title: `${name}${ageText}: история подготовки к поступлению`,
    seo_description: `Кейс ${name} (${city}): этапы подготовки, программа и результат по поступлению.`,
    text: `${intro}

## С чего начали

- Провели диагностический созвон и определили академические цели.
- Сформировали список приоритетных программ и университетов.
- Зафиксировали требования по документам и дедлайнам.

## Что сделали в программе

- Персональная работа над учебным треком и портфолио.
- Подготовка структуры мотивационного эссе и CV.
- Сопровождение по стратегии подачи в вузы.

## Результат

Есть понятный пошаговый план подготовки, собранный пакет ключевых материалов и четкая траектория подачи на программы.`,
    type: "blog",
    locale: story?.locale || "ru",
  };
};

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const uid = "api::main.main";

    const defaultProgramWeeks = [
      {
        title: "Неделя 1 — Подготовка",
        items: [
          { icon: "essay", text: "Эссе" },
          { icon: "strategy", text: "Стратегия поступления" },
          { icon: "interview", text: "Собеседования" },
          { icon: "resume", text: "Резюме & CV" },
        ],
      },
      {
        title: "Неделя 2 — Погружение",
        items: [
          { icon: "tour", text: "Экскурсии по вузам" },
          { icon: "network", text: "Нетворкинг" },
          { icon: "trip", text: "Поездка в Нью-Йорк" },
        ],
      },
    ];

    const defaultReasons = [
      { icon: "goal", title: "Понимание цели" },
      { icon: "portfolio", title: "Сильное портфолио" },
      { icon: "contacts", title: "Контакты и опыт" },
    ];

    const defaultGuarantees = [
      { icon: "security", text: "Безопасность" },
      { icon: "teachers", text: "Топ-преподаватели" },
      { icon: "result", text: "Контроль результата" },
    ];

    try {
      const mains = await strapi.entityService.findMany(uid, {
        fields: ["id", "title", "locale"],
        populate: {
          program_weeks: { populate: { items: true } },
          reasons: true,
          guarantees: true,
        },
      });

      const records = Array.isArray(mains) ? mains : mains ? [mains] : [];

      if (!records.length) {
        await strapi.entityService.create(uid, {
          data: {
            title: "Поступление в топ-вузы США",
            subtitle: "Интенсив + тур по Harvard, MIT, Boston University",
            program_title: "Программа на 2 недели",
            program_weeks: defaultProgramWeeks,
            reasons_title: "Почему выбирают нас",
            reasons: defaultReasons,
            guarantee_title: "Мы не продаем тур. Мы готовим к поступлению.",
            guarantees: defaultGuarantees,
            price_title: "Стоимость программы",
            price_value: "От $3,000 за 2 недели",
            price_note: "Финальная стоимость зависит от состава программы",
            price_button_text: "Узнать точную стоимость",
          },
        });
      } else {
        for (const entry of records) {
          const patch = {};
          if (!entry.program_title) patch.program_title = "Программа на 2 недели";
          if (!Array.isArray(entry.program_weeks) || !entry.program_weeks.length) {
            patch.program_weeks = defaultProgramWeeks;
          }
          if (!entry.reasons_title) patch.reasons_title = "Почему выбирают нас";
          if (!Array.isArray(entry.reasons) || !entry.reasons.length) {
            patch.reasons = defaultReasons;
          }
          if (!entry.guarantee_title) {
            patch.guarantee_title = "Мы не продаем тур. Мы готовим к поступлению.";
          }
          if (!Array.isArray(entry.guarantees) || !entry.guarantees.length) {
            patch.guarantees = defaultGuarantees;
          }
          if (!entry.price_title) patch.price_title = "Стоимость программы";
          if (!entry.price_value) patch.price_value = "От $3,000 за 2 недели";
          if (!entry.price_note) {
            patch.price_note = "Финальная стоимость зависит от состава программы";
          }
          if (!entry.price_button_text) {
            patch.price_button_text = "Узнать точную стоимость";
          }

          if (Object.keys(patch).length) {
            await strapi.entityService.update(uid, entry.id, { data: patch });
          }
        }
      }
    } catch (error) {
      strapi.log.warn(`[main bootstrap] failed to seed new landing fields: ${error.message}`);
    }

    try {
      const stories = await strapi.entityService.findMany("api::story.story", {
        fields: ["id", "name", "age", "city", "short_description", "locale"],
        sort: ["id:asc"],
        populate: { article: { fields: ["id", "code", "header"] } },
      });

      const storyList = Array.isArray(stories) ? stories : stories ? [stories] : [];
      for (const story of storyList) {
        const expectedCode = storyArticleCode(story.id);
        const storyArticleData = buildStoryArticleData(story);

        let articleId = story?.article?.id || null;
        let article = null;

        if (articleId) {
          article = await strapi.entityService.findOne("api::article.article", articleId, {
            fields: ["id", "code", "header", "subheader", "seo_title", "seo_description", "text", "type", "locale"],
          });
        } else {
          const existed = await strapi.entityService.findMany("api::article.article", {
            filters: { code: expectedCode },
            fields: ["id", "code", "header", "subheader", "seo_title", "seo_description", "text", "type", "locale"],
            limit: 1,
          });
          article = Array.isArray(existed) ? existed[0] : existed || null;
          articleId = article?.id || null;
        }

        if (!articleId) {
          const created = await strapi.entityService.create("api::article.article", {
            data: storyArticleData,
          });
          articleId = created.id;
        } else {
          const patch = {};
          if (!article.code || article.code !== expectedCode) patch.code = expectedCode;
          if (!article.header) patch.header = storyArticleData.header;
          if (!article.subheader) patch.subheader = storyArticleData.subheader;
          if (!article.seo_title) patch.seo_title = storyArticleData.seo_title;
          if (!article.seo_description) patch.seo_description = storyArticleData.seo_description;
          if (!article.text) patch.text = storyArticleData.text;
          if (!article.type) patch.type = "blog";
          if (Object.keys(patch).length) {
            await strapi.entityService.update("api::article.article", articleId, { data: patch });
          }
        }

        if (!story?.article?.id || story.article.id !== articleId) {
          await strapi.entityService.update("api::story.story", story.id, {
            data: { article: articleId },
          });
        }
      }
    } catch (error) {
      strapi.log.warn(`[story bootstrap] failed to seed story articles: ${error.message}`);
    }
  },
};
