import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Budget = "low" | "medium" | "high";

type WorldCupAnswers = {
  city?: string;
  budget?: Budget;
  groupSize?: number;
  multiCity?: boolean;
};

function usdRange(budget?: Budget) {
  if (budget === "low") return "$900–$1,800";
  if (budget === "medium") return "$1,800–$3,500";
  if (budget === "high") return "$3,500–$8,000+";
  return "$1,800–$3,500";
}

export default function WorldCup() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Pull answers from localStorage (already used elsewhere in your app)
  const answers: WorldCupAnswers = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("worldcup_answers") || "{}");
    } catch {
      return {};
    }
  }, []);

  const budgetText = usdRange(answers.budget);

  const content = useMemo(() => {
    const t = (en: string, ar: string) => (isArabic ? ar : en);

    const risks = [
      {
        score:
          (answers.budget === "low" ? 30 : answers.budget === "medium" ? 20 : 10) +
          (answers.groupSize && answers.groupSize > 2 ? 10 : 0),
        title: t(
          "Accommodation availability during match week",
          "توفر السكن خلال أسبوع المباراة"
        ),
        body: t(
          "During World Cup weeks, many hotels enforce minimum-night stays, raise prices sharply, or sell out early. This is the most common surprise for travelers.",
          "خلال أسابيع كأس العالم، تفرض كثير من الفنادق حدًا أدنى لعدد الليالي وترفع الأسعار أو تنفد الحجوزات مبكرًا. هذا أكثر ما يُفاجئ المسافرين."
        ),
        link: "https://www.google.com/search?q=best+areas+to+stay+near+world+cup+stadium",
        cta: t("See realistic options", "اطلع على خيارات واقعية"),
      },
      {
        score: answers.multiCity ? 30 : 15,
        title: t(
          "Match-day transport congestion",
          "الازدحام والتنقل يوم المباراة"
        ),
        body: t(
          "Public transport is often overloaded on match days and some areas are restricted. Staying far to save money can double travel time.",
          "المواصلات العامة تكون مزدحمة جدًا يوم المباراة، وبعض المناطق تُغلق جزئيًا. السكن البعيد قد يضاعف وقت التنقل."
        ),
        link: "https://www.google.com/search?q=match+day+transport+stadium",
        cta: t("Plan transport smarter", "خطط للتنقل بذكاء"),
      },
      {
        score: 20,
        title: t(
          "Hidden entry requirements",
          "متطلبات دخول غير متوقعة"
        ),
        body: t(
          "Visa-free travel does not mean requirement-free. Passport validity rules, transit authorizations, or return-ticket checks often apply.",
          "السفر بدون تأشيرة لا يعني بدون شروط. قد توجد متطلبات مثل صلاحية الجواز أو تصاريح عبور أو إثبات تذكرة عودة."
        ),
        link: "https://www.google.com/search?q=entry+requirements+passport+validity+transit",
        cta: t("Check entry rules", "تحقق من شروط الدخول"),
      },
      {
        score: answers.budget ? 10 : 20,
        title: t(
          `Budget realism (${budgetText})`,
          `واقعية الميزانية (${budgetText})`
        ),
        body: t(
          "Low / medium / high budgets mean very different things during major events. Having a range helps avoid unrealistic plans.",
          "كلمات مثل منخفض / متوسط / مرتفع تختلف كثيرًا خلال الأحداث الكبرى. تحديد نطاق يساعدك على تجنب خطط غير واقعية."
        ),
        link: "https://www.google.com/search?q=world+cup+trip+cost+breakdown",
        cta: t("See cost breakdown", "اطلع على توزيع التكاليف"),
      },
    ];

    return risks.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [answers, isArabic, budgetText]);

  return (
    <main
      className="max-w-3xl mx-auto px-4 py-6"
      style={{ direction: isArabic ? "rtl" : "ltr", textAlign: isArabic ? "right" : "left" }}
    >
      <h1 className="text-2xl font-bold mb-2">
        {isArabic
          ? "أهم 3 أمور قد تُفاجئك في هذه الرحلة"
          : "Your Top 3 Risks for This Trip"}
      </h1>

      <p className="text-muted-foreground mb-6">
        {isArabic
          ? "هذه الأمور غالبًا ما تسبب توترًا أو تكاليف إضافية للمسافرين خلال كأس العالم."
          : "These are the things that usually cause stress or extra cost for World Cup travelers."}
      </p>

      <div className="space-y-4">
        {content.map((r, idx) => (
          <div key={idx} className="border rounded-xl p-4 bg-muted/30">
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="mb-3 text-sm leading-relaxed">{r.body}</p>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-medium underline"
            >
              {r.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        {isArabic
          ? "ملاحظة: هذه أداة إرشادية لتقليل المفاجآت والتوتر، وليست استشارة قانونية أو سفر رسمية."
          : "Note: This is a guidance tool to reduce surprises and stress. It is not official travel or legal advice."}
      </p>
    </main>
  );
}
