import type { ReactNode } from "react";
import { Chip } from "@/components/base/badges/chip";
import { Meter } from "@/components/base/meter/meter";
import { FlowsheetStrip } from "@/components/proposal/flowsheet-strip";

const DATASET_URL = "https://physionet.org/content/challenge-2019/1.0.0/";
const DIABETES_URL = "https://archive.ics.uci.edu/dataset/529/early+stage+diabetes+risk+prediction+dataset";
const CKD_URL = "https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease";

const MODELS = ["Training-prevalence reference", "SIRS-style rule", "Logistic regression", "Gradient boosted trees"];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1 border-t border-separator-border pt-1">
      <h2 className="text-headline-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return <span className="text-body-semibold text-text-primary">{children} </span>;
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-accent-700 underline decoration-accent-300 underline-offset-2">
      {children}
    </a>
  );
}

function SiteMeter({ site, role, patients, prevalence }: { site: string; role: string; patients: string; prevalence: number }) {
  return (
    <Meter
      label={site}
      value={prevalence}
      valueLabel={`${patients} patients, ${prevalence}% sepsis`}
      tone="error"
      description={role}
    />
  );
}

export default function Proposal() {
  return (
    <main className="sheet flex flex-col gap-1.5">
      <header className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-title-1-semibold text-text-primary">Final Project Proposal</h1>
          <div className="flex flex-col items-end">
            <p className="text-body-regular text-text-primary">CAI 5720 | Initial proposal</p>
            <p className="text-body-semibold text-text-primary">Due November 9, 2026, at 11:59 PM ET</p>
          </div>
        </div>
        <p className="text-body-semibold text-text-primary">
          Working project title:{" "}
          <span className="text-title-3-semibold">Does an early sepsis warning hold up at a hospital it has never seen?</span>
        </p>
        <p className="text-body-regular text-text-primary">
          <Lead>Canvas group and members:</Lead>
          Final Project 6 (Second Site); Karissa Kocourek, Daniel Escalante
        </p>
      </header>

      <Section title="Research question and clinical significance">
        <p className="text-body-semibold text-text-primary">
          Using only data charted up to a given ICU hour, can a model flag adult ICU patients who will meet Sepsis-3
          criteria within the next 6 hours, and does it stay accurate and calibrated at a hospital it was never
          trained on?
        </p>
        <p className="text-body-regular text-text-primary">
          It serves bedside nurses and rapid response teams deciding whether to start a sepsis workup. Earlier sepsis
          treatment improves survival, yet Wong et al., JAMA Intern Med 2021, found a widely deployed commercial
          model performed far worse in external validation than its developers reported, a gap we want to measure
          and explain.
        </p>
        <FlowsheetStrip />
      </Section>

      <Section title="Proposed dataset">
        <p className="text-body-regular text-text-primary">
          PhysioNet/Computing in Cardiology Challenge 2019, Early Prediction of Sepsis from Clinical Data, version
          1.0.0, at <Link href={DATASET_URL}>physionet.org/content/challenge-2019/1.0.0</Link>, open access under CC
          BY 4.0, no credentialing, described in Reyna et al., Crit Care Med 2020. Over a million hourly
          rows hold 8 vital signs, 26 labs and 6 demographic or admission variables, with heavy lab missingness.
          Target: hourly SepsisLabel; positive class: sepsis.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <SiteMeter site="Beth Israel Deaconess" role="Development: patient-level cross-validation" patients="20,336" prevalence={8.8} />
          <SiteMeter site="Emory" role="External test: untouched until everything is locked" patients="20,000" prevalence={5.7} />
        </div>
      </Section>

      <Section title="Planned methods">
        <p className="text-body-regular text-text-primary">
          <Lead>Split and leakage control.</Lead>
          Each patient&apos;s hours stay in one fold, and Emory is opened only after the model, predictor set and
          threshold are locked. Imputation, scaling and any recalibration are fit within development folds only;
          patient ID and anything recorded after the index time are excluded. Predictors are the latest values,
          short-term trends, and indicators of whether each lab has been measured so far.
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-body-regular text-text-primary">
          <Lead>Models.</Lead>
          {MODELS.map((model) => (
            <Chip key={model} variant="bold" color="gray">
              {model}
            </Chip>
          ))}
        </div>
        <p className="text-body-regular text-text-primary">
          <Lead>Tuning.</Lead>
          Each learned model gets a small cross-validated search; logistic regression is the interpretable one.{" "}
          <Lead>Evaluation on Emory.</Lead>
          AUROC, AUPRC as average precision, ROC and precision-recall curves, calibration curve, Brier score, and a
          confusion matrix with sensitivity, specificity and PPV at a threshold set in development data from a fixed
          alert budget, plus alerts per patient-day and patient-level bootstrap confidence intervals.{" "}
          <Lead>Interpretation.</Lead>
          Standardized logistic coefficients, permutation importance, two contrasting held-out patients including a
          missed case, errors by age group and sex with counts, and a sensitivity analysis without the measurement
          indicators to test whether the model reads physiology or clinician ordering habits.
        </p>
      </Section>

      <Section title="Expected outcome">
        <p className="text-body-regular text-text-primary">
          We expect both learned models to lose discrimination and especially calibration at Emory, with part of their
          signal reflecting when labs were ordered rather than lab values. We will produce a reproducible Colab
          notebook and report on the performance drop at a new hospital and the alerts a unit would face. Limits:
          charted-data labels, retrospective design, two academic centers, no race or treatment data.{" "}
          <Lead>Still tentative:</Lead>
          <span>
            the alert budget level, dropping post-onset hours, subsampling hours per patient, and also training
            on Emory to test on Beth Israel.
          </span>
        </p>
        <p className="rounded-2xl bg-background-secondary-default px-3 py-1.5 text-body-regular text-text-primary">
          <Lead>Smaller fallback if sepsis is too large:</Lead>
          <Link href={DIABETES_URL}>Early Stage Diabetes Risk Prediction</Link>, 520 records, detecting recorded
          diabetes from symptoms; or <Link href={CKD_URL}>Chronic Kidney Disease</Link>, 400 records, though its labs
          may mirror the label.
        </p>
      </Section>
    </main>
  );
}
