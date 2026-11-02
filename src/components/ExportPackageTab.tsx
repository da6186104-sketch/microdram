import React from 'react';
import { FileText, FileSpreadsheet, FileCode, Printer, PackageOpen } from 'lucide-react';

interface ExportPackageTabProps {
  exportPreviewText: string;
  onExportTxt: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onPrintPdf: () => void;
}

export const ExportPackageTab: React.FC<ExportPackageTabProps> = ({
  exportPreviewText,
  onExportTxt,
  onExportCsv,
  onExportJson,
  onPrintPdf,
}) => {
  return (
    <section className="space-y-6" aria-label="Export Production Package">
      <div className="studio-surface rounded-2xl p-6">
        <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-2">
          <PackageOpen className="w-5 h-5 shrink-0" />
          <span>Export Production Package</span>
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Unduh seluruh naskah microdrama, character sheet, daftar prompt visual + dialog terpadu, atau cetak storyboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={onExportTxt}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <FileText className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white group-hover:text-emerald-300 text-sm">
              Naskah & Prompt (.TXT / .MD)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Berisi daftar karakter, sinopsis, dialog per adegan, dan prompt terpadu.
            </p>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <FileSpreadsheet className="w-7 h-7 text-sky-400 mb-3" />
            <h3 className="font-bold text-white group-hover:text-sky-300 text-sm">
              Tabel Storyboard (.CSV)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Bisa dibuka langsung di Excel atau Google Sheets untuk produksi tim.
            </p>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <FileCode className="w-7 h-7 text-amber-400 mb-3" />
            <h3 className="font-bold text-white group-hover:text-amber-300 text-sm">
              Project Backup (.JSON)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simpan seluruh data proyek & character sheet untuk diedit kembali.
            </p>
          </button>

          <button
            type="button"
            onClick={onPrintPdf}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <Printer className="w-7 h-7 text-purple-400 mb-3" />
            <h3 className="font-bold text-white group-hover:text-purple-300 text-sm">
              Cetak / Save PDF
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Cetak dokumen storyboard beserta gambar per adegan ke PDF.
            </p>
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="mt-6">
          <label
            htmlFor="export-preview-text"
            className="block text-xs font-semibold text-slate-300 mb-2"
          >
            Pratinjau Dokumen Produksi Lengkap
          </label>
          <textarea
            id="export-preview-text"
            rows={14}
            readOnly
            value={exportPreviewText}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
};
