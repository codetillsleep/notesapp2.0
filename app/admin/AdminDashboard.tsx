"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FlaskRound,
  Video,
  FileText,
  Shield,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  GraduationCap,
  Zap,
  Database,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VideoEntry { title: string; url: string; }
interface QuestionEntry { title: string; pdfUrl: string; }

interface SubjectDoc {
  _id: string;
  name: string;
  code: string;
  labCode?: string;
  branch: string[];
  semester: number[];
  theoryCredits: number;
  labCredits: number;
  syllabus: Record<string, string>;
  lab: Record<string, string>;
  questions: QuestionEntry[];
  videos: VideoEntry[];
}

// ── Wizard Form State ─────────────────────────────────────────────────────────

interface WizardForm {
  name: string;
  code: string;
  theoryCredits: string;
  isLab: boolean;
  labCode: string;
  labCredits: string;
  branches: string[];
  semesters: string[];
  unitCount: number;
  units: { name: string; content: string }[];
  experiments: { name: string; description: string }[];
  videos: VideoEntry[];
  pyqs: QuestionEntry[];
}

const defaultForm = (): WizardForm => ({
  name: "",
  code: "",
  theoryCredits: "4",
  isLab: false,
  labCode: "",
  labCredits: "2",
  branches: [],
  semesters: [],
  unitCount: 5,
  units: Array.from({ length: 5 }, (_, i) => ({ name: `Unit ${i + 1}`, content: "" })),
  experiments: [{ name: "Experiment 1", description: "" }],
  videos: [{ title: "", url: "" }],
  pyqs: [{ title: "", pdfUrl: "" }],
});

/** Pre-populate the wizard form from an existing SubjectDoc for editing */
const formFromSubject = (subj: SubjectDoc): WizardForm => {
  const units = Object.entries(subj.syllabus ?? {}).map(([name, content]) => ({ name, content }));
  const experiments = Object.entries(subj.lab ?? {}).map(([name, description]) => ({ name, description }));
  const isLab = subj.labCredits > 0 || !!(subj.labCode?.trim());

  return {
    name: subj.name,
    code: subj.code,
    theoryCredits: String(subj.theoryCredits ?? 4),
    isLab,
    labCode: subj.labCode ?? "",
    labCredits: String(subj.labCredits ?? 2),
    branches: [...(subj.branch ?? [])],
    semesters: (subj.semester ?? []).map(String),
    unitCount: units.length || 5,
    units: units.length > 0 ? units : Array.from({ length: 5 }, (_, i) => ({ name: `Unit ${i + 1}`, content: "" })),
    experiments: experiments.length > 0 ? experiments : [{ name: "Experiment 1", description: "" }],
    videos: subj.videos?.length > 0 ? subj.videos.map((v) => ({ title: v.title, url: v.url })) : [{ title: "", url: "" }],
    pyqs: subj.questions?.length > 0 ? subj.questions.map((q) => ({ title: q.title, pdfUrl: q.pdfUrl })) : [{ title: "", pdfUrl: "" }],
  };
};

const KNOWN_BRANCHES = ["CSAM", "CYBER"];
const KNOWN_SEMS = ["3", "4", "5", "6", "7", "8"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${colors[color] ?? colors.indigo}`}>
      {children}
    </span>
  );
}

function Input({
  label, value, onChange, placeholder = "", type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
      />
    </div>
  );
}

function Textarea({
  label, value, onChange, placeholder = "", rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all resize-none leading-relaxed"
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expanded branch-sem groups in the grid
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<SubjectDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Wizard state — shared for Add and Edit modes
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState<WizardForm>(defaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ingestAfterSave, setIngestAfterSave] = useState(true);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);

  // Edit mode — holds the subject being edited (null = add mode)
  const [editTarget, setEditTarget] = useState<SubjectDoc | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Fetch subjects ──────────────────────────────────────────────────────────

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/subjects");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setSubjects(json.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  // ── Toast helper ────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Delete subject ──────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/subjects?id=${deleteTarget._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSubjects((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      showToast(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (e: any) {
      showToast(e.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Wizard helpers ──────────────────────────────────────────────────────────

  const openAddWizard = () => {
    setEditTarget(null);
    setForm(defaultForm());
    setWizardStep(1);
    setSubmitError(null);
    setIngestStatus(null);
    setIngestAfterSave(true);
    setWizardOpen(true);
  };

  const openEditWizard = (subj: SubjectDoc) => {
    setEditTarget(subj);
    setForm(formFromSubject(subj));
    setWizardStep(1);
    setSubmitError(null);
    setIngestStatus(null);
    setIngestAfterSave(false); // default off for edits (user may not want re-ingest every time)
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setEditTarget(null);
    setForm(defaultForm());
    setWizardStep(1);
    setSubmitError(null);
    setIngestStatus(null);
  };

  const updateUnit = (i: number, field: "name" | "content", val: string) => {
    setForm((f) => {
      const units = [...f.units];
      units[i] = { ...units[i], [field]: val };
      return { ...f, units };
    });
  };

  const updateExperiment = (i: number, field: "name" | "description", val: string) => {
    setForm((f) => {
      const experiments = [...f.experiments];
      experiments[i] = { ...experiments[i], [field]: val };
      return { ...f, experiments };
    });
  };

  const updateVideo = (i: number, field: "title" | "url", val: string) => {
    setForm((f) => {
      const videos = [...f.videos];
      videos[i] = { ...videos[i], [field]: val };
      return { ...f, videos };
    });
  };

  const updatePyq = (i: number, field: "title" | "pdfUrl", val: string) => {
    setForm((f) => {
      const pyqs = [...f.pyqs];
      pyqs[i] = { ...pyqs[i], [field]: val };
      return { ...f, pyqs };
    });
  };

  const setUnitCount = (n: number) => {
    const count = Math.max(1, Math.min(10, n));
    setForm((f) => {
      const units = Array.from({ length: count }, (_, i) => f.units[i] ?? { name: `Unit ${i + 1}`, content: "" });
      return { ...f, unitCount: count, units };
    });
  };

  const toggleBranch = (b: string) => {
    setForm((f) => ({
      ...f,
      branches: f.branches.includes(b) ? f.branches.filter((x) => x !== b) : [...f.branches, b],
    }));
  };

  const toggleSem = (s: string) => {
    setForm((f) => ({
      ...f,
      semesters: f.semesters.includes(s) ? f.semesters.filter((x) => x !== s) : [...f.semesters, s],
    }));
  };

  // ── Step validation ─────────────────────────────────────────────────────────

  const stepValid = (step: number): boolean => {
    if (step === 1) return !!(form.name.trim() && form.code.trim() && form.branches.length > 0 && form.semesters.length > 0);
    return true;
  };

  // Total steps depends on whether isLab
  const totalSteps = form.isLab ? 5 : 4;
  const stepLabels = form.isLab
    ? ["Basic Info", "Syllabus", "Lab Experiments", "Videos & PYQs", "Review"]
    : ["Basic Info", "Syllabus", "Videos & PYQs", "Review"];

  // ── Build payload from form ─────────────────────────────────────────────────

  const buildPayload = () => {
    const syllabus: Record<string, string> = {};
    form.units.forEach((u) => { if (u.name.trim()) syllabus[u.name] = u.content; });

    const lab: Record<string, string> = {};
    if (form.isLab) {
      form.experiments.forEach((e) => { if (e.name.trim()) lab[e.name] = e.description; });
    }

    return {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      labCode: form.isLab && form.labCode.trim() ? form.labCode.trim() : undefined,
      branch: form.branches,
      semester: form.semesters.map(Number),
      theoryCredits: Number(form.theoryCredits) || 0,
      labCredits: form.isLab ? Number(form.labCredits) || 0 : 0,
      syllabus,
      lab: form.isLab ? lab : {},
      questions: form.pyqs.filter((q) => q.title.trim() && q.pdfUrl.trim()),
      videos: form.videos.filter((v) => v.title.trim() && v.url.trim()),
    };
  };

  // ── Trigger ingest ──────────────────────────────────────────────────────────

  const triggerIngest = async (subjectId: string) => {
    setIngestStatus("Generating AI embeddings…");
    try {
      const res = await fetch(`/api/admin/ingest/${subjectId}`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setIngestStatus(`✅ ${json.chunksCreated} embedding chunks created`);
      } else {
        setIngestStatus(`⚠️ Ingest failed: ${json.error}`);
      }
    } catch {
      setIngestStatus("⚠️ Ingest failed (network error)");
    }
  };

  // ── Submit: Create ──────────────────────────────────────────────────────────

  const handleCreate = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setIngestStatus(null);
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      if (ingestAfterSave && json.data?._id) {
        await triggerIngest(json.data._id);
      }

      await fetchSubjects();
      showToast(`"${form.name}" added successfully!`);
      closeWizard();
    } catch (e: any) {
      setSubmitError(e.message || "Failed to create subject");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit: Update ──────────────────────────────────────────────────────────

  const handleUpdate = async () => {
    if (!editTarget) return;
    setSubmitting(true);
    setSubmitError(null);
    setIngestStatus(null);
    try {
      const res = await fetch(`/api/admin/subjects?id=${editTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      if (ingestAfterSave) {
        await triggerIngest(editTarget._id);
      }

      await fetchSubjects();
      showToast(`"${form.name}" updated successfully!`);
      closeWizard();
    } catch (e: any) {
      setSubmitError(e.message || "Failed to update subject");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Group subjects for display ──────────────────────────────────────────────

  type GroupedSubjects = Map<string, Map<number, SubjectDoc[]>>;
  const grouped: GroupedSubjects = new Map();

  subjects.forEach((s) => {
    (s.branch ?? []).forEach((br) => {
      if (!grouped.has(br)) grouped.set(br, new Map());
      const brMap = grouped.get(br)!;
      (s.semester ?? []).forEach((sem) => {
        if (!brMap.has(sem)) brMap.set(sem, []);
        brMap.get(sem)!.push(s);
      });
    });
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalBranches = new Set(subjects.flatMap((s) => s.branch ?? [])).size;
  const totalSems = new Set(subjects.flatMap((s) => s.semester ?? [])).size;
  const totalLabSubjects = subjects.filter((s) => (s.labCredits ?? 0) > 0).length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#080b18] text-white">
      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #6366f1 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">{adminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubjects}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/8 text-sm font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={openAddWizard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Subjects", value: subjects.length, icon: Database, color: "indigo" },
            { label: "Branches", value: totalBranches, icon: GraduationCap, color: "purple" },
            { label: "Semesters", value: totalSems, icon: BookOpen, color: "pink" },
            { label: "Lab Subjects", value: totalLabSubjects, icon: FlaskRound, color: "green" },
          ].map(({ label, value, icon: Icon, color }) => {
            const bg: Record<string, string> = {
              indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
              purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
              pink: "from-pink-500/10 to-pink-600/5 border-pink-500/20",
              green: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
            };
            const ic: Record<string, string> = {
              indigo: "text-indigo-400", purple: "text-purple-400",
              pink: "text-pink-400", green: "text-emerald-400",
            };
            return (
              <div key={label} className={`p-4 rounded-2xl bg-gradient-to-br border ${bg[color]}`}>
                <Icon className={`w-5 h-5 mb-2 ${ic[color]}`} />
                <div className="text-2xl font-extrabold">{loading ? "—" : value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Subject Groups ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mr-3" /> Loading subjects…
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Database className="w-10 h-10 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">No subjects in database yet.</p>
            <p className="text-sm mt-1 opacity-60">Click &quot;Add Subject&quot; to create the first one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(grouped.entries()).sort().map(([branch, semMap]) => (
              <div key={branch} className="rounded-2xl border border-white/8 overflow-hidden">
                {/* Branch Header */}
                <button
                  onClick={() => toggleGroup(branch)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-base">{branch}</span>
                      <span className="ml-2 text-xs text-gray-500">{[...semMap.values()].reduce((a, v) => a + v.length, 0)} subjects</span>
                    </div>
                  </div>
                  {expandedGroups.has(branch) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Semester Groups */}
                {expandedGroups.has(branch) && (
                  <div className="p-4 space-y-4 border-t border-white/6">
                    {Array.from(semMap.entries()).sort(([a], [b]) => a - b).map(([sem, subs]) => {
                      const semKey = `${branch}-${sem}`;
                      return (
                        <div key={sem}>
                          <button
                            onClick={() => toggleGroup(semKey)}
                            className="flex items-center gap-2 mb-3 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {expandedGroups.has(semKey) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Semester {sem}
                            <span className="text-gray-600 font-normal">— {subs.length} subject{subs.length !== 1 ? "s" : ""}</span>
                          </button>

                          {expandedGroups.has(semKey) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pl-1">
                              {subs.map((subj) => {
                                const unitCount = Object.keys(subj.syllabus ?? {}).length;
                                const labCount = Object.keys(subj.lab ?? {}).length;
                                const isLab = (subj.labCredits ?? 0) > 0 || labCount > 0;
                                return (
                                  <div
                                    key={subj._id}
                                    className="group relative p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all"
                                  >
                                    {/* Subject Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm leading-snug text-white group-hover:text-indigo-300 transition-colors truncate">
                                          {subj.name}
                                        </h3>
                                        <span className="text-[10px] font-mono text-gray-500">{subj.code}</span>
                                        {subj.labCode && <span className="text-[10px] font-mono text-gray-600"> / {subj.labCode}</span>}
                                      </div>
                                      {/* Action Buttons */}
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => openEditWizard(subj)}
                                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                                          title="Edit subject"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteTarget(subj)}
                                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                          title="Delete subject"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {(subj.theoryCredits ?? 0) > 0 && (
                                        <Badge color="indigo">{subj.theoryCredits}Cr Theory</Badge>
                                      )}
                                      {isLab && (
                                        <Badge color="purple"><FlaskRound className="w-2.5 h-2.5" />{subj.labCredits}Cr Lab</Badge>
                                      )}
                                      {unitCount > 0 && <Badge color="green"><BookOpen className="w-2.5 h-2.5" />{unitCount} Units</Badge>}
                                      {labCount > 0 && <Badge color="amber"><Zap className="w-2.5 h-2.5" />{labCount} Exps</Badge>}
                                      {(subj.questions?.length ?? 0) > 0 && (
                                        <Badge color="pink"><FileText className="w-2.5 h-2.5" />{subj.questions.length} PYQs</Badge>
                                      )}
                                      {(subj.videos?.length ?? 0) > 0 && (
                                        <Badge><Video className="w-2.5 h-2.5" />{subj.videos.length} Videos</Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          DELETE CONFIRMATION MODAL
      ────────────────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-[#0d1226] border border-red-500/30 rounded-2xl p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-bold text-white">Delete Subject?</h2>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 mb-5">
              <p className="text-sm text-white font-semibold">{deleteTarget.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{deleteTarget.code}</p>
              <p className="text-xs text-red-400 mt-2">
                This will also remove all AI embedding chunks for this subject.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => !deleting && setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          ADD / EDIT SUBJECT WIZARD MODAL
      ────────────────────────────────────────────────────────────────── */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && closeWizard()} />
          <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0d1226] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  {editTarget ? (
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  <h2 className="font-bold text-white">
                    {editTarget ? `Editing: ${editTarget.name}` : "Add New Subject"}
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 pl-8">Step {wizardStep} of {totalSteps} — {stepLabels[wizardStep - 1]}</p>
              </div>
              <button
                onClick={() => !submitting && closeWizard()}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-white/6 shrink-0 overflow-x-auto no-scrollbar">
              {stepLabels.map((label, i) => {
                const num = i + 1;
                const done = num < wizardStep;
                const active = num === wizardStep;
                return (
                  <React.Fragment key={label}>
                    <div className={`flex items-center gap-1.5 shrink-0 ${active ? "opacity-100" : done ? "opacity-70" : "opacity-30"}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${active ? (editTarget ? "bg-indigo-500" : "bg-emerald-500") + " text-white" : done ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-400"}`}>
                        {done ? <Check className="w-3 h-3" /> : num}
                      </div>
                      <span className={`text-[10px] font-semibold hidden sm:block ${active ? (editTarget ? "text-indigo-300" : "text-emerald-300") : "text-gray-500"}`}>{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && <div className="flex-1 h-px bg-white/8 mx-1 min-w-[8px]" />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Modal Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin">

              {/* ─── STEP 1: Basic Info ─── */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Subject Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Database Management Systems" required />
                    <Input label="Subject Code" value={form.code} onChange={(v) => setForm((f) => ({ ...f, code: v }))} placeholder="e.g. CS-501" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Theory Credits" type="number" value={form.theoryCredits} onChange={(v) => setForm((f) => ({ ...f, theoryCredits: v }))} placeholder="4" />
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lab Subject?</label>
                      <button
                        onClick={() => setForm((f) => ({ ...f, isLab: !f.isLab }))}
                        className={`w-full py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${form.isLab ? "bg-purple-500/20 border-purple-500/50 text-purple-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/8"}`}
                      >
                        <FlaskRound className="w-4 h-4" />
                        {form.isLab ? "Yes — Lab Subject" : "No Lab Component"}
                      </button>
                    </div>
                  </div>

                  {form.isLab && (
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 animate-fadeIn">
                      <Input label="Lab Code" value={form.labCode} onChange={(v) => setForm((f) => ({ ...f, labCode: v }))} placeholder="e.g. CS-502(P)" />
                      <Input label="Lab Credits" type="number" value={form.labCredits} onChange={(v) => setForm((f) => ({ ...f, labCredits: v }))} placeholder="2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branches <span className="text-red-400">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {KNOWN_BRANCHES.map((b) => (
                        <button
                          key={b}
                          onClick={() => toggleBranch(b)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.branches.includes(b) ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/8"}`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Semesters <span className="text-red-400">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {KNOWN_SEMS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSem(s)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${form.semesters.includes(s) ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/8"}`}
                        >
                          Sem {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Syllabus ─── */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Number of Units</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setUnitCount(form.unitCount - 1)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold text-lg">−</button>
                      <span className="text-2xl font-bold w-8 text-center">{form.unitCount}</span>
                      <button onClick={() => setUnitCount(form.unitCount + 1)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold text-lg">+</button>
                    </div>
                  </div>

                  {form.units.map((unit, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
                      <input
                        type="text"
                        value={unit.name}
                        onChange={(e) => updateUnit(i, "name", e.target.value)}
                        className="w-full bg-transparent text-sm font-bold text-indigo-300 focus:outline-none border-b border-white/10 pb-1 focus:border-indigo-500/60 transition-colors"
                        placeholder={`Unit ${i + 1} name`}
                      />
                      <Textarea
                        label=""
                        value={unit.content}
                        onChange={(v) => updateUnit(i, "content", v)}
                        placeholder={`Paste the syllabus content for ${unit.name}…`}
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ─── STEP 3: Lab Experiments (only if lab) ─── */}
              {wizardStep === 3 && form.isLab && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-gray-500">Add each lab experiment. These appear in the Lab tab on the subject page.</p>
                  {form.experiments.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={exp.name}
                          onChange={(e) => updateExperiment(i, "name", e.target.value)}
                          className="bg-transparent text-sm font-bold text-purple-300 focus:outline-none border-b border-purple-500/30 pb-1 focus:border-purple-400 transition-colors flex-1"
                          placeholder={`Experiment ${i + 1} name`}
                        />
                        {form.experiments.length > 1 && (
                          <button
                            onClick={() => setForm((f) => ({ ...f, experiments: f.experiments.filter((_, j) => j !== i) }))}
                            className="ml-3 text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <Textarea
                        label=""
                        value={exp.description}
                        onChange={(v) => updateExperiment(i, "description", v)}
                        placeholder="Describe what students do in this experiment…"
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setForm((f) => ({ ...f, experiments: [...f.experiments, { name: `Experiment ${f.experiments.length + 1}`, description: "" }] }))}
                    className="w-full py-3 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm font-semibold hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Experiment
                  </button>
                </div>
              )}

              {/* ─── Videos & PYQs step ─── */}
              {((wizardStep === 3 && !form.isLab) || (wizardStep === 4 && form.isLab)) && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Videos */}
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                      <Video className="w-4 h-4 text-pink-400" /> YouTube Videos / Playlists
                    </h3>
                    {form.videos.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={v.title}
                            onChange={(e) => updateVideo(i, "title", e.target.value)}
                            placeholder="Video / Playlist title"
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60 transition-all"
                          />
                          <input
                            type="url"
                            value={v.url}
                            onChange={(e) => updateVideo(i, "url", e.target.value)}
                            placeholder="https://youtube.com/..."
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60 transition-all"
                          />
                        </div>
                        <button
                          onClick={() => setForm((f) => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }))}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setForm((f) => ({ ...f, videos: [...f.videos, { title: "", url: "" }] }))}
                      className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors font-semibold"
                    >
                      <Plus className="w-4 h-4" /> Add Video
                    </button>
                  </div>

                  {/* PYQs */}
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                      <FileText className="w-4 h-4 text-purple-400" /> Previous Year Questions (PYQs)
                    </h3>
                    {form.pyqs.map((q, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={q.title}
                            onChange={(e) => updatePyq(i, "title", e.target.value)}
                            placeholder="e.g. DBMS PYQ 2023"
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60 transition-all"
                          />
                          <input
                            type="url"
                            value={q.pdfUrl}
                            onChange={(e) => updatePyq(i, "pdfUrl", e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60 transition-all"
                          />
                        </div>
                        <button
                          onClick={() => setForm((f) => ({ ...f, pyqs: f.pyqs.filter((_, j) => j !== i) }))}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setForm((f) => ({ ...f, pyqs: [...f.pyqs, { title: "", pdfUrl: "" }] }))}
                      className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                    >
                      <Plus className="w-4 h-4" /> Add PYQ
                    </button>
                  </div>
                </div>
              )}

              {/* ─── FINAL STEP: Review ─── */}
              {wizardStep === totalSteps && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
                    <h3 className="text-sm font-bold text-white">Subject Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        ["Name", form.name || "—"],
                        ["Theory Code", form.code || "—"],
                        ...(form.isLab ? [["Lab Code", form.labCode || "—"]] : []),
                        ["Theory Credits", form.theoryCredits],
                        ...(form.isLab ? [["Lab Credits", form.labCredits]] : []),
                        ["Branches", form.branches.join(", ") || "—"],
                        ["Semesters", form.semesters.map((s) => `Sem ${s}`).join(", ") || "—"],
                      ].map(([k, v]) => (
                        <div key={String(k)} className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">{k}</span>
                          <span className="text-white font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Units", count: form.units.filter((u) => u.content.trim()).length, icon: BookOpen, color: "text-green-400" },
                      { label: "Experiments", count: form.isLab ? form.experiments.filter((e) => e.name.trim()).length : 0, icon: FlaskRound, color: "text-purple-400" },
                      { label: "Videos", count: form.videos.filter((v) => v.url.trim()).length, icon: Video, color: "text-pink-400" },
                      { label: "PYQs", count: form.pyqs.filter((q) => q.pdfUrl.trim()).length, icon: FileText, color: "text-indigo-400" },
                    ].map(({ label, count, icon: Icon, color }) => (
                      <div key={label} className="p-3 rounded-xl bg-white/[0.02] border border-white/8 text-center">
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-[10px] text-gray-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Re-ingest / ingest toggle */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 cursor-pointer" onClick={() => setIngestAfterSave((v) => !v)}>
                    <div className={`w-10 h-6 rounded-full transition-all shrink-0 ${ingestAfterSave ? "bg-indigo-500" : "bg-white/10"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-1 mx-1 ${ingestAfterSave ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {editTarget ? "Re-generate AI Embeddings after saving" : "Generate AI Embeddings after creation"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {editTarget ? "Turn on if you changed the syllabus content" : "Needed for the AI Chatbot to access this subject's syllabus"}
                      </p>
                    </div>
                  </div>

                  {ingestStatus && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      {ingestStatus}
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/8 shrink-0 bg-[#080b18]/50">
              <button
                onClick={() => wizardStep > 1 ? setWizardStep((s) => s - 1) : closeWizard()}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/8 transition-all disabled:opacity-50"
              >
                {wizardStep > 1 ? <><ChevronLeft className="w-4 h-4" /> Back</> : <><X className="w-4 h-4" /> Cancel</>}
              </button>

              {wizardStep < totalSteps ? (
                <button
                  onClick={() => stepValid(wizardStep) && setWizardStep((s) => s + 1)}
                  disabled={!stepValid(wizardStep)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={editTarget ? handleUpdate : handleCreate}
                  disabled={submitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl disabled:opacity-50 text-white text-sm font-bold transition-all shadow-lg ${editTarget ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-indigo-500/20" : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20"}`}
                >
                  {submitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> {editTarget ? "Saving…" : "Creating…"}</>
                  ) : editTarget ? (
                    <><Check className="w-4 h-4" /> Save Changes</>
                  ) : (
                    <><Check className="w-4 h-4" /> Create Subject</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border animate-slideUp whitespace-nowrap ${
            toast.type === "success"
              ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-900/90 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
