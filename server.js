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
  'global-health': `Global Health - Post COVID-19 Impact on Social Determinants of Health:
- Social determinants of health (SDOH): conditions in which people are born, grow, live, work and age. Include income, education, employment, housing, food security, social support.
- COVID-19 widened health inequalities: disproportionate impact on ethnic minorities, deprived communities, elderly, disabled people.
- WHO Commission on Social Determinants: daily living conditions + structural drivers of inequity = health outcomes. Requires action beyond healthcare sector.
- Post-pandemic recovery priorities: rebuilding primary care access, mental health services, vaccination programmes, addressing long COVID.
- Health inequalities in UK: life expectancy gap between most and least deprived areas = 10 years for men, 7 years for women.
- Marmot Review 2020: health inequalities worsening. Recommendations: early child development, education, employment, living standards, social protection.
- Pharmacy role in addressing SDOH: community access point, health checks, signposting, vaccinations, smoking cessation, healthy living pharmacies.
- COVID-19 impact: disrupted cancer screening, elective care backlogs, increased mental health burden, exacerbated digital divide.
- One Health approach: human, animal, environmental health are interconnected. Antimicrobial resistance, zoonotic diseases, climate change.
- SDG3 (Sustainable Development Goal): Good Health and Well-Being. Universal Health Coverage target by 2030.`,

  'diabetes': `Diabetes MPharm:
- Type 1 Diabetes: autoimmune destruction of beta cells. Absolute insulin deficiency. Presents in younger patients. DKA risk. Requires insulin always.
- Type 2 Diabetes: insulin resistance + progressive beta cell failure. Associated with obesity, sedentary lifestyle, family history. Most common type (90%).
- Diagnosis: HbA1c >=48 mmol/mol (6.5%) on two occasions, OR fasting glucose >=7.0 mmol/L, OR 2-hour OGTT >=11.1 mmol/L, OR random glucose >=11.1 with symptoms.
- HbA1c targets: generally 48 mmol/mol (6.5%) for newly diagnosed; 53 mmol/mol (7.0%) if on drugs causing hypoglycaemia.
- Metformin: first line T2DM. Biguanide. Decreases hepatic glucose production. Renal dose reduction: eGFR 30-45 reduce dose, stop if <30. Risk of lactic acidosis. GI side effects. Cardioprotective.
- SGLT2 inhibitors (gliflozins - empagliflozin, dapagliflozin, canagliflozin): glucosuria, weight loss, BP reduction, cardioprotective, renoprotective. Risk: DKA, UTI, Fournier's gangrene, volume depletion. Stop before surgery.
- GLP-1 receptor agonists (semaglutide, liraglutide, dulaglutide): weight loss, CV benefit. Injectable (or oral semaglutide). GI side effects. Not in pancreatitis history.
- Insulin types: rapid (aspart, lispro), short (soluble), intermediate (isophane), long-acting (glargine, detemir, degludec). Basal-bolus regimen common in T1DM.
- Complications: microvascular (retinopathy, nephropathy, neuropathy), macrovascular (CVD, stroke, peripheral arterial disease).
- Sick day rules: continue metformin unless vomiting. Stop SGLT2i if acutely unwell (DKA risk). Monitor glucose more frequently.
- Hypoglycaemia: <4 mmol/L. Symptoms: sweating, tremor, confusion. Treatment: 15-20g fast-acting carbohydrate. Glucagon if unconscious.`,

  'adherence-support': `Principles and Practice of Adherence Support - Prof Robert Horne UCL:
- Adherence = extent to which patient's behaviour corresponds with agreed recommendations. Encompasses initiation, implementation, discontinuation.
- Non-adherence may be the norm: average adherence to long-term medicines is 50%. Variable between and within patients over time.
- Information-action gap: giving patients information does not automatically change behaviour.
- Perceptions and Practicalities Approach (PaPA) - NICE CG76 endorsed: two root causes of non-adherence.
- DON'T WANT TO (perceptions): driven by beliefs, concerns, attitudes, emotional responses. Intentional non-adherence. Needs motivational/cognitive approach.
- CAN'T (practicalities): capability limitations, resource constraints, memory, physical difficulties. Unintentional non-adherence. Needs practical solutions.
- Necessity-Concerns Framework (NCF): patients weigh necessity of medication against concerns about taking it. When concerns outweigh necessity = non-adherence. Meta-analytic evidence across 18,000+ patients.
- Beliefs About Medicines Questionnaire (BMQ): measures necessity and concerns. Validated tool.
- Addressing intentional non-adherence: elicit and address specific concerns, provide accurate information, involve patient in decision-making.
- Addressing unintentional non-adherence: simplify regimen, dose aids (compliance aids), reminders, establish routine, involve carer.
- Pharmacist role: medication reviews, non-judgmental questioning, shared decision-making, addressing practical barriers.
- NICE CG76 (2009): Medicines Adherence - involving patients in decisions and supporting adherence. Key principles: patient-centred, explore beliefs, support practical needs.`,

  'surgery': `Perioperative Medicines Management - Surgery:
- Medicines to CONTINUE perioperatively: antihypertensives (except ACE inhibitors/ARBs on day of surgery), statins, antiepileptics, thyroid medications, corticosteroids (increase dose for stress), inhalers, eye drops.
- Medicines to STOP before surgery: metformin (stop 48h before if contrast/major surgery), SGLT2 inhibitors (stop 3 days before - DKA risk), warfarin (stop 5 days before, bridge with LMWH if high risk), DOACs (stop 24-48h before depending on renal function), NSAIDs (stop 7 days before), COX-2 inhibitors.
- ACE inhibitors/ARBs: hold on morning of surgery to prevent intraoperative hypotension. Restart when patient eating/drinking.
- VTE prophylaxis: NICE NG89. Mechanical (compression stockings, IPC devices) + pharmacological (LMWH). Risk assessment using Caprini/NICE tool. Duration depends on surgery type.
- Anticoagulation bridging: warfarin patients with high thromboembolic risk. Stop warfarin, give LMWH perioperatively, restart warfarin post-op. High risk = mechanical heart valves, AF + prior stroke.
- Enhanced Recovery After Surgery (ERAS): carbohydrate loading pre-op, early feeding, early mobilisation, multimodal analgesia, minimise opioids, reduce IV fluids.
- Stress dose steroids: patients on long-term corticosteroids need supplemental hydrocortisone perioperatively due to adrenal suppression (HPA axis).
- Insulin management: variable rate IV insulin infusion (VRIII) for T1DM and most T2DM. Target glucose 6-10 mmol/L perioperatively.
- Antibiotic prophylaxis: given at induction. Covers expected organisms. E.g. co-amoxiclav for colorectal surgery. Single dose unless prolonged surgery.
- NSAIDs and renal risk: avoid perioperatively due to renal impairment risk, fluid retention, bleeding.`,

  'liver': `Liver Disease and Hepatic Drug Dosing:
- Liver functions: metabolism (CYP450 enzymes), synthesis (albumin, clotting factors, glucose), storage (glycogen, vitamins), excretion (bile, bilirubin), detoxification.
- Liver Function Tests (LFTs): ALT/AST (hepatocellular damage), ALP/GGT (cholestasis/biliary), bilirubin (excretion), albumin (synthetic function), PT/INR (coagulation).
- Child-Pugh Score: assesses severity of cirrhosis. Parameters: bilirubin, albumin, PT, ascites, encephalopathy. Class A (5-6) = mild, B (7-9) = moderate, C (10-15) = severe.
- MELD score (Model for End-stage Liver Disease): creatinine, bilirubin, INR. Used for transplant prioritisation.
- Hepatic impairment drug dosing: avoid drugs with extensive first-pass metabolism, hepatotoxic drugs, those causing fluid retention. Reduce doses of hepatically metabolised drugs in Child-Pugh B/C.
- Drugs to avoid in hepatic impairment: NSAIDs (GI bleed + renal risk), opioids (hepatic encephalopathy risk), statins (caution), metformin (lactic acidosis), rifampicin.
- Alcohol-related liver disease: fatty liver -> alcoholic hepatitis -> cirrhosis. Abstinence is key treatment. Steroids for severe alcoholic hepatitis (Maddrey discriminant function >32).
- NAFLD (Non-Alcoholic Fatty Liver Disease): associated with obesity, T2DM, metabolic syndrome. Lifestyle modification first line. May progress to NASH, cirrhosis.
- Cirrhosis complications: portal hypertension, oesophageal varices (beta-blockers prophylaxis, banding), ascites (spironolactone +/- furosemide, low sodium diet), spontaneous bacterial peritonitis (SBP), hepatic encephalopathy (lactulose, rifaximin), hepatorenal syndrome.
- Paracetamol overdose: N-acetylcysteine treatment. Nomogram to determine treatment threshold.`,

  'renal-impairment': `Renal Impairment - AKI and CKD:
- Acute Kidney Injury (AKI): rapid decline in renal function over hours-days. AKIN staging: Stage 1 (creatinine x1.5-1.9 baseline or rise >=26 micromol/L), Stage 2 (x2.0-2.9), Stage 3 (x3.0 or >354 micromol/L or dialysis).
- AKI causes: Pre-renal (hypovolaemia, sepsis, heart failure), Intrinsic (ATN, glomerulonephritis, drug toxicity), Post-renal (obstruction - stones, BPH).
- AKI STOP drugs: NSAIDs, ACE inhibitors, ARBs, diuretics, aminoglycosides, contrast agents, metformin. "SADMANS" = Sulfonamides, ACEi, Diuretics, Metformin, ARBs, NSAIDs, SGLT2i.
- Chronic Kidney Disease (CKD): progressive irreversible loss of renal function over months-years. Stages 1-5 based on eGFR. Stage 5 = <15 mL/min/1.73m2 (kidney failure).
- eGFR (estimated GFR): calculated from serum creatinine, age, sex. Used for CKD staging. NOT for drug dosing.
- Cockcroft-Gault equation: CrCl = (140-age) x weight x constant / serum creatinine. Constant = 1.23 men, 1.04 women. USE FOR DRUG DOSING. Use IBW if obese.
- Drug dosing in renal impairment: reduce dose and/or increase interval. Consult BNF/SPC. Drugs renally excreted need adjustment.
- Nephrotoxic drugs to avoid: NSAIDs, aminoglycosides (monitor levels), vancomycin (monitor levels), contrast media, lithium, ciclosporin.
- Dose adjustments: gentamicin (CrCl-based dosing), digoxin (reduce in renal impairment), metformin (stop if eGFR <30), DOACs (dose adjust or avoid based on CrCl).
- CKD complications: anaemia (EPO deficiency - treat with ESA + iron), hypertension, metabolic acidosis, hyperphosphataemia, secondary hyperparathyroidism, cardiovascular disease.
- Monitoring: U+E (urea, electrolytes, creatinine), eGFR, urine ACR (albumin:creatinine ratio for proteinuria).`,

  'leadership': `Leadership and Patient Safety in Healthcare:
- Mid Staffordshire NHS Trust Scandal: Francis Report 2013. Between 400-1200 excess deaths 2005-2009. Failures: poor culture, bullying, targets over care, failure to listen to patients/staff.
- Key failures identified: lack of openness, inadequate staffing, poor governance, regulatory failure, culture of fear.
- Ockenden Report 2022: maternity failings at Shrewsbury and Telford NHS Trust. 201 babies died unnecessarily. Failures to investigate, learn, implement change.
- HSIB (Healthcare Safety Investigation Branch): independent investigation of serious patient safety incidents. Learning not blame.
- Duty of Candour (statutory): organisations must be open with patients when things go wrong. Apologise, explain, support.
- Speaking Up: Freedom to Speak Up Guardians in NHS trusts since 2016. NHS staff can raise concerns without fear of reprisal.
- Psychological safety (Amy Edmondson): belief that one can speak up without fear of punishment. Essential for safety culture and learning.
- NHS Leadership Academy: Healthcare Leadership Model. 9 leadership dimensions including inspiring shared purpose, engaging the team, holding to account.
- Patient safety culture vs blame culture: safety culture = learning from error, systems thinking, no blame for honest mistakes. Blame culture = individual punishment, concealment, repeated errors.
- Compassionate leadership (Michael West): attending, understanding, empathising, helping. Reduces burnout, improves care quality.
- Human factors (systems thinking): errors result from system failures not just individual failure. Swiss Cheese Model (Reason). Latent and active failures.
- GPhC standards: pharmacists must raise concerns about risk to patient safety. Professional obligation to speak up.`,

  'anaemia': `Anaemia - Types, Diagnosis and Treatment:
- Anaemia definition: Hb <130 g/L men, <120 g/L women (WHO). Reduced oxygen-carrying capacity.
- Iron Deficiency Anaemia (IDA): most common. Microcytic, hypochromic. Low ferritin (<15 microg/L), low serum iron, high TIBC. Causes: blood loss (GI, menstrual), poor intake, malabsorption (coeliac).
- IDA treatment: oral ferrous sulfate 200mg TDS (= 65mg elemental iron per tablet). Take on empty stomach. Vitamin C enhances absorption. Side effects: constipation, dark stools, nausea. IV iron if oral not tolerated or rapid repletion needed.
- Vitamin B12 deficiency anaemia: macrocytic, megaloblastic. Causes: pernicious anaemia (anti-intrinsic factor antibodies), vegans/vegetarians, malabsorption. Neurological complications (subacute combined degeneration of cord).
- B12 treatment: hydroxocobalamin IM injections (1mg). If dietary: oral cyanocobalamin. Monitor: 3-monthly injections for pernicious anaemia lifelong.
- Folate deficiency anaemia: macrocytic, megaloblastic. Causes: poor diet, pregnancy, methotrexate, phenytoin. Folic acid 5mg daily. Important in pregnancy (neural tube defect prevention - 400 microg daily pre-conception).
- Anaemia of Chronic Disease (ACD): normocytic or microcytic. Associated with chronic inflammation (RA, CKD, malignancy). Normal/high ferritin. Low serum iron. Treat underlying condition. ESA in CKD.
- Haemolytic anaemia: premature red cell destruction. Intravascular (G6PD deficiency, drug-induced) or extravascular (autoimmune). Raised bilirubin, LDH, reticulocytes. Reduced haptoglobin.
- Sickle cell disease: HbS mutation. Sickling in hypoxia. Crises: vaso-occlusive (pain), acute chest syndrome, stroke. Treatment: hydroxyurea, exchange transfusion, penicillin prophylaxis.
- Investigations: FBC, blood film, reticulocyte count, iron studies, B12/folate, haemolytic screen.`,

  'medicines-safety': `Medicines Safety, NPSA Alerts and Medication Errors:
- NPSA (National Patient Safety Agency) Alerts: mandatory safety actions. Types: Patient Safety Alert (immediate action), Drug Safety Update (regulatory information).
- Never Events: serious, largely preventable patient safety incidents. Examples: wrong-route medication errors (intrathecal vincristine), retained instruments post-surgery, wrong-site surgery.
- Vincristine: NPSA Alert 2008. NEVER give intrathecally (causes death). Must be given as IV infusion in minibag. Bags labelled "FOR INTRAVENOUS USE ONLY - NOT FOR INTRATHECAL USE".
- High-risk medicines: insulin, anticoagulants (warfarin, heparin, DOACs), potassium chloride concentrate, concentrated sodium chloride, opioids, methotrexate, lithium, cytotoxics.
- Methotrexate: once WEEKLY not daily. Dispensed with blue "ONCE WEEKLY" stickers. Dispensing error (daily instead of weekly) = potentially fatal. Monitoring: FBC, LFTs, renal function.
- Insulin safety: never abbreviate "units" (write in full - prevents 10x overdose). Correct device selection. Never draw up from pen cartridge.
- Yellow Card Scheme (MHRA): voluntary reporting of adverse drug reactions by healthcare professionals, patients, carers. Reports for all reactions to new drugs (Black Triangle), serious reactions to established drugs.
- MHRA Drug Safety Updates: mandatory monitoring requirements. Examples: valproate (PPP), methylphenidate (cardiovascular), fluoroquinolones (aortic aneurysm risk).
- Polypharmacy: 5+ regular medicines. Problematic polypharmacy = inappropriate, where harm outweighs benefit. Medication review, deprescribing, STOPP/START criteria.
- Medication reconciliation: process of comparing medicines on admission/discharge to prevent errors. Discrepancies must be resolved.
- Dispensing errors: wrong drug, wrong dose, wrong patient, wrong route, omission. Systematic approach: double-checking, automation, clear labelling, near-miss reporting culture.`,

  'digital-pharmacy': `Digital Pharmacy - NHS Digital Transformation:
- NHS Digital = national information and technology partner for health and care in England. Serves 55 million people. Runs 600+ live services.
- EPS (Electronic Prescription Service): electronic transmission of prescriptions from prescriber to dispenser. Reduces paper, improves accuracy, enables electronic repeat dispensing.
- SCR (Summary Care Record): national patient record with core information (medicines, allergies, adverse reactions). Available to authorised NHS staff. Patients can add additional information.
- EPMA (Electronic Prescribing and Medicines Administration): replaces paper drug charts. Reduces prescribing and administration errors. Clinical decision support built in.
- Shared Care Records: local/regional sharing of patient records between NHS organisations. Improves continuity of care.
- NHS App: patient-facing digital tool. Access to GP records, prescriptions, appointments, COVID certificates, organ donation registration.
- Clinical decision support: alerts for drug interactions, allergies, duplicate medications, renal/hepatic dose adjustments. Integrated into EPMA and dispensing systems.
- dm+d (Dictionary of Medicines and Devices): NHS standard coding system for medicines. Ensures consistent identification across systems.
- SNOMED CT: clinical terminology standard used in NHS records. Enables data sharing and analytics.
- Interoperability challenges: legacy systems, different standards, data governance, cultural resistance to change.
- AI in pharmacy: pattern recognition in adverse events, workload prediction, automated dispensing, clinical decision support, medication safety alerts.
- Pharmacist role in digital health: clinical lead for EPMA implementation, medicines informatics specialist, digital champion, training staff, system configuration.`,

  'womens-health': `Women's Health - Contraception and Reproductive Health:
- Emergency Contraception (EC): indicated after unprotected sex (UPSI) or contraceptive failure. Highest risk days = 6 days up to and including ovulation day.
- Cu-IUD (Copper coil): most effective EC (>99%). Works pre- and post-fertilisation. Insert within 5 days of UPSI or 5 days after earliest possible ovulation. Retained for ongoing contraception (up to 10 years).
- Ulipristal acetate (ellaOne): progesterone receptor modulator. Effective up to 120 hours (5 days) after UPSI. More effective than LNG at 72-120h. Avoid breastfeeding 1 week after. Reduced efficacy if BMI >85kg or >35 kg/m2 (but still use).
- Levonorgestrel (Levonelle): effective up to 72 hours. Reduces pregnancy risk by 85% if taken <24h. Less effective with higher BMI. Available OTC.
- OTC Desogestrel (Cerelle, Cerazette): progestogen-only pill. 75 microgram daily. 12-hour window for missed pill (vs 3h for other POPs). No oestrogen = fewer contraindications. Enzyme inducers reduce efficacy.
- CPSC (Community Pharmacist Consultation Service) and Pharmacy Contraception Service: pharmacists can supply EC and desogestrel under PGD.
- Vaginal infections: Thrush (Candida albicans) - itching, white discharge, treat with clotrimazole or fluconazole. BV (Bacterial Vaginosis - Gardnerella) - fishy odour, grey discharge, treat with metronidazole.
- Urinary incontinence: stress (coughing/sneezing - pelvic floor exercises), urge (OAB - bladder training, antimuscarinics, mirabegron), mixed, overflow.
- Menstrual cycle: 28-day average. Ovulation day 14 (14 days before next period). Sperm viable up to 5 days. Ovum viable ~24 hours.
- Chlamydia: most common bacterial STI. Often asymptomatic. Treat: azithromycin 1g single dose or doxycycline 100mg BD 7 days. Partner notification essential.`,

  'mental-health': `Mental Health - Bipolar, Schizophrenia, Depression, Anxiety:
- Bipolar Disorder: episodes of mania and depression. Type 1 (mania + depression), Type 2 (hypomania + depression).
- Lithium: mood stabiliser for bipolar. Narrow therapeutic index. Target level 0.4-1.0 mmol/L (0.8-1.0 for acute mania). Monitor: renal function, TFTs, serum levels. Toxicity: tremor, polyuria, GI upset, confusion (>1.5 mmol/L), seizures (>2.0 mmol/L). Avoid dehydration, NSAIDs (increase lithium levels), ACE inhibitors. Teratogenic (Ebstein's anomaly).
- Schizophrenia: psychosis, positive symptoms (hallucinations, delusions, disorganised thinking) and negative symptoms (avolition, flat affect, alogia).
- Antipsychotics: D2 receptor antagonism. Typical (haloperidol, chlorpromazine) vs Atypical (olanzapine, risperidone, quetiapine, aripiprazole). Atypicals preferred (fewer EPSEs but more metabolic side effects).
- Clozapine: for treatment-resistant schizophrenia (failed 2 antipsychotics). Requires Clozapine Patient Monitoring Service. Risk: agranulocytosis (life-threatening neutropenia). Weekly FBC for 18 weeks, then 2-weekly, then 4-weekly.
- Depression: PHQ-9 screening tool. Mild-moderate: CBT, lifestyle. Moderate-severe: SSRIs first line (fluoxetine, sertraline, citalopram).
- SSRI side effects: GI upset initially, sexual dysfunction, serotonin syndrome (with MAOIs/tramadol), increased suicidal ideation initially in under-25s. Discontinuation syndrome (except fluoxetine - long half-life).
- Anxiety: GAD-7 screening. SSRIs/SNRIs first line for GAD. Benzodiazepines: short-term only (tolerance/dependence risk). Z-drugs similarly.
- Mental Health Act 1983 (amended 2007): Section 2 (assessment 28 days), Section 3 (treatment 6 months), Section 136 (police - public place). Pharmacist role: prepare medicines for detained patients.
- NICE guidelines: depression (CG90/NG222), bipolar (CG185), schizophrenia (NG185).`,

  'cns': `CNS - Epilepsy, MS, Dementia, Parkinson's Disease:
- Epilepsy - AED selection: focal seizures: lamotrigine or carbamazepine. Generalised: valproate (avoid in women of childbearing potential), lamotrigine, levetiracetam.
- Valproate: highly effective but teratogen. Neural tube defects (1-2%), facial malformations, neurodevelopmental disorders (30-40% risk). Valproate Pregnancy Prevention Programme (PPP): specialist initiation, annual review, contraception required, yellow card to patient/carer, 2 specialists to override in females under 55.
- Lamotrigine: safer in pregnancy but requires careful dose titration. Interactions with OCP (OCP reduces lamotrigine levels). Rash risk (Stevens-Johnson syndrome) - slow titration.
- Levetiracetam: broad spectrum, renally excreted, few interactions, safer pregnancy profile. Psychiatric side effects: mood changes, aggression.
- Phenytoin: enzyme inducer (CYP3A4, 2C9). Narrow therapeutic index. Interactions: warfarin, OCP, DOACs, amiodarone, statins. Zero-order kinetics at therapeutic doses.
- Multiple Sclerosis (MS): autoimmune demyelination. Relapsing-remitting (RRMS) most common. Disease-modifying therapies: interferon-beta, glatiramer, natalizumab, alemtuzumab, ocrelizumab.
- Dementia - Alzheimer's disease: progressive cognitive decline. Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for mild-moderate. Memantine (NMDA antagonist) for moderate-severe.
- Parkinson's Disease: dopamine deficiency in substantia nigra. Levodopa + carbidopa (peripheral decarboxylase inhibitor). On/off phenomena. MAO-B inhibitors (selegiline, rasagiline). COMT inhibitors (entacapone). Dopamine agonists (ropinirole, pramipexole). Drug-induced Parkinsonism: metoclopramide, haloperidol (D2 blockade).
- Vincristine NPSA Alert 2008: NEVER give intrathecally. Only IV infusion in minibag. Fatal if given intrathecally.`,

  'pregnancy-lactation': `Pregnancy and Lactation - Pharmacology and Drug Safety:
- Teratogenicity: ability of drug to cause foetal abnormalities. Critical period = organogenesis (weeks 3-8 post-conception). Risk exists throughout pregnancy.
- Historical teratogens: thalidomide (limb defects), diethylstilboestrol (vaginal adenocarcinoma in offspring), isotretinoin (craniofacial defects - strict PPP).
- Over 80% of UK women take at least one medicine during pregnancy.
- Pharmacokinetic changes in pregnancy: increased GFR (renal clearance increased), increased plasma volume 50% (affects drug distribution), decreased albumin (more free drug), increased hepatic blood flow and CYP enzymes, delayed gastric emptying.
- Drug transfer to foetus: passive diffusion across placenta. Factors: molecular weight (<600 Da crosses more easily), lipophilicity (higher = more transfer), protein binding (free drug crosses), ionisation state.
- Transfer to breast milk: passive diffusion + active transport. Milk pH ~7.2 (slightly acidic vs plasma 7.4). Weakly basic drugs (pKa >7.2) concentrate in milk. Milk:Plasma (M:P) ratio. High M:P = more drug in milk.
- Resources: UKTIS (UK Teratology Information Service) - professional resource. BUMPS website (Best Use of Medicines in Pregnancy) - patient resource. LactMed (NCBI) - lactation database.
- Valproate in pregnancy: AVOID. Risk neural tube defects, craniofacial defects, cognitive impairment. PPP mandatory. If essential, folic acid 5mg daily, specialist supervision.
- Safe medicines: folic acid, iron, paracetamol, antacids, PPIs, labetalol, methyldopa, nifedipine, cyclizine, metoclopramide, insulin, aspirin 75mg (pre-eclampsia prevention).
- Gestational diabetes: metformin and/or insulin. OGTT at 24-28 weeks if risk factors. Target: fasting <5.3 mmol/L, 1h post-meal <7.8.
- Pre-eclampsia: hypertension + proteinuria after 20 weeks. Aspirin 75-150mg from 12 weeks in high-risk women.`,

  'pharmacy-first': `Pharmacy First NHS Advanced Service - 7 Clinical Pathways:
- 7 clinical conditions: Uncomplicated UTI (women 16-64), Acute Sore Throat, Acute Otitis Media (AOM), Acute Sinusitis, Infected Insect Bites, Shingles, Impetigo.
- UTI: Nitrofurantoin 100mg MR twice daily for 3 days. Take with food. Warn: urine may turn brown. MHRA warning: pulmonary/hepatic ADR with long-term use. Exclusions: pregnancy, recurrent UTI (>=2 in 6 months or 3 in 12), catheter, diabetes, age <16 or >64, immunocompromised, male, signs of upper UTI.
- Sore Throat: FeverPAIN score - Fever, Purulence, Attend rapidly (<=3 days onset), inflamed Tonsils, No cough/coryza. Score 4-5 = antibiotic. First line: Phenoxymethylpenicillin 500mg QDS for 5 days adults. Penicillin allergy: Clarithromycin 250mg BD 5 days. Centor criteria alternative (4 = consider antibiotic).
- AOM: Children 1-17 years. Otoscopy required. First line: Amoxicillin. Exclusions: recurrent AOM. Red flags: neck stiffness + photosensitivity = meningitis emergency.
- Sinusitis: fluticasone furoate or mometasone furoate nasal spray. Antibiotics if bacterial (symptoms >10 days, worsening). Rule out migraine if no nasal symptoms.
- Shingles: antivirals (aciclovir 800mg 5x daily or valaciclovir) within 72 hours. Ophthalmic/Ramsay Hunt = immediate referral. Immunocompromised = refer.
- Impetigo: bullous vs non-bullous. Topical: hydrogen peroxide 1% cream (non-bullous) or fusidic acid (limited use due to resistance). Oral: flucloxacillin 500mg QDS 5 days. Allergy: erythromycin or co-trimoxazole.
- Infected insect bites: flucloxacillin first line. Cellulitis signs = spreading redness, warmth, pain, systemic symptoms. Anaphylaxis = emergency. Penicillin allergy: clarithromycin.
- All consultations: SOAP documentation, safety netting, differential diagnosis, red flags. TARGET antibiotic leaflets for all antibiotic supplies.`,

  'paediatrics': `Paediatrics - Medicines in Children:
- Paediatric pharmacokinetics differ from adults: absorption (variable gastric pH, slower motility), distribution (higher body water/weight ratio in neonates - larger Vd for water-soluble drugs), metabolism (immature CYP450 in neonates, higher rates in children 1-10y), excretion (reduced GFR in neonates).
- Weight-based dosing: mg/kg dosing. Use actual body weight unless obese (then ideal body weight). Always double-check dose calculations in paediatrics.
- Age groups: neonate (0-28 days), infant (1 month-2 years), child (2-12 years), adolescent (12-18 years). Pharmacokinetics vary significantly between groups.
- Formulations: age-appropriate formulations essential. Liquids for young children. Taste masking important. Dispersible tablets. Avoid small tablets/capsules in young children (choking risk).
- Off-label medicines: most medicines prescribed in children are unlicensed or off-label. Informed consent required. Prescriber takes responsibility. BNFc (British National Formulary for Children) is key reference.
- Gillick competence: child under 16 who fully understands proposed treatment can consent without parental involvement (Gillick v West Norfolk 1985). Assess on case-by-case basis.
- Fraser guidelines: specifically for contraception in under-16s. Criteria to provide contraception without parental consent.
- MHRA/EMA Paediatric Regulations: require pharmaceutical companies to conduct paediatric studies for new medicines.
- Child safeguarding: recognise signs of abuse/neglect. Duty to report concerns. Pharmacists in community are well-placed to identify at-risk children.
- Common paediatric medicines: amoxicillin (5mg/kg TDS for AOM), paracetamol (15mg/kg QDS), ibuprofen (5-10mg/kg TDS, avoid <3 months), oral rehydration salts.
- Fever management: paracetamol or ibuprofen (avoid ibuprofen in chickenpox). Do NOT give both simultaneously as routine. Tepid sponging no longer recommended.`,

  'communication-skills': `Communication Skills - Consultations and Handover:
- Calgary-Cambridge model: 5 tasks - Initiating the session, Gathering information, Physical examination, Explanation and planning, Closing the session. Process skills run throughout (building relationship, providing structure).
- Communication = two-way process of reaching mutual understanding within a caring relationship.
- ICE model: Ideas (what does patient think is wrong?), Concerns (what are they worried about?), Expectations (what do they want from this consultation?). Essential for patient-centred care.
- SOAP notes: Subjective (patient's history, symptoms), Objective (clinical findings, observations, results), Assessment (working/differential diagnosis), Plan (management, follow-up, safety netting).
- Open questions: begin consultation. "Tell me about...", "How can I help?". Allow patient to tell their story.
- Active listening skills: attentive silence, nodding, eye contact, verbal encouragers ("mm-hmm"), reflecting, summarising, clarifying.
- OARS (from MI): Open questions, Affirmations, Reflective listening, Summaries. Core communication technique.
- Non-verbal communication: eye contact, facial expression, body posture, proxemics (personal space), paralanguage (tone, pace, pitch). Particularly important to be aware of in cross-cultural consultations.
- SBAR handover: Situation (current problem), Background (relevant history), Assessment (clinician's view), Recommendation (action needed). Used for handover between clinicians.
- Remote/telephone consultations: establish rapport quickly, check hearing/technology, safety-net more carefully, document consultation type, obtain consent if recording, know when to refer to face-to-face.
- Paediatric consultations: direct questions to child where appropriate, involve parents, use age-appropriate language, build rapport before clinical questions, consider Gillick competence for older children.
- Breaking bad news: SPIKES model (Setting, Perception, Invitation, Knowledge, Empathy, Summarise/Strategy).`,

  'public-health': `Public Health - Population Health and NHS Health Check:
- NHS Health Check: offered to adults 40-74 years, every 5 years. Screens for CVD risk, diabetes, obesity, dementia risk (over 65), alcohol use.
- NHS Health Check components: BMI/waist circumference, blood pressure, fasting blood glucose (HbA1c), lipid profile, AUDIT-C (alcohol use), physical activity, smoking status, family history, ethnicity.
- CVD risk calculation: QRISK3 tool. Variables: age, sex, ethnicity, deprivation (Townsend score), smoking, diabetes, systolic BP, total:HDL cholesterol ratio, family history, BMI, CKD, AF, RA, systolic BP variability.
- Cardiovascular risk reduction: statins if QRISK3 >=10% (aged 40+) or if established CVD. Lifestyle: diet, exercise, smoking cessation, alcohol reduction.
- AUDIT-C: 3-question alcohol screener. Frequency + quantity + binge drinking. Score >=5 women, >=8 men = hazardous/harmful drinking. AUDIT-C part of NHS Health Check.
- 3 domains of Public Health: Health Improvement (lifestyle, inequalities, health promotion), Health Protection (infectious disease, environmental hazards, emergency preparedness), Healthcare Public Health (service planning, evaluation, evidence).
- Social determinants of health: income, education, employment, housing, food security, social networks, access to healthcare. Wider determinants have greater influence on health than healthcare.
- Health inequalities: systematic, avoidable differences in health between social groups. Protected characteristics (Equality Act 2010): age, sex, race, disability, religion, sexual orientation, gender reassignment, pregnancy, marriage.
- Pharmacist public health role: NHS Health Check delivery, vaccination, smoking cessation, alcohol screening, health promotion, signposting, healthy living pharmacy.
- NICE PHGs (Public Health Guidelines): smoking cessation, weight management, physical activity, alcohol, sexual health.`,

  'gender-equity': `Gender Equity in Pharmacy and Healthcare:
- FIP (International Pharmaceutical Federation) Gender Equity Report 2021: pharmacy profession is female-majority globally (57% pharmacists female) but leadership is male-dominated.
- Glass ceiling: women underrepresented in senior leadership despite being majority workforce. In UK healthcare: women = 77% NHS workforce but <50% board-level positions.
- Gender pay gap in pharmacy/healthcare: estimated 20-26% in health and social care. Structural factors: part-time working patterns, career breaks for caring, undervaluation of "feminised" work.
- Occupational segregation: horizontal (women in community/clinical, men in industrial/academic pharmacy) and vertical (men dominate senior roles). Gender norms shape career choices.
- Intersectionality (Kimberle Crenshaw 1989): race, gender, class, disability, sexual orientation intersect to create overlapping systems of discrimination. Cannot address gender inequity without considering race.
- FIP recommendations: data collection on gender, mentoring/sponsorship programmes, transparent pay structures, flexible working, parental leave policies, targets for leadership diversity.
- Maternity/paternity provisions in NHS: statutory maternity pay, NHS maternity leave policies. Pregnancy discrimination is illegal (Equality Act 2010).
- Unconscious bias: implicit stereotypes influencing decisions. Affects hiring, promotion, performance evaluation. Bias training in NHS.
- Women in pharmacy leadership: RPS (Royal Pharmaceutical Society) has had female presidents. GPhC board gender balance requirements.
- Impact of gender inequity: reduced job satisfaction, higher burnout among women, talent drain from profession, suboptimal patient care (diverse teams make better decisions).`,

  'clinical-decision-making': `Principles of Clinical Decision Making:
- Clinical decision making: cognitive process of gathering and interpreting information to reach a diagnosis and management plan.
- SOAP notes: Subjective (history, presenting complaint, HPC, PMH, DH, FH, SH, ROS), Objective (examination findings, observations, investigations), Assessment (working/differential diagnosis, reasoning), Plan (investigations, treatment, referral, safety netting, follow-up).
- Diagnostic reasoning: hypothesis generation from initial information, then iterative testing. Hypothetico-deductive reasoning.
- Dual Process Theory: System 1 = fast, intuitive, pattern recognition. System 2 = slow, analytical, deliberate. Effective clinicians use both. Over-reliance on System 1 = cognitive error risk.
- Cognitive biases in clinical decision making: anchoring (first diagnosis sticks), availability (recent/memorable cases bias), premature closure (stop looking once diagnosis found), framing effect (how information is presented affects decision), confirmation bias (seek confirming evidence only).
- Shared decision making (NICE NG197): clinician's medical expertise + patient's values/preferences. Three-talk model: team talk, option talk, decision talk. Decision aids.
- Evidence-based medicine (EBM): integrating best research evidence with clinical expertise and patient values. Hierarchy of evidence: RCTs > cohort > case-control > case reports > expert opinion.
- NICE guidelines: develop evidence-based recommendations. CG = clinical guideline, NG = NICE guideline, QS = quality standard, TA = technology appraisal.
- Clinical risk assessment: probability x severity. Risk stratification tools (QRISK3 for CVD, CHA2DS2-VASc for AF, Wells score for DVT/PE).
- Safety netting: explicit plans for "if I'm wrong, what will happen?". Key components: inform patient what to expect, when/how to seek help if symptoms change, specific red flags to watch for.
- Differential diagnosis: systematic list of conditions that could explain presenting symptoms, ranked by probability.`,

  'advanced-communication': `Advanced Communication Skills - Remote, Difficult Conversations, Breaking Bad News:
- Remote consultations: telephone and video. Establish rapport quickly. Check hearing/understanding. Safety-net more explicitly. Document consultation modality. Know limitations: cannot examine, non-verbal cues limited. Referral threshold lower.
- Video consultation: camera at eye level, stable connection, acknowledge delays, maintain eye contact (look at camera not screen), ensure privacy, obtain consent if recording.
- Breaking bad news - SPIKES protocol: Setting (private, sitting down, no interruptions), Perception (what does patient know/expect?), Invitation (how much information do they want?), Knowledge (give information clearly, avoid jargon), Empathy (respond to emotional reaction), Summary and strategy (plan).
- Difficult conversations: concerns about clinical care, end of life discussions, non-adherence, capacity assessment. Key skills: empathy, active listening, clear language, avoid blame.
- Cultural competence: awareness of how culture, language, health literacy influence communication. Use of professional interpreters (not family members for sensitive information). Health literacy screening.
- Motivational interviewing techniques in complex consultations: rolling with resistance, developing discrepancy, exploring ambivalence, eliciting change talk.
- Complaints and duty of candour: when things go wrong, be honest, apologise, explain, learn. Statutory duty of candour for organisations.
- Consent: valid consent requires capacity, information, voluntariness. Capacity = understand, retain, weigh up, communicate. Adults presumed to have capacity (Mental Capacity Act 2005).
- Mental Capacity Act 2005: if lacks capacity - best interests decision with involvement of family/IMCA. Lasting Power of Attorney. Advance Decisions.
- Conflict resolution: staying calm, listening to understand, separating person from problem, finding common ground, escalating appropriately.
- De-escalation: in aggressive situations - non-threatening body language, calm voice, active listening, offer choices, call for help if needed.`,

  'motivational-interviewing': `Motivational Interviewing and Health Coaching PHAY0085:
- Health behaviours = major drivers of morbidity and mortality. Smoking, physical inactivity, poor diet, alcohol are leading preventable causes of disease.
- COM-B Model (Michie et al): Capability (physical/psychological knowledge and skills) + Opportunity (physical environment, social norms) + Motivation (reflective goals, automatic habits) = Behaviour. Identifies intervention targets.
- Stages of Change - Transtheoretical Model (Prochaska and DiClemente): Pre-contemplation (not thinking about change), Contemplation (considering change), Preparation (planning), Action (actively changing), Maintenance (sustaining change), Relapse (return to old behaviour - part of process, not failure).
- Motivational Interviewing (MI) definition: collaborative, person-centred method for eliciting and strengthening motivation for change. Miller and Rollnick.
- MI RULE principles: Resist the righting reflex, Understand patient's own motivation, Listen with empathy, Empower.
- OARS - core MI skills: Open questions (elicit information), Affirmations (acknowledge strengths), Reflective listening (demonstrate understanding), Summaries (collect and present back information).
- Change talk (DARN-C): Desire, Ability, Reasons, Need = preparatory change talk. Commitment = mobilising change talk. Respond to and reinforce change talk.
- Sustain talk: arguments for status quo, reasons not to change. Roll with resistance, don't argue. Reflect back without reinforcing.
- Health Coaching vs MI: MI = helps patient explore and resolve ambivalence. Health Coaching = goal-focused, for patients in preparation/action stage.
- GROW model (health coaching): Goal (what do you want?), Reality (where are you now?), Options (what could you do?), Way forward (what will you do? When? How?).
- Person-centred care: patient is expert of own life. Avoid righting reflex (urge to tell patient what to do). Autonomy and self-determination. Collaboration over confrontation.`,

  'prescribing-principles': `Prescribing Principles and Legal Frameworks:
- Independent Prescriber (IP): can prescribe any medicine (including controlled drugs) within their competence. Accountable for prescribing decisions. In UK: doctors, dentists, nurses (NMPs), pharmacists, paramedics, physiotherapists, podiatrists (with appropriate training and qualification).
- Pharmacist Independent Prescriber: GPhC register annotation. Must have completed IP qualification. Can prescribe licensed/unlicensed medicines, off-label, controlled drugs. Responsible for diagnosis and management plan.
- Supplementary Prescriber: prescribes within a voluntary Clinical Management Plan (CMP) agreed with an independent prescriber. Does not diagnose.
- Patient Group Direction (PGD): written instruction for supply/administration of a named medicine to a specific group of patients meeting defined criteria. Does not require individual prescription. Pharmacist, nurse, paramedic can work under PGD. Examples: Pharmacy First treatments, flu vaccines.
- Patient Specific Direction (PSD): written instruction from prescriber for a specific patient. Does not require a prescription form.
- Off-label prescribing: prescribing outside of the marketing authorisation (different indication, age group, dose, route). Prescriber takes full responsibility. Must have evidence base and patient consent.
- Controlled Drugs (CDs): Misuse of Drugs Act 1973 and Regulations 2001. Schedule 1 (no therapeutic use), Schedule 2 (morphine, fentanyl - full CD requirements), Schedule 3 (temazepam - less stringent), Schedule 4 (benzodiazepines, Z-drugs), Schedule 5 (low-strength preparations).
- CD prescription requirements: indelible ink, written by prescriber, full name and address of patient, dose, form, total quantity in words AND figures, prescriber signature and address.
- Prescription legal requirements: prescriber's name/address, patient name/address, date, signature, age (if under 12). Computer-generated prescriptions must have handwritten signature.
- Unlicensed medicines: no marketing authorisation in UK. Higher risk - no regulatory oversight of quality/efficacy/safety. Prescriber takes full responsibility. Inform patient.`,

  'clinical-reasoning': `Clinical Reasoning PHAY0085 MPharm:
- Clinical reasoning = cognitive processes and strategies used to gather and analyse patient information to reach a diagnosis and management plan. Context-specific, individualised, iterative.
- Dual Process Theory (Kahneman/Evans): System 1 = fast, automatic, pattern recognition, intuitive, heuristic-based. Efficient but prone to bias. System 2 = slow, deliberate, analytical, logical, effortful. Used for complex/novel presentations.
- Effective clinical reasoning: switches between systems appropriately. Use System 1 for familiar patterns, System 2 for complex/uncertain/high-stakes cases.
- Conscious Competence Learning Model: 4 stages - Unconscious incompetence (don't know what you don't know), Conscious incompetence (aware of knowledge gaps), Conscious competence (can do it with effort), Unconscious competence (automatic expertise).
- Working diagnosis: provisional most probable diagnosis from initial assessment. Subject to revision. Differential diagnosis = ranked list of possible diagnoses.
- Red flags: symptoms/signs suggesting serious pathology requiring urgent action. E.g. headache with neck stiffness (meningitis), chest pain with ECG changes (ACS), unexplained weight loss (malignancy).
- Safety netting: planning for uncertainty. "If I'm right, what do I expect? How will I know if I'm wrong? What should the patient do then?" Essential component of all consultations.
- Cognitive biases: anchoring (first impression sticks), availability (recent memorable diagnosis over-represented), premature closure (stop thinking once one diagnosis found), framing effect, confirmation bias, affective bias (emotional state influences reasoning).
- Human factors: time pressure, fatigue, emotional state, workload, distractions, team dynamics - all affect reasoning quality.
- Diagnostic uncertainty: normal and unavoidable. "Hear hooves, think horse not zebra" - common things are common. If cannot formulate differentials, may be beyond competence - seek help.
- Risk aversion vs risk management: risk aversion = psychological avoidance of negative outcomes, leads to over-investigation, defensive practice. Risk management = rational balancing of probabilities and consequences.
- Independent prescriber standard (GPhC): must prescribe only within clinical competence, take responsibility for decisions, maintain up-to-date knowledge.`
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

  const userPrompt = `Generate 10 MCQs for a UK final-year MPharm student. Topic: ${topicLabel}.

Return ONLY this JSON (no markdown, no extra text):
{"questions":[{"question":"...","topic":"${topicLabel}","options":["A. ...","B. ...","C. ...","D. ..."],"correctIndex":0,"explanation":"..."}]}

Rules: 4 options (A-D), exactly 1 correct answer, clinically relevant, explanation 1-2 sentences.

CONTENT:
${content}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
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
