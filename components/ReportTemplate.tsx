import React, { forwardRef } from 'react';
import { ReportData } from '../types';

interface ReportTemplateProps {
  data: ReportData;
}

export const ReportTemplate = forwardRef<HTMLDivElement, ReportTemplateProps>(({ data }, ref) => {
  // Pad images to ensure grid remains consistent if fewer than 6 images
  const displayImages = [...data.images];
  while (displayImages.length < 6) {
    displayImages.push('');
  }

  // Format Date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Theme Constants
  const borderColor = "border-blue-900";
  const headerBg = "bg-blue-100";
  const headerText = "text-blue-900";
  const labelClass = `${headerBg} ${headerText} px-2 py-1 text-[11px] font-bold uppercase border-b ${borderColor} tracking-wider`;

  return (
    <div className="bg-gray-500 p-8 overflow-auto flex justify-center min-h-screen">
       {/* A4 Container - Optimized padding (10mm instead of 15mm) to raise content */}
      <div 
        ref={ref}
        id="report-content"
        className="bg-white w-[210mm] min-h-[297mm] shadow-2xl mx-auto p-[10mm] relative box-border font-serif text-slate-900 leading-snug"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
            <img 
                src="https://i.postimg.cc/VNY3bGrQ/Lencana-SK-SERI-MACHAP-01.png" 
                alt="Logo SK Seri Machap" 
                className="h-20 w-auto mb-2"
            />
            <h1 className={`text-xl font-bold uppercase tracking-widest text-center border-b-2 ${borderColor} pb-1 mb-1 text-blue-900`}>
                One Page Report SK Seri Machap
            </h1>
        </div>

        {/* Main Table */}
        <div className={`border-2 ${borderColor}`}>
            
            {/* Row 1: Program Name */}
            <div className={`border-b ${borderColor}`}>
                <div className={`${labelClass} text-center`}>
                    Nama Program / Aktiviti
                </div>
                <div className="p-2 font-bold text-center text-lg uppercase min-h-[40px] flex items-center justify-center text-slate-900">
                    {data.programName || '-'}
                </div>
            </div>

            {/* Row 2: Grid for Organizer, Date, Time, Place */}
            <div className={`grid grid-cols-2 border-b ${borderColor}`}>
                {/* Col 1 */}
                <div className={`border-r ${borderColor}`}>
                    <div className={labelClass}>
                        Anjuran
                    </div>
                    <div className="p-2 text-sm min-h-[40px]">
                       <div className="font-semibold uppercase">{data.organizerCustom}</div>
                       <div className="text-blue-800 italic text-xs">{data.organizerUnit}</div>
                    </div>
                </div>
                 {/* Col 2 */}
                 <div>
                    <div className={labelClass}>
                        Tempat
                    </div>
                    <div className="p-2 text-sm min-h-[40px] uppercase">
                        {data.venue || '-'}
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-2 border-b ${borderColor}`}>
                 {/* Col 1 */}
                 <div className={`border-r ${borderColor}`}>
                    <div className={labelClass}>
                        Tarikh
                    </div>
                    <div className="p-2 text-sm uppercase">
                        {formatDate(data.date)}
                    </div>
                </div>
                {/* Col 2 */}
                <div>
                    <div className={labelClass}>
                        Masa
                    </div>
                    <div className="p-2 text-sm uppercase">
                        {data.startTime} - {data.endTime}
                    </div>
                </div>
            </div>

            {/* Row: Objectives & Target */}
             <div className={`border-b ${borderColor}`}>
                <div className={labelClass}>
                    Sasaran
                </div>
                <div className="p-2 text-sm min-h-[30px] whitespace-pre-wrap">
                    {data.target || '-'}
                </div>
            </div>

            <div className={`border-b ${borderColor}`}>
                <div className={labelClass}>
                    Objektif
                </div>
                <div className="p-2 text-sm min-h-[40px] whitespace-pre-wrap">
                    {data.objectives || '-'}
                </div>
            </div>

             {/* Row: Activities */}
             <div className={`border-b ${borderColor}`}>
                <div className={labelClass}>
                    Ringkasan Aktiviti
                </div>
                <div className="p-2 text-sm min-h-[50px] whitespace-pre-wrap">
                    {data.activities || '-'}
                </div>
            </div>

             {/* Row: Strengths & Weaknesses */}
             <div className={`grid grid-cols-2 border-b ${borderColor}`}>
                <div className={`border-r ${borderColor}`}>
                    <div className={`${labelClass} text-center`}>
                        Kekuatan
                    </div>
                    <div className="p-2 text-sm min-h-[60px] whitespace-pre-wrap">
                         {data.strengths || '-'}
                    </div>
                </div>
                <div>
                    <div className={`${labelClass} text-center`}>
                        Kelemahan
                    </div>
                    <div className="p-2 text-sm min-h-[60px] whitespace-pre-wrap">
                        {data.weaknesses || '-'}
                    </div>
                </div>
             </div>

             {/* Row: Images Grid (3x2) */}
             <div className={`border-b ${borderColor}`}>
                <div className={`${labelClass} text-center`}>
                    Laporan Bergambar
                </div>
                {/* Adjusted height to 280px to save vertical space for signatures */}
                <div className="grid grid-cols-3 grid-rows-2 h-[280px]">
                    {displayImages.map((img, i) => (
                        <div key={i} className={`relative border-r border-b ${borderColor} overflow-hidden flex items-center justify-center bg-white ${
                            (i + 1) % 3 === 0 ? 'border-r-0' : ''
                        } ${ i >= 3 ? 'border-b-0' : ''}`}>
                            {img ? (
                                <img src={img} alt={`Pic ${i}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-200 text-xs">Tiada Gambar</div>
                            )}
                        </div>
                    ))}
                </div>
             </div>

             {/* Row: Signatures */}
             <div className="grid grid-cols-2">
                <div className={`border-r ${borderColor} p-3 flex flex-col justify-between h-36`}>
                     <div className="text-[11px] font-bold uppercase text-blue-900">Disediakan Oleh:</div>
                     {/* Signature Space */}
                     <div className="flex-grow"></div> 
                     <div>
                        <div className="font-bold text-sm uppercase leading-tight border-b border-blue-900 border-dotted pb-1 mb-1 inline-block min-w-[200px]">
                            {data.preparedBy.name || '(NAMA PENUH)'}
                        </div>
                        <div className="text-[11px] uppercase text-slate-700 font-semibold">{data.preparedBy.position || 'JAWATAN'}</div>
                     </div>
                </div>
                <div className="p-3 flex flex-col justify-between h-36">
                    <div className="text-[11px] font-bold uppercase text-blue-900">Disahkan Oleh:</div>
                    {/* Signature Space */}
                    <div className="flex-grow"></div>
                    <div>
                        <div className="font-bold text-sm uppercase leading-tight border-b border-blue-900 border-dotted pb-1 mb-1 inline-block min-w-[200px]">
                            {data.verifiedBy.name || '(NAMA PENUH)'}
                        </div>
                        <div className="text-[11px] uppercase text-slate-700 font-semibold">{data.verifiedBy.position || 'JAWATAN'}</div>
                    </div>
                </div>
             </div>

        </div>
        
        <div className="text-[10px] text-center mt-2 text-slate-400 italic">
            Dijana secara automatik oleh Sistem Laporan SK Seri Machap
        </div>
      </div>
    </div>
  );
});

ReportTemplate.displayName = 'ReportTemplate';