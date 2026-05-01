require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const app = express();

const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('API key loaded:', apiKey ? apiKey.slice(0, 15) + '...' : 'MISSING - check .env');

const client = new Anthropic({ apiKey });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'yasmine_studies.html.html'));
});

// ===================== TOPIC CONTENT FALLBACKS =====================
const TOPIC_CONTENT = {
  'clinical-reasoning': `Clinical Reasoning PHAY0085 MPharm:
- Clinical reasoning = thinking and decision-making processes in clinical practice. Context specific. Cognitive process formulating diagnoses.
- Dual Process Theory: System 1 (Type 1) = fast, automatic, pattern recognition, intuitive, time-pressured. Prone to cognitive bias. System 2 (Type 2) = slow, deliberate, analytical, logical. Used for complex/unfamiliar cases.
- Balancing systems: effective reasoning switches between both. Intuition when appropriate, analytical for complex decisions.
- Conscious Competence Model: 4 stages - unconscious incompetence, conscious incompetence, conscious competence, unconscious competence.
- Collaborative Clinical Reasoning: working alongside others on diagnostic, therapeutic, prognostic issues.
- Working diagnosis = provisional most probable diagnosis from initial evaluation. Differential diagnosis = list of potential conditions in order of likelihood. Red Flags = worrying symptoms suggesting higher acuity. Safety Netting = "If I'm right, what do I expect? How will I know if wrong? What would I do?"
- Consequences of poor reasoning: over-reliance on System 1, failure to gather info, inconsistent EBM, not recognising when to switch systems, patient harm.
- Diagnostic uncertainty is normal. "Hear hooves think horse not zebra." If cannot formulate differentials, may be beyond competence.
- Risk Aversion vs Risk Management: risk aversion = psychological preference avoiding negative outcomes, leads to over-testing. Risk management = rational referral decision.
- Human factors: time pressure, cognitive bias, emotional state, fatigue influence decisions.
- Bias types: anchoring bias, availability bias, premature closure, framing effect.
- Independent prescriber: accountable for prescribing decisions, can prescribe autonomously within clinical competence (GPhC wording).
- Strategies: metacognition, reflective practice, seek feedback, structured reasoning.`,

  'consultation': `Consultation Skills MPharm UCL:
- Calgary-Cambridge model: initiating, gathering information, physical examination, explanation and planning, closing. Has structure guides.
- Communication = two-way process of reaching mutual understanding in context of caring relationships.
- SOAP notes: Subjective (patient's account), Objective (clinical findings/obs), Assessment (working diagnosis), Plan (management).
- Open questions, active listening, empathy, reflective listening, summaries are core skills.
- Person-centred approach: explore illness experience, understand patient perspective.
- Paediatric consultations: children over 5 may be capable. Build rapport first. Read subtle cues. Young people 16-17 have presumed capacity but may want parent input. Adjust language.
- Remote consultations: camera at eye level, stable connection, acknowledge delays. Record medium used. Obtain explicit consent if recording. Refer/reschedule if communication fails.
- Informed consent, capacity, confidentiality are legal considerations.
- ICE model: Ideas, Concerns, Expectations.
- Consultation models: Neighbour's Inner Consultation, Pendleton's model, Calgary-Cambridge.
- Handover: SBAR (Situation, Background, Assessment, Recommendation).
- Non-verbal communication includes eye contact, facial expression, body language - harder in remote consultations.
- Adapting for children: "Hello my name is" important, build rapport, ask unrelated question first, consider Gillick competence.`,

  'motivational-interviewing': `Motivational Interviewing and Health Coaching PHAY0085:
- Health behaviours are key drivers of morbidity and mortality. Smoking, diet, physical inactivity are major preventable disease contributors.
- COM-B Model: Capability (physical/psychological) + Opportunity (physical/social) + Motivation (reflective/automatic) = Behaviour. Used to understand barriers to change.
- Stages of Change (Prochaska and DiClemente): Pre-contemplation, Contemplation, Preparation, Action, Maintenance, Relapse.
- Motivational Interviewing (MI): guiding principles = RULE: Resist righting reflex, Understand patient's motivation, Listen, Empower.
- OARS: Open questions, Affirmations, Reflective listening, Summaries. Core MI skills.
- Change talk vs Sustain talk: recognise and respond to change talk (DARN-C: Desire, Ability, Reasons, Need, Commitment). Sustain talk = arguments for status quo.
- Health Coaching vs MI: MI = helping patients explore ambivalence. Health Coaching = supporting action once in preparation/action stage.
- GROW model (Health Coaching): Goal, Reality, Options, Way forward. Used to develop action plan.
- Person-centred care: patient as expert of their own life. Collaboration not confrontation.
- Rolling with resistance: avoid arguing, reflect resistance back, shift perspective.
- Motivational Interviewing supports adherence, lifestyle change, medicines taking.`,

  'pharmacy-first': `Pharmacy First NHS Advanced Service:
- 7 clinical conditions: Uncomplicated UTI (women 16-64), Acute Sore Throat, Acute Otitis Media (AOM), Acute Sinusitis, Infected Insect Bites, Shingles, Impetigo.
- UTI: Nitrofurantoin 100mg MR twice daily for 3 days. Take with food. May discolour urine brown. MHRA: pulmonary and hepatic ADR warning. Exclude: pregnancy, recurrent UTI, catheter, diabetes.
- Sore Throat: FeverPAIN score - Fever, Purulence, Attend rapidly (<=3 days), inflamed Tonsils, No cough/coryza. Score 4-5 + severe = antibiotic. First line: Phenoxymethylpenicillin 500mg QDS for 5 days adults. Penicillin allergy: Clarithromycin or Erythromycin.
- AOM: Children 1-17 years. Otoscopy required. First line: Amoxicillin. Exclude: recurrent AOM. Red flag: neck stiffness, photosensitivity = meningitis.
- Sinusitis: fluticasone furoate or mometasone furoate nasal spray. Antibiotics if bacterial. Rule out: migraine if no nasal symptoms.
- Shingles: antivirals within 72 hours. Elderly most at risk. Rash in dermatomal distribution.
- Impetigo: bullous vs non-bullous. Topical: hydrogen peroxide or fusidic acid. Oral: flucloxacillin.
- Infected insect bites: flucloxacillin first line. Check cellulitis signs.
- All consultations: clinical reasoning, differential diagnosis, red flags, safety netting, documentation (SOAP), patient counselling, TARGET leaflets.
- Pharmacy First Pro-forma documentation required.`,

  'infections': `Infections Self-Care Lectures:
- UTI: E. coli most common (77%). Key symptoms: dysuria, nocturia, cloudy urine. Differentials: pyelonephritis (flank pain, fever, myalgia), urethritis, STI, pregnancy.
- Acute Sore Throat: mostly viral. FeverPAIN score. Centor criteria. Self-care: analgesia, fluids. Antibiotics if score 4-5.
- AOM: fluid in middle ear. Bacterial (S.pneumoniae, H.influenzae, M.catarrhalis) or viral. More common in children - shorter eustachian tubes.
- Sinusitis: if no nasal congestion/discharge, consider migraine. Most viral. Antibiotics if bacterial (>10 days, fever, purulent discharge worsening).
- Shingles: reactivation of varicella zoster. Dermatomal rash. Antivirals within 72h most effective. Post-herpetic neuralgia complication.
- Impetigo: S.aureus or Streptococcus. Non-bullous: golden crusts. Bullous: fluid-filled blisters. Spreads by direct contact.
- Infected insect bites: cellulitis signs = spreading redness, warmth, swelling. Anaphylaxis risk.
- Neutropenic sepsis EMERGENCY: neutrophils <1.0 + temp >38 degrees C. Antibiotics within 60 minutes. PIP/TAZ + gentamicin (no penicillin allergy).
- Pharmacy First 7 clinical pathways application.
- RSV, rhinovirus, adenovirus cause viral respiratory infections.
- Sepsis: THINK SEPSIS. Safety net all patients. Signs: altered consciousness, tachycardia, hypotension, temp >38 or <36.`,

  'women-health': `Women's Health PHAY0077 Claire Grant:
- Emergency Contraception (EC): indicated after unprotected sex on any day of cycle. Highest risk 6 days up to and including ovulation. From day 21 postpartum. Day 5 post-miscarriage/abortion.
- Cu-IUD: most effective EC. Pre- and post-fertilisation action. Copper affects sperm motility. Endometrial inflammatory reaction prevents implantation. Insert within 5 days of UPSI or 5 days after earliest ovulation. Can be retained for ongoing contraception.
- Ulipristal acetate: progesterone receptor modulator. Up to 120 hours (5 days). Avoid breastfeeding for 1 week after. Reduce efficacy if BMI >85kg or >35kg/m2.
- Levonorgestrel: up to 72 hours. Reduces risk by 85% if taken <24h. Less effective with higher BMI.
- OTC Desogestrel: progestogen-only pill. 75 microgram daily. 12-hour window. No oestrogen = fewer contraindications. Check drug interactions (enzyme inducers reduce efficacy).
- Pharmacy Contraception Service (CPSC): pharmacies can now supply EC and desogestrel.
- Vaginal Infections: Thrush (candida), Bacterial Vaginosis (BV - Gardnerella).
- UTI: Nitrofurantoin via PGD. Eligibility: women 16-64, exclude pregnant, catheter, recurrent UTI, diabetes.
- Urinary incontinence: stress, urge, mixed, overflow types. Pelvic floor exercises, bladder training, anticholinergics.
- Menstrual cycle: ovulation 14 days before next period. Sperm viable up to 5 days. Ovum viable ~24 hours.`,

  'pregnancy-lactation': `Pregnancy and Lactation UCL Pharmacy:
- Teratogenicity: ability of drug to cause foetal abnormalities. Teratogens cross placenta. Critical period = organogenesis (weeks 3-8 post-conception). Historical: thalidomide.
- Over 80% of UK women take medicines during pregnancy.
- Pharmacokinetic changes in pregnancy: increased GFR (affects renally cleared drugs), increased plasma volume (affects distribution), altered hepatic metabolism, reduced albumin, gastric emptying delayed.
- Drug transfer to foetus: passive diffusion across placenta. Affected by molecular weight, lipophilicity, protein binding, ionisation.
- Transfer to breast milk: passive diffusion and active transport. Affected by pKa, protein binding, molecular weight. Milk:plasma ratio.
- Conditions in pregnancy: emesis, hyperemesis, PIH, pre-eclampsia, eclampsia, VTE, gestational diabetes, infections.
- Safe medicines in pregnancy: folate supplements, vitamins, iron, aspirin, metformin/insulin, labetalol, nifedipine, cyclizine, metoclopramide, antacids, PPIs.
- Valproate: teratogen. Neural tube defects, facial malformations, neurodevelopmental disorders. Valproate Pregnancy Prevention Programme (PPP). Risk 10%.
- Valproate alternatives: lamotrigine (safer but monitoring needed), levetiracetam.
- Resources: LactMed, UK Teratology Information Service (UKTIS), BUMPS website.
- Clinical decision making: risks vs benefits. Untreated condition may also harm mother and foetus.
- Pharmacokinetics in lactation: pH of milk ~7.2 (slightly acidic). Weakly basic drugs concentrate in milk. Avoid drugs with high M:P ratio.`,

  'public-health': `Public Health MPharm:
- NHS Health Check: offered to adults 40-74 every 5 years. Screens for CVD risk, diabetes, obesity, dementia risk, alcohol use.
- Health Check components: BMI, blood pressure, blood glucose (HbA1c), cholesterol, AUDIT-C (alcohol), physical activity, smoking status.
- CVD risk calculation: QRISK3 tool. Based on age, sex, ethnicity, smoking, diabetes, BP, cholesterol, family history, deprivation.
- AUDIT-C: 3 questions on alcohol frequency and quantity. >=5 women, >=8 men = hazardous/harmful drinking.
- Gender equity in healthcare: women = 70% health workforce, only 20% organisations have gender parity on boards.
- Occupational segregation: gender norms define caring as female. Men dominate technical specialisms. Individual, organisational and societal factors.
- Gender pay gap: estimated 26% in health and social care (high-income countries). Higher than other sectors.
- Intersectionality (Kimberle Crenshaw 1989): interconnected nature of social categorisations creating overlapping systems of discrimination. Race, class, gender, sexual orientation, disability.
- FIP (International Pharmaceutical Federation): global body representing pharmacy. 144 national organisations, 4 million pharmacists globally.
- Health inequalities: social determinants, deprivation, access, quality of care. Protected characteristics.
- Opioid and gabapentinoid prescribing rates: higher in deprived areas. Public health concern.
- 3 domains of Public Health: Health Improvement, Health Protection, Healthcare Public Health.`,

  'medicines-adherence': `Medicines Adherence Prof. Robert Horne UCL:
- Adherence rates vary between patients and within same patient over time. Non-adherence may be the norm not exception.
- KEY CHALLENGE 1: Adherence rates variable. Most of us are non-adherent some of the time.
- KEY CHALLENGE 2: Information-action gap. Information does not automatically change behaviour.
- Perceptions and Practicalities Approach (PaPA) - NICE endorsed: DON'T WANT TO (perceptions: beliefs, emotions, biases) vs CAN'T (practicalities: capability, resource limitations).
- Necessity-Concerns Framework: patients weigh necessity of medication against concerns. When concerns > necessity = non-adherence. Meta-analytic evidence across multiple conditions.
- Intentional non-adherence: deliberate decision not to take medicines (e.g. fears side effects). Needs motivational approach.
- Unintentional non-adherence: wants to take but can't (forgets, complex regimen, physical difficulty). Needs practical solutions.
- Patient beliefs are the missing link in adherence. Kate case study: 17-year-old asthmatic admitted to ICU with life-threatening respiratory depression. Did not take preventer inhaler due to beliefs.
- Addressing adherence: elicit patient's beliefs, address concerns, simplify regimen, support with practical aids.
- Pharmacists role: identify adherence problems, non-judgmental questioning, shared decision making, medication reviews.`,

  'hospital-pharmacy': `Hospital Pharmacy Workshop 1 PHAY0085:
- Administrative screening: correct drug, dose, route, frequency, duration, legibility, signature, patient details, allergy status documented.
- Clinical screening: appropriateness of indication, dose for renal/hepatic function, drug interactions, contraindications, monitoring.
- Case 1 Manjit Gill: AF on phenytoin. ECG AF, HR 122. Plan: amiodarone + anticoagulation. Pharmacist issues: phenytoin interactions with amiodarone, anticoagulation choice with phenytoin (enzyme inducer), AF management.
- Phenytoin = enzyme inducer. Interacts with warfarin (reduces efficacy), amiodarone (inhibits phenytoin metabolism = toxicity risk). Narrow therapeutic index - monitor levels.
- DOACs vs Warfarin in AF: DOACs preferred. CHA2DS2-VASc score for stroke risk. HAS-BLED for bleeding risk.
- Anticoagulation interactions table (2020): Strong CYP3A4 + P-gp inhibitors affect apixaban and rivaroxaban. Review using BNF, SPC, Stockley's.
- Gentamicin dosing (once daily/extended interval): CrCl >=40: 5mg/kg max 520mg. CrCl 20-39: 3mg/kg max 280mg. CrCl 10-19: 2mg/kg max 120mg. Trough <1mg/L needed. Use CrCl (Cockcroft-Gault) NOT eGFR.
- Cockcroft-Gault: CrCl = (140-age) x weight x constant / serum creatinine. Men 1.23, women 1.04. Use IBW if obese.
- Case 2 Saeed Malik: neutropenic sepsis post-chemo. WBC 2.3, neutrophils 0.9. PIP/TAZ + gentamicin. Gentamicin dose calculation with AjBW if obese. Aminoglycosides: concentration-dependent killing, once-daily maximises peak:MIC ratio.
- NG tube administration: check if formulation suitable, use liquid where possible, check interactions with feed.
- Medicines reconciliation: compare pre-admission, inpatient, discharge medications. Identify discrepancies.`,

  'neurology-oncology': `Neurology and Oncology Workshop PHAY0080/85:
- Epilepsy medicines: valproate (teratogen, Pregnancy Prevention Programme, neural tube defects, neurodevelopmental harm), lamotrigine (safer in pregnancy, requires monitoring, interactions with OCP), levetiracetam (safer profile in pregnancy), phenytoin (enzyme inducer, narrow TI, interactions).
- Valproate PPP: annual review, contraception required, specialist sign-off for under-55 females. 2 independent specialists to justify.
- Parkinson's Disease: dopamine deficiency. Levodopa + carbidopa. COMT inhibitors. MAO-B inhibitors. Dose timing critical - on/off phenomena.
- Dementia: Alzheimer's (acetylcholinesterase inhibitors - donepezil, rivastigmine, galantamine), vascular, Lewy body. NMDA antagonist: memantine for moderate-severe.
- Glioma case (Mr CB): Stage 4 astrocytoma, metastases. PCV chemotherapy (procarbazine, lomustine/CCNU, vincristine). On ramipril, amlodipine, dexamethasone, levetiracetam.
- Vinca alkaloids (vincristine): NPSA Alert 2008. Must NEVER be given intrathecally (fatal). Must be given as IV infusion in mini-bag. Label: FOR INTRAVENOUS USE ONLY - NOT FOR INTRATHECAL USE.
- PCV chemotherapy: palliative in recurrent glioma. Adjuvant = after primary treatment. Neoadjuvant = before primary treatment.
- Dexamethasone in brain tumours: reduces cerebral oedema. Dose tapered as treatment progresses to reduce side effects.
- Levetiracetam preferred in brain tumour seizures: fewer interactions than phenytoin, valproate safer profile, renal excretion.
- Chemotherapy supportive care: antiemetics (5-HT3 antagonists, NK1 antagonists), G-CSF (filgrastim for neutropenia), aciclovir prophylaxis.
- NG tube: check formulation, use liquids/dispersible, separate from enteral feed for critical drugs.
- Ethnicity and cancer journey: barriers to diagnosis, cultural factors, language, trust in healthcare.`,

  'digital-pharmacy': `Digital Pharmacy NHS Digital:
- NHS Digital = national information and technology partner for health and care. Serves 55 million in England. Runs 600+ live services.
- Key systems: EPS (Electronic Prescription Service), SCR (Summary Care Record), EPMA (Electronic Prescribing and Medicines Administration).
- Digital transformation drivers: patient safety, efficiency, data quality, integration, remote working.
- Benefits: real-time prescribing information, reduced transcription errors, clinical decision support, audit trails.
- Challenges: staff training, system interoperability, data security, equity of access, IT infrastructure.
- Pharmacist role in digital health: clinical lead for EPMA, medicines informatics, digital tools implementation.
- AI in pharmacy: clinical decision support, medication safety alerts, pattern recognition in adverse events.
- Strategies for digital change: stakeholder engagement, clinical champions, training, evaluation.
- Informatics skills: understanding coding (SNOMED CT, dm+d), data quality, system configuration.
- Digital prescribing: reduces illegible prescriptions, supports dose banding, allergy checking.`
};

const TOPIC_KEYS = Object.keys(TOPIC_CONTENT);

// ===================== HELPERS =====================
function getTopicContent(topic) {
  const filePath = path.join(__dirname, 'content', `${topic}.txt`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return TOPIC_CONTENT[topic] || TOPIC_CONTENT['clinical-reasoning'];
}

function cleanContent(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .filter(l => !/^(\d+\.\s+[A-Z].*et al|https?:\/\/|doi:|references:|bibliography:|further reading)/i.test(l))
    .join('\n');
}

// ===================== API ROUTES =====================
const QA_SYSTEM = 'UK MPharm MCQ writer. Produce clinically accurate exam questions. Return valid JSON only, no markdown.';

app.post('/api/generate-questions', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'topic is required' });

  let rawContent;
  let topicLabel;

  if (topic === 'all') {
    const selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push(TOPIC_KEYS[Math.floor(Math.random() * TOPIC_KEYS.length)]);
    }
    rawContent = selected.map(k => getTopicContent(k)).join('\n');
    topicLabel = 'Mixed Topics';
  } else {
    rawContent = getTopicContent(topic);
    topicLabel = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  const content = cleanContent(rawContent).substring(0, 2000);

  const userPrompt = `Generate 3 MCQs for a UK final-year MPharm student. Topic: ${topicLabel}.

Return ONLY this JSON (no markdown, no extra text):
{"questions":[{"question":"...","topic":"${topicLabel}","options":["A. ...","B. ...","C. ...","D. ..."],"correctIndex":0,"explanation":"..."}]}

Rules: 4 options (A-D), exactly 1 correct answer, clinically relevant, explanation 1-2 sentences.

CONTENT:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      system: [{ type: 'text', text: QA_SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userPrompt }]
    });

    const text = response.content.map(b => b.text || '').join('');
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.json(parsed);
  } catch (e) {
    console.error('generate-questions error:', e.status, e.message);
    res.status(500).json({ error: e.message || 'Failed to generate questions. Please try again.' });
  }
});

// ===================== CHAT SYSTEM PROMPT =====================
const CHAT_SYSTEM_PROMPT = `You are an expert AI pharmacy tutor for Yasmine, a final-year MPharm student in the UK studying "Preparation for Practice" (PHAY0085) at UCL School of Pharmacy. You have deep knowledge of all her course content.

Your knowledge base covers:
1. CLINICAL REASONING (Parts 1 & 2): Dual Process Theory (System 1 = fast/intuitive, System 2 = slow/analytical), Conscious Competence Model, collaborative clinical reasoning, working vs differential diagnosis, red flags, safety netting, diagnostic uncertainty, risk aversion vs risk management, cognitive biases (anchoring, availability, premature closure, framing), human factors, independent prescriber definition (GPhC).

2. CONSULTATION SKILLS: Calgary-Cambridge model, SOAP notes, ICE model (Ideas Concerns Expectations), open questions, active listening, OARS, person-centred approach, paediatric consultations (Gillick competence, adapting language, building rapport), remote consultations (documentation, consent for recording, technical setup), SBAR handover, non-verbal communication.

3. MOTIVATIONAL INTERVIEWING & HEALTH COACHING: COM-B model (Capability + Opportunity + Motivation = Behaviour), Stages of Change (pre-contemplation, contemplation, preparation, action, maintenance), MI principles (RULE: Resist righting reflex, Understand motivation, Listen, Empower), OARS technique, change talk vs sustain talk, GROW model (Goal, Reality, Options, Way forward), rolling with resistance.

4. PHARMACY FIRST (NHS Advanced Service - 7 clinical pathways):
- UTI: Nitrofurantoin 100mg MR BD x3 days. Eligibility: women 16-64, exclude pregnant/catheter/recurrent UTI/diabetes. MHRA: pulmonary/hepatic ADR warning.
- Sore Throat: FeverPAIN score (Fever, Purulence, Attend rapidly <=3 days, inflamed Tonsils, No cough). Score 4-5 + severe = Phenoxymethylpenicillin 500mg QDS 5 days. Allergy: Clarithromycin/Erythromycin.
- AOM: Children 1-17y. Otoscopy required. First line: Amoxicillin. Red flag: neck stiffness + photosensitivity = meningitis.
- Sinusitis: Fluticasone furoate/Mometasone furoate nasal spray. Antibiotics if bacterial.
- Shingles: Antivirals within 72h.
- Impetigo: Topical hydrogen peroxide or fusidic acid. Oral flucloxacillin.
- Infected insect bites: Flucloxacillin first line.

5. INFECTIONS: E. coli = 77% UTIs. Neutropenic sepsis = neutrophils <1.0 + temp >38 degrees C, antibiotics within 60 minutes, PIP/TAZ + gentamicin. S.pneumoniae, H.influenzae, M.catarrhalis in AOM. VZV = shingles. S.aureus/Streptococcus = impetigo.

6. WOMEN'S HEALTH: Emergency contraception (Cu-IUD most effective within 5 days; Ulipristal up to 120h; LNG up to 72h). OTC Desogestrel 75mcg daily, 12-hour window, progestogen-only. Vaginal infections (thrush = candida, BV = Gardnerella). Urinary incontinence types.

7. PREGNANCY & LACTATION: Teratogenicity critical period = organogenesis weeks 3-8. >80% UK women take medicines in pregnancy. Valproate = teratogen (neural tube defects, neurodevelopmental harm), Pregnancy Prevention Programme required. Safe alternatives: lamotrigine, levetiracetam. PK changes: increased GFR, increased plasma volume, altered hepatic metabolism. Drug transfer to breast milk: passive diffusion, pKa, M:P ratio.

8. PUBLIC HEALTH: NHS Health Check for 40-74 year olds every 5 years. CVD risk = QRISK3. AUDIT-C (>=5 women, >=8 men = hazardous). Gender equity: women = 70% health workforce, 20% organisations have gender parity on boards. Intersectionality (Kimberle Crenshaw 1989). FIP = International Pharmaceutical Federation. 3 domains of Public Health: Health Improvement, Health Protection, Healthcare Public Health.

9. MEDICINES ADHERENCE (Prof Robert Horne): Necessity-Concerns Framework (weigh necessity vs concerns). PaPA approach (NICE): DON'T WANT TO (perceptions) vs CAN'T (practicalities). Intentional vs unintentional non-adherence. Information-action gap.

10. HOSPITAL PHARMACY (Workshop 1): Drug chart screening (administrative + clinical). Cockcroft-Gault: CrCl = (140-age) x weight x k / serum creatinine (k=1.23 men, 1.04 women). Use CrCl not eGFR for gentamicin. IBW men = 50 + 2.3x(height inches - 60), women = 45 + 2.3x(height inches - 60). AjBW = IBW + 0.4x(ABW - IBW). Gentamicin once daily: CrCl >=40 = 5mg/kg (max 520mg); 20-39 = 3mg/kg; 10-19 = 2mg/kg. Trough <1mg/L. Phenytoin = enzyme inducer, narrow therapeutic index, interacts with amiodarone. DOACs vs Warfarin in AF: use CHA2DS2-VASc for stroke risk.

11. NEUROLOGY & ONCOLOGY: Valproate PPP (annual review, contraception, specialist sign-off for females <55). PCV chemotherapy (procarbazine, lomustine, vincristine) for glioma. Vinca alkaloids: NPSA Alert 2008 = NEVER intrathecal, IV infusion in minibag only. Dexamethasone in brain tumours = reduces cerebral oedema, taper dose. Levetiracetam preferred in brain tumour seizures (fewer interactions). Chemotherapy supportive care: 5-HT3 antagonists, NK1 antagonists, G-CSF, aciclovir prophylaxis.

12. DIGITAL PHARMACY: NHS Digital = national IT partner. EPMA, EPS, SCR. Digital transformation benefits: reduced errors, clinical decision support, audit trails. Pharmacist role as clinical lead for EPMA.

INSTRUCTIONS:
- Be accurate, detailed and exam-focused in all responses
- Use UK clinical guidelines (NICE, BNF, GPhC standards)
- When giving drug doses, always be precise and complete
- Structure answers clearly with bullet points or numbered lists when appropriate
- If asked about a drug interaction or clinical scenario, walk through the reasoning step by step
- You can also help with exam technique and study tips
- Keep responses focused but thorough — exam questions reward precision
- Always clarify if something is a first-line vs second-line treatment`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: [{ type: 'text', text: CHAT_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: messages.slice(-6)
    });
    const reply = response.content.map(b => b.text || '').join('').trim();
    res.json({ reply });
  } catch (e) {
    console.error('chat error:', e.message);
    res.status(500).json({ error: 'Failed to get response. Please try again.' });
  }
});

// ===================== START =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Yasmine Studies running at http://localhost:${PORT}`);
  console.log(`Content folder: ${path.join(__dirname, 'content')} (optional — falls back to built-in text if missing)`);
});
