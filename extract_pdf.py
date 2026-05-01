"""
Extract topic-specific content from Yasmine_Study_Materials_.pdf
Saves one .txt file per topic into the /content folder.

Usage:
    pip install -r requirements.txt
    python extract_pdf.py
"""

import os
import sys

PDF_PATH = os.path.join(os.path.dirname(__file__), "Yasmine_Study_Materials_.pdf")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "content")

TOPICS = {
    "clinical-reasoning": [
        "clinical reasoning", "dual process", "system 1", "system 2", "type 1", "type 2",
        "conscious competence", "diagnostic uncertainty", "differential diagnosis",
        "working diagnosis", "safety netting", "red flag", "cognitive bias",
        "anchoring bias", "availability bias", "premature closure", "framing effect",
        "risk aversion", "risk management", "independent prescriber", "metacognition",
        "collaborative clinical reasoning", "phay0085"
    ],
    "consultation": [
        "calgary", "cambridge", "consultation skill", "soap note", "ice model",
        "ideas concerns expectations", "open question", "active listening",
        "person-centred", "paediatric consultation", "gillick", "remote consultation",
        "sbar", "handover", "non-verbal", "pendleton", "informed consent",
        "capacity", "confidentiality", "reflective listening"
    ],
    "motivational-interviewing": [
        "motivational interviewing", "health coaching", "com-b", "stages of change",
        "prochaska", "pre-contemplation", "contemplation", "preparation", "action",
        "maintenance", "relapse", "rule", "oars", "change talk", "sustain talk",
        "darn-c", "grow model", "rolling with resistance", "righting reflex"
    ],
    "pharmacy-first": [
        "pharmacy first", "feverpain", "fever pain", "nitrofurantoin", "phenoxymethylpenicillin",
        "amoxicillin", "otitis media", "sinusitis", "shingles", "impetigo",
        "insect bite", "flucloxacillin", "clarithromycin", "erythromycin",
        "fluticasone furoate", "mometasone", "hydrogen peroxide", "fusidic acid",
        "target leaflet", "proforma", "advanced service", "clinical pathway"
    ],
    "infections": [
        "infection", "e. coli", "uti", "urinary tract", "sore throat",
        "otitis media", "sinusitis", "shingles", "impetigo", "cellulitis",
        "neutropenic sepsis", "pip/taz", "piperacillin", "tazobactam",
        "gentamicin", "rsv", "rhinovirus", "adenovirus", "varicella zoster",
        "streptococcus", "s. aureus", "s.pneumoniae", "h.influenzae", "m.catarrhalis",
        "sepsis", "antibiotic", "antimicrobial", "bacteraemia"
    ],
    "women-health": [
        "women", "contraception", "emergency contraception", "cu-iud", "copper iud",
        "ulipristal", "levonorgestrel", "desogestrel", "progestogen",
        "vaginal infection", "thrush", "candida", "bacterial vaginosis", "gardnerella",
        "incontinence", "pelvic floor", "menstrual cycle", "ovulation",
        "cpsc", "pharmacy contraception", "upsi", "unprotected sex",
        "claire grant", "phay0077"
    ],
    "pregnancy-lactation": [
        "pregnancy", "lactation", "teratogen", "teratogenicity", "organogenesis",
        "placenta", "foetal", "fetal", "breast milk", "breastfeed",
        "valproate", "neural tube", "pregnancy prevention programme", "ppp",
        "lamotrigine", "levetiracetam", "thalidomide", "bumps", "uktis", "lactmed",
        "pre-eclampsia", "hyperemesis", "gestational diabetes", "vte",
        "labetalol", "nifedipine", "cyclizine", "pharmacokinetic"
    ],
    "public-health": [
        "public health", "nhs health check", "qrisk", "audit-c", "alcohol",
        "cvd", "cardiovascular", "gender equity", "gender pay gap",
        "intersectionality", "crenshaw", "fip", "international pharmaceutical federation",
        "health inequalities", "social determinant", "deprivation",
        "health improvement", "health protection", "opioid", "gabapentinoid"
    ],
    "medicines-adherence": [
        "adherence", "concordance", "compliance", "papa", "perceptions and practicalities",
        "necessity-concerns", "necessity concerns framework", "intentional non-adherence",
        "unintentional non-adherence", "information-action gap", "robert horne",
        "horne", "beliefs about medicines", "bmq", "medication review"
    ],
    "hospital-pharmacy": [
        "hospital pharmacy", "drug chart", "medicines reconciliation",
        "cockcroft-gault", "cockcroft gault", "creatinine clearance", "crcl",
        "gentamicin", "aminoglycoside", "ibw", "ideal body weight", "ajbw",
        "adjusted body weight", "ng tube", "nasogastric", "phenytoin",
        "amiodarone", "doac", "warfarin", "cha2ds2", "has-bled",
        "neutropenic", "pip/taz", "clinical screening", "administrative screening",
        "workshop 1", "phay0085"
    ],
    "neurology-oncology": [
        "neurology", "oncology", "epilepsy", "valproate", "lamotrigine",
        "levetiracetam", "phenytoin", "parkinson", "levodopa", "carbidopa",
        "dementia", "alzheimer", "donepezil", "rivastigmine", "galantamine",
        "memantine", "glioma", "astrocytoma", "pcv chemotherapy",
        "procarbazine", "lomustine", "vincristine", "vinca alkaloid",
        "npsa alert", "intrathecal", "dexamethasone", "cerebral oedema",
        "g-csf", "filgrastim", "5-ht3", "nk1", "aciclovir", "workshop"
    ],
    "digital-pharmacy": [
        "digital pharmacy", "nhs digital", "eps", "electronic prescription",
        "scr", "summary care record", "epma", "electronic prescribing",
        "digital transformation", "snomed", "dm+d", "informatics",
        "clinical decision support", "interoperability", "data security",
        "ai in pharmacy", "digital health"
    ]
}


def score_page(text_lower, keywords):
    """Return keyword hit count for a page."""
    return sum(1 for kw in keywords if kw in text_lower)


def extract_with_pdfplumber(pdf_path):
    import pdfplumber
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        for i, page in enumerate(pdf.pages):
            if (i + 1) % 100 == 0:
                print(f"  Reading page {i+1}/{total}...", flush=True)
            text = page.extract_text() or ""
            pages.append(text)
    return pages


def extract_with_pymupdf(pdf_path):
    import fitz
    doc = fitz.open(pdf_path)
    total = doc.page_count
    pages = []
    for i in range(total):
        if (i + 1) % 100 == 0:
            print(f"  Reading page {i+1}/{total}...", flush=True)
        page = doc[i]
        pages.append(page.get_text())
    return pages


def main():
    if not os.path.exists(PDF_PATH):
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Extracting text from PDF ({PDF_PATH})...")
    pages = None

    try:
        print("Trying pdfplumber...")
        pages = extract_with_pdfplumber(PDF_PATH)
        print(f"pdfplumber: extracted {len(pages)} pages")
    except ImportError:
        print("pdfplumber not available, trying PyMuPDF...")
    except Exception as e:
        print(f"pdfplumber failed: {e}, trying PyMuPDF...")

    if pages is None:
        try:
            pages = extract_with_pymupdf(PDF_PATH)
            print(f"PyMuPDF: extracted {len(pages)} pages")
        except ImportError:
            print("ERROR: Neither pdfplumber nor PyMuPDF is installed.")
            print("Run: pip install pdfplumber   OR   pip install pymupdf")
            sys.exit(1)
        except Exception as e:
            print(f"PyMuPDF also failed: {e}")
            sys.exit(1)

    print(f"\nScoring {len(pages)} pages against {len(TOPICS)} topics...")

    # For each page, find the best-matching topic
    topic_pages = {topic: [] for topic in TOPICS}
    unmatched = 0

    for i, text in enumerate(pages):
        text_lower = text.lower()
        scores = {topic: score_page(text_lower, keywords)
                  for topic, keywords in TOPICS.items()}
        best_topic = max(scores, key=scores.get)
        best_score = scores[best_topic]

        if best_score >= 2:  # require at least 2 keyword hits
            topic_pages[best_topic].append(text)
        else:
            unmatched += 1

    print(f"\nPage distribution:")
    for topic, texts in topic_pages.items():
        print(f"  {topic}: {len(texts)} pages")
    print(f"  Unmatched (score < 2): {unmatched} pages")

    print(f"\nWriting content files to {OUTPUT_DIR}/...")
    for topic, texts in topic_pages.items():
        if not texts:
            print(f"  WARNING: No pages matched for '{topic}' — skipping (server will use fallback)")
            continue
        content = "\n\n".join(texts)
        # Limit to ~100k chars to keep prompts manageable
        if len(content) > 100_000:
            content = content[:100_000]
        out_path = os.path.join(OUTPUT_DIR, f"{topic}.txt")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  Wrote {topic}.txt ({len(content):,} chars)")

    print("\nDone! Content files are ready.")
    print("Start the server with:  node server.js")


if __name__ == "__main__":
    main()
