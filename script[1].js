const form = document.getElementById('form');
const input = document.getElementById('question');
const chat = document.getElementById('chatbox');

// Быстрые кнопки
document.querySelectorAll('.qq').forEach(btn => {
  btn.addEventListener('click', () => {
    input.value = btn.textContent;
    form.dispatchEvent(new Event('submit'));
  });
});

// Правила MVP — быстрые ответы по моркови (Павлодар)
const rules = [
  {
    test: q => /(норм|норма).*(высев|сева)|сколько.*сеять/.test(q),
    answer: () =>
      "Норма высева моркови (Павлодар): 4.5–5.5 кг/га при междурядье 45 см. Глубина: 2–3 мм (лёгкие почвы) и 3–4 мм (тяжёлые). Обязательно прикатывание."
  },
  {
    test: q => /когда.*сеять|срок.*посев|время.*посев/.test(q),
    answer: () =>
      "Сроки сева: ранняя весна — как только поле готово и почва 6–8°C (оптимум 10–12°C). В зоне рискованного земледелия важно использовать весеннюю влагу."
  },
  {
    test: q => /полив|поливать|влажност|капельн/.test(q),
    answer: () =>
      "Полив: 70–75% НВ. После всходов ориентир 10–12 л/м², далее 2–3 полива/нед. по погоде. Лучший вариант — капельный полив; избегай пересушивания и переливов."
  },
  {
    test: q => /температур|жара|климат|погод/.test(q),
    answer: () =>
      "Оптимум роста 15–18°C. Жара >30°C ухудшает качество — помогает мульча, своевременный полив и притенение на рассадниках."
  },
  {
    test: q => /почв|ph|удобр|агрохим/.test(q),
    answer: () =>
      "Почвы: лёгкие суглинки/супеси, pH 6.0–6.8. Ориентир доз (на 1 га): N 60–80, P₂O₅ 60–80, K₂O 80–120. Органику лучше под предшественник."
  },
  {
    test: q => /сорняк|гербицид|междуряд/.test(q),
    answer: () =>
      "Сорняки: механическая междурядная обработка + гербициды по фазам культуры/сорняков. Всегда соблюдай местные регламенты и этикетку."
  },
  {
    test: q => /урожайн|сколько.*получу|план/.test(q),
    answer: () =>
      "Ориентир урожайности (Павлодар): 20–35 т/га при хорошем влагорежиме и чистоте поля. Критично: сроки сева, сорт/гибрид, влага и защита."
  }
];

function fallback() {
  return "Пока знаю базу по моркови: норма высева, сроки, полив, температура, почвы. Спроси, например: «Как поливать?» или «Когда сеять?»";
}

function addMsg(text, who='bot'){
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = (input.value || '').trim();
  if(!q) return;
  addMsg(q, 'user');
  input.value='';
  const qn = q.toLowerCase();
  const rule = rules.find(r => r.test(qn));
  const answer = rule ? rule.answer(qn) : fallback();
  setTimeout(()=> addMsg(answer,'bot'), 250);
});

// ===== Мини‑калькулятор нормы высева =====
const dens = document.getElementById('dens');
const tsw  = document.getElementById('tsw');
const germ = document.getElementById('germ');
const field= document.getElementById('field');
const row  = document.getElementById('row');
const calcBtn = document.getElementById('calcBtn');
const calcOut = document.getElementById('calcOut');

function calcSeedRate(){
  const P = Number(dens.value || 0);   // растения/м²
  const T = Number(tsw.value || 0);    // грамм на 1000 семян
  const G = Number(germ.value || 0);   // %
  const S = Number(field.value || 0);  // %
  const R = Number(row.value || 45);   // см

  if(P<=0 || T<=0 || G<=0 || S<=0){ calcOut.textContent = "Проверь значения"; return; }

  // Формула (кг/га): P * TSW * 100 / (G% * S%)
  const kg_ha = (P * T * 100) / (G * S);

  // Семян на 1 пог. метр при данном междурядье:
  // Площадь 1 м ряда при междурядье R см = R/100 м²
  // Целевая густота P раст./м² => растений на 1 м = P * (R/100)
  const plants_per_meter = P * (R/100);

  calcOut.textContent = `≈ ${kg_ha.toFixed(2)} кг/га • ~${plants_per_meter.toFixed(1)} раст/м при ${R} см`;
}

calcBtn.addEventListener('click', (e)=>{ e.preventDefault(); calcSeedRate(); });
