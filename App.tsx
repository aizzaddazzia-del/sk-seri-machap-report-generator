import React, { useState, useRef } from 'react';
import { FileDown, RefreshCcw, Eye, Edit2, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportData, UnitType } from './types';
import { InputGroup, Input, Select, TextArea } from './components/InputGroup';
import { ImageUpload } from './components/ImageUpload';
import { ReportTemplate } from './components/ReportTemplate';

const INITIAL_DATA: ReportData = {
  programName: '',
  organizerCustom: '',
  organizerUnit: '',
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  target: '',
  objectives: '',
  activities: '',
  strengths: '',
  weaknesses: '',
  preparedBy: { name: '', position: '' },
  verifiedBy: { name: '', position: '' },
  images: []
};

export default function App() {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Ref for the template component to capture
  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof ReportData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'preparedBy' | 'verifiedBy', field: 'name' | 'position', value: string) => {
    setData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const setImages = (newImages: string[]) => {
    setData(prev => ({ ...prev, images: newImages }));
  };

  const generatePDF = async () => {
    if (!printRef.current) return;
    
    setIsGenerating(true);
    
    // Ensure preview is visible for capture (if hidden in real app logic, but here we might switch view)
    // For specific requirement "Click Button -> Generate", we will render it off-screen or briefly 
    // but the cleanest way in React is usually to toggle a "Preview Mode" then Print, or use a hidden div.
    // However, capturing a hidden div often causes layout issues.
    // We will force 'showPreview' to true temporarily if it isn't.
    
    const wasPreviewing = showPreview;
    if (!showPreview) setShowPreview(true);

    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const element = printRef.current;
      if (!element) throw new Error("Template not found");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // For images
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 size in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Laporan_${data.programName.replace(/\s+/g, '_') || 'SKSM'}.pdf`);

    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Gagal menjana PDF. Sila cuba lagi.");
    } finally {
      setIsGenerating(false);
      if (!wasPreviewing) setShowPreview(false);
    }
  };

  const resetForm = () => {
    if(window.confirm("Adakah anda pasti mahu memadam semua data?")) {
        setData(INITIAL_DATA);
        setShowPreview(false);
    }
  };

  return (
    <div className="min-h-screen font-sans pb-20">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src="https://i.postimg.cc/VNY3bGrQ/Lencana-SK-SERI-MACHAP-01.png" alt="Logo" className="h-10 w-auto" />
                <span className="font-bold text-slate-800 text-lg hidden sm:block">Sistem Laporan SKSM</span>
            </div>
            
            <div className="flex gap-2">
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    {showPreview ? <><Edit2 size={16}/> Sunting</> : <><Eye size={16}/> Lihat Template</>}
                </button>
                <button 
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <FileDown size={16}/>}
                    {isGenerating ? 'Menjana...' : 'JANA PDF'}
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toggle between Form and Preview */}
        {showPreview ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Pratonton Laporan</h2>
                    <p className="text-sm text-slate-500">Pastikan semua ejaan betul sebelum menjana PDF.</p>
                </div>
                <ReportTemplate ref={printRef} data={data} />
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 md:p-8 space-y-8">
                    
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Butiran Laporan</h1>
                            <p className="text-slate-500 mt-1">Isi maklumat di bawah untuk menjana Laporan Satu Muka Surat.</p>
                        </div>
                        <button onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors p-2" title="Reset Form">
                            <RefreshCcw size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Nama Program / Aktiviti" className="md:col-span-2">
                            <Input 
                                placeholder="Cth: Sambutan Hari Guru 2024"
                                value={data.programName}
                                onChange={(e) => handleInputChange('programName', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Anjuran (Nama Penganjur)">
                            <Input 
                                placeholder="Cth: Panitia Bahasa Melayu"
                                value={data.organizerCustom}
                                onChange={(e) => handleInputChange('organizerCustom', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Anjuran (Unit)">
                            <Select 
                                value={data.organizerUnit}
                                onChange={(e) => handleInputChange('organizerUnit', e.target.value)}
                            >
                                <option value="">-- Sila Pilih Unit --</option>
                                <option value={UnitType.KURIKULUM}>{UnitType.KURIKULUM}</option>
                                <option value={UnitType.HEM}>{UnitType.HEM}</option>
                                <option value={UnitType.KOKURIKULUM}>{UnitType.KOKURIKULUM}</option>
                            </Select>
                        </InputGroup>

                        <InputGroup label="Tarikh">
                            <Input 
                                type="date"
                                value={data.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                            />
                        </InputGroup>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Mula">
                                <Input 
                                    type="time"
                                    value={data.startTime}
                                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="Tamat">
                                <Input 
                                    type="time"
                                    value={data.endTime}
                                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                                />
                            </InputGroup>
                        </div>

                        <InputGroup label="Tempat" className="md:col-span-2">
                            <Input 
                                placeholder="Cth: Dewan SK Seri Machap"
                                value={data.venue}
                                onChange={(e) => handleInputChange('venue', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Sasaran" className="md:col-span-2">
                            <TextArea 
                                placeholder="Cth: Semua murid Tahun 6 dan Guru"
                                value={data.target}
                                onChange={(e) => handleInputChange('target', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Objektif" className="md:col-span-2">
                            <TextArea 
                                placeholder="Senaraikan objektif program..."
                                rows={3}
                                value={data.objectives}
                                onChange={(e) => handleInputChange('objectives', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Ringkasan Aktiviti" className="md:col-span-2">
                            <TextArea 
                                placeholder="1. Pendaftaran\n2. Ucapan Alu-aluan..."
                                rows={4}
                                value={data.activities}
                                onChange={(e) => handleInputChange('activities', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Kekuatan">
                            <TextArea 
                                placeholder="Nyatakan kekuatan program..."
                                value={data.strengths}
                                onChange={(e) => handleInputChange('strengths', e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup label="Kelemahan">
                            <TextArea 
                                placeholder="Nyatakan kelemahan program..."
                                value={data.weaknesses}
                                onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <ImageUpload images={data.images} setImages={setImages} />
                    </div>

                    <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Disediakan Oleh</h3>
                            <div className="space-y-4">
                                <InputGroup label="Nama Penuh">
                                    <Input 
                                        value={data.preparedBy.name}
                                        onChange={(e) => handleNestedChange('preparedBy', 'name', e.target.value)}
                                        placeholder="Nama Pelapor"
                                    />
                                </InputGroup>
                                <InputGroup label="Jawatan">
                                    <Input 
                                        value={data.preparedBy.position}
                                        onChange={(e) => handleNestedChange('preparedBy', 'position', e.target.value)}
                                        placeholder="Cth: Setiausaha Program"
                                    />
                                </InputGroup>
                            </div>
                         </div>

                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Disahkan Oleh</h3>
                            <div className="space-y-4">
                                <InputGroup label="Nama Penuh">
                                    <Input 
                                        value={data.verifiedBy.name}
                                        onChange={(e) => handleNestedChange('verifiedBy', 'name', e.target.value)}
                                        placeholder="Nama Pengesah"
                                    />
                                </InputGroup>
                                <InputGroup label="Jawatan">
                                    <Input 
                                        value={data.verifiedBy.position}
                                        onChange={(e) => handleNestedChange('verifiedBy', 'position', e.target.value)}
                                        placeholder="Cth: Guru Besar"
                                    />
                                </InputGroup>
                            </div>
                         </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={() => setShowPreview(true)}
                            className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl w-full md:w-auto text-center"
                        >
                            Semak Laporan & Jana PDF
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}